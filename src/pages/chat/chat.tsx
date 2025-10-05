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

  // 메시지 전송
  const sendMessage = async () => {
    if (!roomId) return console.log("❌ roomId 없음");

    // 텍스트 전송 (STOMP)
    if (inputMessage.trim() && stompClient) {
      console.log("💬 STOMP 텍스트 메시지 전송 시도:", inputMessage);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("❌ accessToken 없음");
        return;
      }
      try {
        stompClient.publish({
          destination: "/pub/chat.send",
          body: JSON.stringify({
            roomId,
            message: inputMessage,
            senderId: myID || "me",
          }),
        });
        setInputMessage(""); // 입력창 초기화
      } catch (err) {
        console.error("❌ STOMP 텍스트 메시지 전송 실패", err);
      }
    }

    // 이미지 전송 (REST 그대로 유지)
    if (selectedFile) {
      console.log("🖼️ 이미지 메시지 전송 시도:", selectedFile.name);
      try {
        if (!myID) throw new Error("❌ myID 없음");

        const sentImg = await sendImageApi(roomId, selectedFile, myID);
        if (sentImg) {
          console.log("✅ 이미지 전송 성공:", sentImg);
          setMessages((prev) => [...prev, sentImg]);
        }

        setSelectedFile(null);
        setSelectedImg(undefined);
      } catch (err) {
        console.error("❌ 이미지 전송 실패", err);
      }
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
        }
      } catch (err) {
        console.error("❌ 채팅방 입장 중 에러:", err);
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
        setMessages(messages || []);
      } catch (err) {
        console.error("❌ 메시지 불러오기 실패:", err);
        setMessages(chatExampleMessages);
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
        {messages.map((msg) => {
          const isMine = msg.senderId === myID;
          return (
            <div
              key={msg.messageId}
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
                    <div className="chat-bubble opponent">{msg.message}</div>
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