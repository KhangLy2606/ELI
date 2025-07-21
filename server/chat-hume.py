import os
import asyncio
import jwt
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean, JSON, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from sqlalchemy.dialects.postgresql import UUID
from hume import HumeStreamClient
from hume.models.config import LanguageConfig
from dotenv import load_dotenv
import uuid
from datetime import datetime

# --- Environment and Configuration ---
load_dotenv()
HUME_API_KEY = os.getenv("HUME_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET") # Ensure you have the same JWT secret as your Node.js app

# --- FastAPI App Initialization ---
app = FastAPI()

# --- Database Setup (SQLAlchemy) based on your ERD ---
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the database models matching your existing schema
class ChatGroup(Base):
    __tablename__ = "chat_groups"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_start_timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    most_recent_start_timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    num_chats = Column(Integer, nullable=False, default=0)
    active = Column(Boolean, nullable=False, default=False)
    chats = relationship("Chat", back_populates="chat_group")

class Chat(Base):
    __tablename__ = "chats"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_group_id = Column(UUID(as_uuid=True), ForeignKey('chat_groups.id'), nullable=False)
    # Add user_id to link chats to users, making it compatible with your Node.js backend
    user_id = Column(UUID(as_uuid=True), nullable=False) # Assuming your users table uses UUIDs
    start_timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_timestamp = Column(DateTime, nullable=True)
    event_count = Column(Integer, nullable=False, default=0)
    chat_group = relationship("ChatGroup", back_populates="chats")
    events = relationship("ChatEvent", back_populates="chat")

class ChatEvent(Base):
    __tablename__ = "chat_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = Column(UUID(as_uuid=True), ForeignKey('chats.id'), nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    role = Column(String, nullable=False)
    type = Column(String, nullable=False)
    message_text = Column(String, nullable=True)
    emotion_features = Column(JSON, nullable=True)
    chat = relationship("Chat", back_populates="events")

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Authentication Logic ---
async def get_current_user_id(token: str = Query(...)):
    """Decodes the JWT from the query parameter to get the user ID."""
    if not token:
        return None
    try:
        # This should match the decoding logic in your Node.js app
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        # The payload from your Node.js auth.js is { userId: user.id, email: user.email }
        return payload.get("userId")
    except jwt.PyJWTError:
        return None


# --- WebSocket Logic ---
@app.websocket("/ws")
async def websocket_endpoint(
        frontend_ws: WebSocket,
        db: Session = Depends(get_db),
        user_id: str = Depends(get_current_user_id)
):
    """
    Handles the WebSocket connection, authenticates the user, and proxies to Hume EVI.
    """
    await frontend_ws.accept()
    if not user_id:
        await frontend_ws.close(code=1008, reason="Invalid or missing token")
        return

    chat_group = None
    chat_session = None

    try:
        hume_client = HumeStreamClient(HUME_API_KEY)
        config = LanguageConfig(granularity="word")

        async with hume_client.connect([config]) as hume_socket:
            print(f"Successfully connected to Hume EVI for user {user_id}.")

            # Create new Chat Group and Chat Session, now linked to the authenticated user
            chat_group = ChatGroup(active=True, num_chats=1)
            db.add(chat_group)
            db.commit()

            chat_session = Chat(chat_group_id=chat_group.id, user_id=user_id)
            db.add(chat_session)
            db.commit()
            db.refresh(chat_session)

            print(f"Created Chat Group: {chat_group.id} and Chat: {chat_session.id} for user {user_id}")

            async def forward_to_hume():
                while True:
                    data = await frontend_ws.receive_text()
                    await hume_socket.send_text_input(data)

            async def forward_to_frontend():
                nonlocal chat_session
                async for message in hume_socket:
                    await frontend_ws.send_json(message)
                    if message["type"] in ["user_message", "assistant_message"]:
                        chat_event = ChatEvent(
                            chat_id=chat_session.id,
                            role=message["message"]["role"],
                            type=message["type"],
                            message_text=message["message"]["content"],
                            emotion_features=message.get("models", {}).get("prosody", {}).get("scores", {})
                        )
                        db.add(chat_event)
                        chat_session.event_count += 1
                        db.commit()

            await asyncio.gather(forward_to_hume(), forward_to_frontend())

    except WebSocketDisconnect:
        print(f"Frontend disconnected for user {user_id}.")
    except Exception as e:
        print(f"An error occurred for user {user_id}: {e}")
    finally:
        if chat_session:
            chat_session.end_timestamp = datetime.utcnow()
        if chat_group:
            chat_group.active = False
        db.commit()
        print(f"Connection for user {user_id} closed and database updated.")

