// src/API/single.ts
import api from "./index";
import { Book } from "../types/singleType";

/**
 * 📌 게시글 상세 조회
 */
export const fetchBookDetail = async (postId: string): Promise<Book | null> => {
  try {
    console.groupCollapsed("📡 게시글 상세 요청 시작");
    const res = await api.get(`/api/posts/${postId}`);
    console.info("✅ 게시글 불러오기 성공");
    console.log("응답 데이터:", res.data);
    return res.data.data;
  } catch (err) {
    console.error("❌ 게시글 불러오기 실패:", err);
    return null;
  } finally {
    console.groupEnd();
  }
};

/**
 * 📌 채팅방 생성 요청
 */
export const createChatRoom = async (
  postId: string
)=> {
  try {
    console.log("📡 채팅방 생성 요청 시작");
    const res = await api.post<{ roomId: string }>(
      `/api/chat/rooms`,
      { postId }
    );
    console.info("✅ 채팅방 생성 성공");
    console.debug("응답 roomId:", res.data.roomId);
    return res.data.roomId || null;
  } catch (err) {
    console.error("❌ 채팅방 생성 실패:", err);
  } 
};
