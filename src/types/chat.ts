// src/types/chat.ts
export interface MyID {
  myID: string;
}

export interface ChatMessage {
  messageId: string;
  roomId: string;
  senderId: string;
  message: string;
  sentAt: string;
}

export interface ChatHistoryResponse {
  code: string;
  message: string;
  data: {
    myId: string;
    messages: ChatMessage[];
  };
}


export interface EnterResponse{
  roomId: string,
  postId: string,
  name: string | null,
  userCount: number,
  lastMessage: string,
  lastTimestamp: string
}