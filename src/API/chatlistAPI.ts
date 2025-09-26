// src/API/chatlist.ts
import api from "./index";
import { ChatRoom } from "../types/chatlist";

// 채팅방 목록 불러오기
export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    console.log("📡 채팅방 목록 요청 시작");
    const res = await api.get<{
      code: number;
      message: string;
      data: ChatRoom[];
    }>("/api/chat/rooms");
    console.info("✅ 채팅방 목록 불러오기 성공");
    console.debug("응답 데이터:", res.data);

    if (Array.isArray(res.data.data)) {
      return res.data.data;
    } else {
      console.warn("⚠️ API 응답에 data 배열이 없음:", res.data);
      return [];
    }
  } catch (err) {
    console.error("❌ 채팅방 목록 불러오기 실패:", err);
    return [];
  } finally {
    console.groupEnd();
  }
};
