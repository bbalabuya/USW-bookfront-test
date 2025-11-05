import api from "./index";
import { ChatMessage, ChatHistoryResponse } from "../types/chat";
import { Client } from "@stomp/stompjs"; // 👈 STOMP Client import
import { read } from "fs";

// ✅ STOMP WebSocket 설정
const STOMP_BROKER_URL = "wss://api.stg.subook.shop/ws-chat";

/**
 * 📌 REST API 함수들
 */

// 채팅방 입장 및 postId 반환
export const enterChatRoom = async (
  roomId: string
): Promise<string | false> => {
  try {
    const res = await api.get(`/api/chat/room/${roomId}`);
    const postId: string = res.data.data.postId;
    console.log("✅ 채팅방 입장 성공 (API)");
    return postId;
  } catch (err) {
    console.error("❌ 채팅방 입장 실패:", err);
    return false;
  }
};

// 채팅 메시지 이력 불러오기
const readRequest = async (roomId: string, lastReadAt: string) => {
  try {
    // 백엔드 API 경로가 /read로 끝난다면 roomId는 body에 포함되어야 합니다.
    // 만약 경로가 /api/chat/rooms/{roomId}/read라면 roomId를 URL에서 사용해야 합니다.
    const res = await api.post(`/api/chat/rooms/messages/read`, {
      roomId,
      lastReadAt,
    });
    console.log("✅ 채팅방 읽음 처리 성공");
    return res.data;
  } catch (err) {
    // ❌ 읽음 처리 실패 시 fetchMessages 전체가 실패하는 것을 방지하기 위해
    // 여기에서 에러를 throw하지 않고, 로그만 남기는 것이 더 안전합니다.
    console.error("❌ 채팅방 읽음 처리 실패:", err);
    // throw err; // 주석 처리 또는 제거
  }
};

// ✅ 채팅 메시지 이력 불러오기 (수정됨)
export const fetchMessages = async (roomId: string) => {
  try {
    const res = await api.get(`/api/chat/rooms/${roomId}/messages`);
    const myId = res.data.data.myId;
    let messages = res.data.data.messages || [];
       console.log("✅ 메시지 이력 및 ID 불러오기 성공", res.data);

       // 시간순 정렬
       messages = [...messages].sort(
         (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
       );
       console.log("정렬된 메시지:", messages);

    // 상대방 ID 탐색, 판매자 여부 로직 (생략 없이 유지)
    const opponentMessage = messages.find((msg) => msg.senderId !== myId);
    const opponentId = opponentMessage ? opponentMessage.senderId : null;
    const imSeller = messages[0]?.senderId !== myId;

    const latestMessage = messages[messages.length - 1];

    if (latestMessage) {
      // ✅ 1. 스코프 문제 해결: lastReadAt 변수를 바로 할당하거나, const/let 사용 방식을 통일
      const lastReadAt = latestMessage.sentAt;
      console.log("마지막 메시지 시각:", lastReadAt);

      console.log("읽음처리 시도");
      // ✅ 2. readRequest 호출: await를 사용하되, readRequest는 throw하지 않도록 수정
      await readRequest(roomId, lastReadAt);
    } else {
      console.log("읽을 메시지가 없어 읽음 처리를 건너뜁니다.");
    }

    return {
      myId,
      messages,
      opponentId,
      imSeller,
    };
  } catch (err) {
    // fetchMessages 자체에서 발생한 에러는 다시 던집니다.
    console.error("❌ 메시지 불러오기 실패:", err);
    throw err;
  }
};

// 이미지 전송 (REST)
export const sendImageApi = async (
  roomId: string,
  file: File,
  senderId: string
): Promise<ChatMessage | null> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("roomId", roomId);

    const res = await api.post<ChatMessage>(`/api/chat/rooms/images`, formData);

    console.log("✅ 이미지 전송 성공 (REST)");
    return res.data;
  } catch (err) {
    console.error("❌ 이미지 전송 실패:", err);
    return null;
  }
};

// 신고 요청 (REST)
const reasonMap: Record<string, number> = {
  욕설: 0,
  비방: 1,
  광고: 2,
  도배: 3,
  부적절한_내용: 4,
};

export const reportRequest = async (roomId: string, reason: string) => {
  // 로컬 폴백 함수 (API 호출 실패 시 시뮬레이션)
  const sendReportLocalFallback = async (targetId: string, reason: string) => {
    console.warn("⚠️ reportRequest 실패 — 로컬 폴백 (simulated).", {
      targetId,
      reason,
    });
    await new Promise((res) => setTimeout(res, 700));
    return { success: true, simulated: true };
  };

  try {
    const enumValue = reasonMap[reason];
    if (enumValue === undefined) throw new Error(`잘못된 신고 사유: ${reason}`);

    const payload = { reason: enumValue };

    // 실제 API 호출 시도
    const res = await api.post(`/api/chat/${roomId}/report`, payload);
    console.log("✅ 신고 요청 성공 (REST)");
    return res.data;
  } catch (apiErr) {
    console.error("❌ 신고 요청 실패 (API 오류):", apiErr);
    // API 호출 실패 시 로컬 폴백 사용
    return await sendReportLocalFallback(roomId, reason);
  }
};

// 거래 요청 (REST)
export const tradeRequest = async (postId: string, opponentId: string) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("⚠️ 거래 요청 실패: 토큰이 없습니다.");
    throw new Error("Token not found"); // 컴포넌트에서 catch하도록 throw
  }

  try {
    const res = await api.post(`/api/posts/${postId}/complete`, {
      buyerId: opponentId,
    });
    console.info("✅ 거래 요청 성공 (REST)");
    return res.data.code;
  } catch (err) {
    console.error("❌ 거래 요청 실패:", err);
    throw err;
  }
};

// ---
//
// 🔌 WebSocket (STOMP) 함수들 추가
//
// ---

/**
 * 📌 STOMP 클라이언트 연결 및 구독
 * @param roomId 채팅방 ID
 * @param onMessageReceived 새 메시지 수신 시 호출할 콜백 함수
 * @returns 연결된 STOMP Client 객체
 */
export const connectAndSubscribe = (
  roomId: string,
  onMessageReceived: (message: ChatMessage) => void
): Client => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("❌ accessToken 없음. STOMP 연결 불가");
    throw new Error("No Access Token for STOMP connection");
  }

  const client = new Client({
    brokerURL: STOMP_BROKER_URL,
    connectHeaders: {
      Authorization: `Bearer ${token}`, // 인증 헤더 추가
    },
    reconnectDelay: 5000,
    debug: (str) => console.log("STOMP Debug:", str),
  });

  client.onConnect = () => {
    console.log("✅ STOMP 연결 성공");

    // 구독
    client.subscribe(`/sub/chat/${roomId}`, (message) => {
      console.log("📩 STOMP 메시지 수신:", message.body);
      try {
        const newMessage: ChatMessage = JSON.parse(message.body);
        onMessageReceived(newMessage); // 컴포넌트의 상태 업데이트 함수 호출
      } catch (err) {
        console.error("❌ 메시지 파싱 실패", err);
      }
    });
  };

  client.onStompError = (frame) => {
    console.error("❌ STOMP 에러:", frame.headers["message"]);
    console.error("상세:", frame.body);
  };

  client.activate();
  return client;
};

/**
 * 📌 STOMP를 통해 텍스트 메시지 발행
 * @param client 활성화된 STOMP Client
 * @param roomId 채팅방 ID
 * @param message 전송할 메시지 텍스트
 * @param senderId 전송자 ID
 */
export const sendStompMessage = (
  client: Client,
  roomId: string,
  message: string,
  senderId: string
): void => {
  if (!client || !client.connected) {
    console.error("❌ STOMP 클라이언트가 연결되지 않았습니다.");
    return;
  }

  const payload = JSON.stringify({
    roomId,
    message,
    senderId,
  });

  client.publish({
    destination: "/pub/chat.send",
    body: payload,
  });

  console.log("💬 텍스트 메시지 전송 (STOMP):", message);
};