
const AudioStatus = Object.freeze({
    QUEUED: 'QUEUED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
    CANCELED: 'CANCELED',
});

const ChatStatus = Object.freeze({
    USER_ENDED: 'USER_ENDED',
    COMPLETE: 'COMPLETE',
    ACTIVE: 'ACTIVE',
    ERROR: 'ERROR',
});

const EventRole = Object.freeze({
    SYSTEM: 'SYSTEM',
    USER: 'USER',
    AGENT: 'AGENT',
});

const EventType = Object.freeze({
    SYSTEM_PROMPT: 'SYSTEM_PROMPT',
    USER_MESSAGE: 'USER_MESSAGE',
    AGENT_MESSAGE: 'AGENT_MESSAGE',
    TOOL_CALL: 'TOOL_CALL',
    TOOL_RESPONSE: 'TOOL_RESPONSE',
    CHAT_METADATA: 'CHAT_METADATA',
});

module.exports = {
    AudioStatus,
    ChatStatus,
    EventRole,
    EventType,
};
