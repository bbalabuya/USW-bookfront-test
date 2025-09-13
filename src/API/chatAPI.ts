import api from "./index";
import { ChatMessage, ChatHistoryResponse } from "../types/chat";

// 📌 채팅 메시지 불러오기
export const fetchMessages = async (roomId: string): Promise<ChatMessage[]> => {
  try {
    const res = await api.get<ChatHistoryResponse>(
      `/api/chat/rooms/${roomId}/message`
    );
    return res.data.data.messages; // 서버 구조에 맞춰 messages 반환
  } catch (err) {
    console.error("메시지 불러오기 실패:", err);
    return [];
  }
};

// 📌 채팅 메시지 전송
export const sendMessageApi = async (
  roomId: string,
  message: string,
  senderId: string // 로그인한 사용자 ID
): Promise<ChatMessage | null> => {
  try {
    const res = await api.post(`/api/chat/rooms/${roomId}/messages`, {
      roomId,
      message,
      senderId,
    });
    return res.data; // 서버가 보내주는 메시지 객체 반환
  } catch (err) {
    console.error("메시지 전송 실패:", err);
    return null;
  }
};

// 📌 이미지 전송
export const sendImageApi = async (
  roomId: string,
  file: File
): Promise<ChatMessage | null> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post(`/api/chat/rooms/${roomId}/images`, formData);
    return res.data; // 서버가 보내주는 이미지 메시지 객체 반환
  } catch (err) {
    console.error("이미지 전송 실패:", err);
    return null;
  }
};

// 📌 신고하기
export const reportUser = async (
  roomId: string,
  reason: number
): Promise<boolean> => {
  try {
    await api.post(`/api/users/${roomId}/report`, { reason });
    return true;
  } catch (err) {
    console.error("신고 실패:", err);
    return false;
  }
};
