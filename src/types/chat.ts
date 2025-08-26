// src/types/chat.ts
export interface ChatMessage {
    messageId: string;
    roomId: string;
    senderId: string;
    message: string;
    sentAt: string;
  }
  
export interface EnterResponse{
  roomId: string,
  postId: string,
  name: string | null,
  userCount: number,
  lastMessage: string,
  lastTimestamp: string
}