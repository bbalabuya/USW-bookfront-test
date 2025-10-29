import api from "./index";
import { ChatMessage, ChatHistoryResponse } from "../types/chat";

export const enterChatRoom = async (
  roomId: string
): Promise<string | false> => {
  try {
    const res = await api.get(`/api/chat/room/${roomId}`);
    const postId: string = res.data.data.postId;
    console.log("✅ 채팅방 입장 성공");
    console.log("post ID : ", postId);
    return postId;
  } catch (err) {
    console.error("❌ 채팅방 입장 실패:", err);
    return false;
  }
};


// 처음 입장하고 내역 불러오기
export const fetchMessages = async (
  roomId: string
): Promise<{ myId: string; messages: ChatMessage[] }> => {
  try {
    const res = await api.get<ChatHistoryResponse>(
      `/api/chat/rooms/${roomId}/messages`
    );
    console.log("✅ 메시지 불러오기 성공:", res.data);
    return {
      myId: res.data.data.myId,
      messages: res.data.data.messages
    };
  } catch (err) {
    console.error("❌ 메시지 불러오기 실패:", err);
    throw err;
  }
};

// 메시지 전송
export const sendMessageApi = async (
  roomId: string,
  message: string,
  senderId: string // 로그인한 사용자 ID
): Promise<ChatMessage | null> => {
  try {
    const res = await api.post<ChatMessage>(
      `/api/chat/rooms/${roomId}/messages`,
      {
        roomId,
        message,
        senderId,
      }
    );
    console.log("✅ 메시지 전송 성공:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ 메시지 전송 실패:", err);
    return null;
  }
};

// ✅ 올바른 파일 업로드용 코드
export const sendImageApi = async (
  roomId: string,
  file: File,
  senderId: string
): Promise<ChatMessage | null> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("senderId", senderId);
    formData.append("roomId", roomId);
    console.log("✅ FormData 준비 완료:", formData);

    // ✅ 경로 수정 (파일 업로드용)
    const res = await api.post<ChatMessage>(
      `/api/chat/rooms/images`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("✅ 이미지 전송 성공:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ 이미지 전송 실패:", err);
    return null;
  }
};


/**
 * 📌 신고하기
 */
export const reportUser = async (roomId: string, reason: number): Promise<boolean> => {
  try {
    await api.post(`/api/chat/${roomId}/report`, { reason });
    console.log("✅ 신고 성공");
    return true;
  } catch (err) {
    console.error("❌ 신고 실패:", err);
    return false;
  }
};