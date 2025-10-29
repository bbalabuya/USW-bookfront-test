import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  enterChatRoom,
  fetchMessages,
  sendImageApi,
  reportUser,
} from "../../API/chatAPI";
import { ChatMessage } from "../../types/chat";
import "./chat.css";
import return_button from "../../assets/return_button.png";
import dotButtonImg from "../../assets/dot_button.png";
import pictureImg from "../../assets/chat_picture.png";
import sendImg from "../../assets/send.png";
import { chatExampleMessages } from "../../mockData/chatMessage";
import { Client } from "@stomp/stompjs";

const Chat = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [dotButton, setDotButton] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | undefined>(undefined);

  const [myID, setMyID] = useState<string>("");
  const [stompClient, setStompClient] = useState<Client | null>(null); // STOMP client 상태 저장

  // 신고 사유 목록
  const reportReasons = [
    { id: 0, label: "욕설" },
    { id: 1, label: "비방" },
    { id: 2, label: "광고" },
    { id: 3, label: "도배" },
    { id: 4, label: "부적절한 내용" },
  ];

  // 점 3개 버튼 토글
  const toggleDotButton = () => setDotButton((prev) => !prev);
  const openReportModal = () => {
    console.log("📌 신고 모달 열기");
    setReportOpen(true);
    setDotButton(false);
  };
  const closeReportModal = () => {
    console.log("📌 신고 모달 닫기");
    setReportOpen(false);
    setReportReason(null);
  };

  // 신고 제출
  const handleReportSubmit = async () => {
    if (reportReason === null) return alert("신고 사유를 선택해주세요.");
    console.log("🚨 신고 제출 시작", { roomId, reportReason });
    try {
      await reportUser(roomId!, reportReason);
      console.log("✅ 신고 전송 성공");
      alert("신고가 접수되었습니다.");
      closeReportModal();
    } catch (err) {
      console.error("❌ 신고 전송 실패", err);
      alert("신고 전송 실패");
    }
  };

  // 이미지 선택 / 제거
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("📷 이미지 선택 시도");
    const file = e.target.files?.[0];
    if (!file) {
      console.log("❌ 파일 없음");
      return;
    }
    console.log("✅ 이미지 선택됨:", file.name);
    setSelectedFile(file);
    setSelectedImg(window.URL.createObjectURL(file));
  };
  const handleRemoveImage = () => {
    console.log("🗑️ 선택한 이미지 제거");
    setSelectedFile(null);
    setSelectedImg(undefined);
  };

  // 메시지 전송 함수
const sendMessage = async () => {
  if (!roomId) return console.error("❌ roomId 없음");
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  const hasImage = !!selectedFile;
  const hasText = inputMessage.trim().length > 0;

  // ⚙️ 예외 처리
  if (!hasImage && !hasText) {
    alert("전송할 내용이 없습니다.");
    return;
  }

  try {
    // 🖼️ 1️⃣ 이미지가 있다면 먼저 REST로 전송
    if (hasImage) {
      console.log("🖼️ 이미지 전송 시도:", selectedFile?.name);
      const sentImg = await sendImageApi(roomId, selectedFile!, myID);

      console.log("✅ 이미지 전송 성공:", sentImg);
      setSelectedFile(null);
      setSelectedImg(undefined);

      // 서버가 STOMP로 브로드캐스트하지 않는다면 직접 추가
      // setMessages((prev) => [...prev, sentImg]);

      // 💬 2️⃣ 이미지 성공 후 텍스트도 있다면 STOMP로 전송
      if (hasText && stompClient && stompClient.connected) {
        console.log("💬 이미지 전송 성공 후 텍스트 전송:", inputMessage);
        stompClient.publish({
          destination: "/pub/chat.send",
          body: JSON.stringify({
            roomId,
            message: inputMessage,
            senderId: myID || "me",
          }),
        });
        setInputMessage("");
      }
      return; // ✅ 이미지가 있었던 경우에는 여기서 종료
    }

    // 💬 3️⃣ 이미지가 없고 텍스트만 있는 경우
    if (hasText && stompClient && stompClient.connected) {
      console.log("💬 텍스트 전송:", inputMessage);
      stompClient.publish({
        destination: "/pub/chat.send",
        body: JSON.stringify({
          roomId,
          message: inputMessage,
          senderId: myID || "me",
        }),
      });
      setInputMessage("");
    }
  } catch (err) {
    console.error("❌ 메시지 전송 실패:", err);
    alert("메시지 전송 중 오류가 발생했습니다.");
  }
};


  // 1️⃣ 초기 메시지 로드 (REST API)
  useEffect(() => {
    if (!roomId) return;

    console.log("📥 메시지 불러오기 시작", roomId);
    const enterChatRoomAPI = async () => {
      try {
        const postId = await enterChatRoom(roomId);
        if (postId) {
          console.log("✅ 채팅방 입장 성공, postId:", postId);
        } else {
          console.warn("⚠️ 채팅방 입장 실패");
          alert("⚠️ 채팅방 입장에 실패했습니다.");
        }
      } catch (err) {
        console.error("❌ 채팅방 입장 중 에러:", err);
        alert("⚠️ 채팅방 입장 중 오류가 발생했습니다.");
      }
    };
    enterChatRoomAPI();

    const fetchHistory = async () => {
      try {
        console.log("⏳ 메시지 불러오는 중...");
        const { myId, messages } = await fetchMessages(roomId);
        console.log("✅ 메시지 불러오기 성공:", {
          myId,
          count: messages ? messages.length : 0,
        });
        setMyID(myId);

        // ✅ 시간순 정렬 (sentAt 기준)
        const sortedMessages = [...messages].sort(
          (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        );

        setMessages(sortedMessages || []);
      } catch (err) {
        console.error("❌ 메시지 불러오기 실패:", err);
        setMessages(chatExampleMessages);
        alert("⚠️ 채팅방 메시지 불러오기 실패");
      }
    };

    fetchHistory();
  }, [roomId]);

  // 2️⃣ STOMP WebSocket 연결
  useEffect(() => {
    if (!roomId) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("❌ accessToken 없음");
      return;
    }

    console.log("🔌 STOMP WebSocket 연결 시도 (Authorization Header 사용)...");

    const client = new Client({
      brokerURL: `wss://api.stg.subook.shop/ws-chat`,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP Debug:", str),
    });

    client.onConnect = () => {
      console.log("✅ STOMP 연결 성공");
      setStompClient(client); // 전역 상태에 저장

      // 구독
      client.subscribe(`/sub/chat/${roomId}`, (message) => {
        console.log("📩 STOMP 메시지 수신:", message.body);
        try {
          const newMessage: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
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

    return () => {
      console.log("🔌 STOMP 연결 해제");
      client.deactivate();
    };
  }, [roomId]);

  //======================================JSX 부분======================================//

  return (
    <div className="chat-whole-container">
      {/* 🔼 상단 헤더 */}
      <div className="chat-header">
        <img
          className="chat-return-button"
          src={return_button}
          alt="돌아가기"
        />
        <div className="chat-info">
          <div className="opponentName">상대방 이름</div>
          <div className="chat-board-name">게시글 제목</div>
        </div>
        <img
          className="chat-dot-button"
          src={dotButtonImg}
          alt="옵션 버튼"
          onClick={toggleDotButton}
        />
        {dotButton && (
          <div className="dot-box">
            <div className="indi-buttonSet">
              <div className="buttonSet" onClick={openReportModal}>
                차단 & 신고
              </div>
            </div>
            <div className="indi-buttonSet">
              <div className="buttonSet">거래하기</div>
            </div>
          </div>
        )}
      </div>

      {/* 🔽 중앙 채팅 화면 */}
      <div className="chat-message-screen">
        {messages
          .sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          )
          .map((msg, index, arr) => {
            const isMine = msg.senderId === myID;

            // 🔹 현재 메시지의 날짜 (예: "2025-10-17")
            const currentDate = new Date(msg.sentAt).toLocaleDateString(
              "ko-KR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              }
            );

            // 🔹 이전 메시지의 날짜 (첫 번째면 null)
            const prevDate =
              index > 0
                ? new Date(arr[index - 1].sentAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })
                : null;

            const showDateSeparator = currentDate !== prevDate;

            return (
              <React.Fragment key={msg.messageId}>
                {/* ✅ 날짜 구분선 */}
                {showDateSeparator && (
                  <div className="chat-date-separator">📅 {currentDate}</div>
                )}

                {/* ✅ 메시지 버블 */}
                <div
                  className={`chat-message-row ${isMine ? "mine" : "opponent"}`}
                >
                  <div className="chat-bubble-row">
                    {isMine ? (
                      <>
                        <div className="chat-time">
                          {new Date(msg.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="chat-bubble mine">{msg.message}</div>
                      </>
                    ) : (
                      <>
                        <div className="chat-bubble opponent">
                          {msg.message}
                        </div>
                        <div className="chat-time">
                          {new Date(msg.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </div>

      {/* 🔽 선택 이미지 미리보기 */}
      {selectedImg && (
        <div className="chat-selected-overlay">
          <img
            src={selectedImg}
            alt="선택한 이미지"
            className="selected-img-show"
          />
          <button className="remove-img-btn" onClick={handleRemoveImage}>
            ✖
          </button>
        </div>
      )}

      {/* 🔽 하단 입력창 */}
      <div className="chat-input">
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />

        <label htmlFor="imageInput" className="chat-picture-label">
          <img
            src={pictureImg}
            alt="카메라 이미지"
            className="chat-picture-img"
          />
        </label>

        <input
          className="chat-input-field"
          placeholder="메시지를 입력하세요"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />

        <img
          src={sendImg}
          alt="업로드 버튼"
          className="chat-upload"
          onClick={sendMessage}
        />
      </div>

      {/* 🔽 신고 모달 */}
      {reportOpen && (
        <div className="report-modal">
          <div className="report-content">
            <div>신고하기</div>

            <div className="report-options">
              {reportReasons.map((reason) => (
                <label key={reason.id} className="report-option">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason.id}
                    checked={reportReason === reason.id}
                    onChange={() => setReportReason(reason.id)}
                  />
                  {reason.label}
                </label>
              ))}
            </div>

            <div className="report-buttons">
              <button onClick={handleReportSubmit}>제출</button>
              <button onClick={closeReportModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;