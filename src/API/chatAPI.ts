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

// 채팅 메시지 불러오기
export const fetchMessages = async (roomId: string) => {
  try {
    const res = await api.get(`/api/chat/rooms/${roomId}/messages`);
    console.log("✅ 메시지 불러오기 성공:", res.data);

    const myId = res.data.data.myId;
    let messages = res.data.data.messages || [];

    // ✅ 1️⃣ 시간순 정렬 (중요)
    messages = [...messages].sort(
      (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
    );

    // ✅ 2️⃣ 상대방 ID 탐색 (내 ID와 다른 senderId)
    const opponentMessage = messages.find((msg) => msg.senderId !== myId);
    const opponentId = opponentMessage ? opponentMessage.senderId : null;

    // ✅ 3️⃣ 내가 판매자인지 여부 (첫 메시지가 상대가 보냈다면 판매자)
    const imSeller = messages[0]?.senderId !== myId;

    return {
      myId,
      messages,
      opponentId,
      imSeller,
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
    //formData.append("senderId", senderId);
    formData.append("roomId", roomId);
    console.log("✅ FormData 준비 완료:", formData);

    // ✅ 경로 수정 (파일 업로드용)
    const res = await api.post<ChatMessage>(`/api/chat/rooms/images`, formData);

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
/** 📌 신고 요청 (기본 구조 완성) */
export const reportRequest = async (postId: string, reason: string) => {
  try {
    const payload = {
      type: "post", // 고정값
      reason, // 한글 문자열
      Id: postId, // 서버가 요구하는 필드명 'Id'
    };

    console.log("📡 신고 요청 시작:", payload);
    const res = await api.post(`/api/posts/report`, payload);
    console.log("응답 데이터:", res.data);
    console.info("✅ 신고 요청 성공");
    return res.data;
  } catch (err) {
    console.error("❌ 신고 요청 실패:", err);
    throw err;
  }
};


/** 📌 거래 요청 */
export const tradeRequest = async (postId: string, opponentId: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("⚠️ 거래 요청 실패: 토큰이 없습니다.");
    return;
  }

  try {
    console.log("📡 거래 요청 시작");
    const res = await api.post(
      `/api/posts/${postId}/complete`,
      { buyerId: opponentId }, // ✅ body
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더는 config로 분리
        },
      }
    );
    console.log("응답 데이터:", res.data);
    console.info("✅ 거래 요청 성공");
    return res.data.code;
  } catch (err) {
    console.error("❌ 거래 요청 실패:", err);
  }
};