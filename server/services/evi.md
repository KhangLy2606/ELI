# EVI Service (`eviService.js`)

## Architecture
The service acts as a proxy to:
* **Manage State**: Create and track conversation sessions in the database.
* **Persist Data**: Log all relevant conversation events to the PostgreSQL database in real-time.
* **Unify Communication**: Handle both voice (binary data) and text (JSON) over a single connection, as required by the Hume EVI.
* **Ensure Reliability**: Manage connection lifecycle, errors, and resource cleanup.

### Data Flow

```text
+----------------+      (1) WebSocket      +-----------------+      (3) WebSocket      +-------------+
|                | <----------------------> |                 | <----------------------> |             |
|  ELI Frontend  |      (Client-Server     |  Node.js Server |      (Server-Hume       |   Hume AI   |
| (Browser/App)  |        Protocol)       |  (eviService.js)  |         Proxy)         |   EVI API   |
|                | ---------------------> |                 | ---------------------> |             |
+----------------+      (2) User Input     +-----------------+      (4) Hume Events     +-------------+
     (Audio/Text)                                |      ^
                                                 |      | (5) DB Logging
                                                 v      |
                                           +----------------+
                                           |                |
                                           |  PostgreSQL DB |
                                           |                |
                                           +----------------+
```

### Data Flow
1.  **Client-Server Connection**: The frontend establishes a secure WebSocket connection.
2.  **User Input**: The client sends input as raw audio (binary) or structured text (JSON).
3.  **Server-Hume Proxy**: The service proxies this input to the Hume EVI API.
4.  **Hume Events**: Hume sends back a stream of events (transcripts, emotions, audio).
5.  **DB Logging & Client Proxy**: The service logs events to the database and forwards all events to the client.

### Core Logic (`handleConnection`)
The `handleConnection` function executes the following steps:

1.  **Accept Connection**: Takes over an authenticated WebSocket from `server.js`.
2.  **Wait for Initialization**: Pauses until it receives a `start_session` message from the client.
3.  **Authorize**: Validates that the `profile_id` in the start message belongs to the authenticated user.
4.  **Create DB Records**:
    * Inserts a new row into `chat_groups`.
    * Inserts a new row into `chats`, storing the `modality` ('voice' or 'chat') in the `metadata` field.
5.  **Connect to Hume**: Establishes a WebSocket connection to the Hume EVI API.
6.  **Route Client Messages**:
    * **Binary Data**: Forwards directly to Hume as streaming audio.
    * **JSON Data**: Parses and forwards to Hume as text input.
7.  **Route Hume Messages**:
    * Forwards every message directly to the client.
    * Parses the message and logs relevant events to the `chat_events` table.
8.  **Cleanup**: On disconnection, closes the Hume socket, updates the `chats` and `chat_groups` tables, and releases the database client.

### Client-Server Protocol
The frontend **MUST** adhere to this protocol.

#### A. Connection
Establish a WebSocket connection with a valid JWT.

-   **Endpoint**: `wss://<server_address>/ws?token=<user_jwt>`

#### B. Message Flow

##### Phase 1: Session Start (Client → Server)
Immediately after connecting, the client **MUST** send a single JSON message to configure the session.

-   **Message Format**:
    ```json
    {
      "type": "start_session",
      "payload": {
        "profile_id": "uuid-of-the-resident-profile",
        "modality": "voice" | "chat",
        "config_id": "optional-uuid-of-an-evi-config",
        "custom_session_id": "optional-custom-string-id"
      }
    }
    ```

##### Phase 2: Session Ready (Server → Client)
The server confirms the session is ready or sends an error.

-   **On Success**:
    ```json
    {
      "type": "session_ready",
      "chatId": "uuid-of-the-newly-created-chat-session"
    }
    ```
-   **On Error**:
    ```json
    {
      "type": "error",
      "message": "A descriptive error message."
    }
    ```

##### Phase 3: Active Communication (Bidirectional)
-   **Client → Server (Voice Input)**: Send raw **binary data** frames.
-   **Client → Server (Text Input)**: Send as a JSON object:
    ```json
    {
      "type": "user_input",
      "text": "The user's typed message goes here."
    }
    ```
-   **Server → Client (Hume Events)**: The server forwards all messages from Hume untouched. The client must be prepared to handle all Hume event types.

#### C. Session Termination
The connection can be terminated by either the client or the server.

-   **Client-Initiated**: The client application should close the WebSocket connection.
-   **Server-Initiated**: The server will close the connection if an unrecoverable error occurs.

In all termination scenarios, the `eviService.js` cleanup logic is triggered to ensure all resources are released and the chat session status is updated in the database.