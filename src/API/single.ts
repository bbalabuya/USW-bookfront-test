import api from "./index";
import { Book } from "../types/singleType";

/** 📌 게시글 상세 조회 */
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

/** 📌 채팅방 생성 요청 */
export const createChatRoom = async (postId: string) => {
  try {
    console.log("📡 채팅방 생성 요청 시작");
    const res = await api.post(`/api/chat/room`, { postId });
    console.log("응답 데이터:", res.data);
    console.info("✅ 채팅방 생성 성공");
    return res.data.data.roomId || null;
  } catch (err) {
    console.error("❌ 채팅방 생성 실패:", err);
  }
};

/** 📌 거래 요청 */
export const tradeRequest = async (postId: string) => {
  try {
    console.log("📡 거래 요청 시작");
    const res = await api.post(`/api/posts/${postId}/complete`);
    console.log("응답 데이터:", res.data);
    console.info("✅ 거래 요청 성공");
    return res.data.code;
  } catch (err) {
    console.error("❌ 거래 요청 실패:", err);
  }
};

/** 📌 신고 요청 (기본 구조 완성) */
export const reportRequest = async (postId: string, reason: number) => {
  try {
    console.log("📡 신고 요청 시작");
    const res = await api.post(`/api/posts/report`, {
      type: "POST",
      postId,
      reason,
    });
    console.log("응답 데이터:", res.data);
    console.info("✅ 신고 요청 성공");
    return res.data;
  } catch (err) {
    console.error("❌ 신고 요청 실패:", err);
    throw err;
  }
};
