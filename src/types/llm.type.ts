export interface IRetryConfig {
  jsonRetries: number;          // max JSON parse retries
  apiRetryDelays: number[];     // retry delays (ms) for API errors
  fallbackModel: string
};

export interface IAskNotePayload {
  query: string;
  noteId: string;
};

export type SocketMessageType  = "pull_db" | "text" | "tool_response" | "thinking" | "completed" | "error"
export interface ISocketResponse {
  type: SocketMessageType;
  content: {
    message: string;
  }
}

export interface IMessage {
  role: "user" | "assistant",
  content: string
}
