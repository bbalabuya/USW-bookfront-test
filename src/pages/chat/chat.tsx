import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchMessages,
  sendMessageApi,
  sendImageApi,
  reportUser,
} from "../../API/chatAPI";
import { ChatMessage, ChatHistoryResponse } from "../../types/chat";
import "./chat.css";
import returnButton from "../../assets/returnButton.png";
import dotButtonImg from "../../assets/dotButton.png";
import pictureImg from "../../assets/picture.png";
import sendImg from "../../assets/send.png";
import { chatExampleMessages } from "../../mockData/chatMessage";

const Chat = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [dotButton, setDotButton] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | undefined>(undefined);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [myID, setMyID] = useState<string>("");

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
    setReportOpen(true);
    setDotButton(false);
  };
  const closeReportModal = () => {
    setReportOpen(false);
    setReportReason(null);
  };

  // 신고 제출
  const handleReportSubmit = async () => {
    if (reportReason === null) return alert("신고 사유를 선택해주세요.");
    try {
      await reportUser(roomId!, reportReason);
      alert("신고가 접수되었습니다.");
      closeReportModal();
    } catch {
      alert("신고 전송 실패");
    }
  };

  // 이미지 선택 / 제거
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setSelectedImg(window.URL.createObjectURL(file));
  };
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setSelectedImg(undefined);
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!roomId) return;

    // 텍스트 전송
    if (inputMessage.trim()) {
      try {
        const sent = await sendMessageApi(roomId, inputMessage, myID || "me");
        if (sent) setMessages((prev) => [...prev, sent]);
        setInputMessage("");
      } catch (err) {
        console.error("메시지 전송 실패", err);
      }
    }

    // 이미지 전송
    if (selectedFile) {
      try {
        if (!myID) throw new Error("myID가 없습니다.");

        // 순서: roomId → file → senderId
        const sentImg = await sendImageApi(roomId, selectedFile, myID);
        if (sentImg) setMessages((prev) => [...prev, sentImg]);

        setSelectedFile(null);
        setSelectedImg(undefined);
      } catch (err) {
        console.error("이미지 전송 실패", err);
      }
    }
  };

  // 1️⃣ 초기 메시지 로드 (REST API)
  useEffect(() => {
    if (!roomId) return;

    const fetchHistory = async () => {
      try {
        const { myId, messages } = await fetchMessages(roomId);
        setMyID(myId);
        setMessages(messages);
      } catch (err) {
        console.error("❌ 메시지 불러오기 실패:", err);
        setMessages(chatExampleMessages); // 예시 데이터로 fallback
      }
    };

    fetchHistory();
  }, [roomId]);

  // 2️⃣ WebSocket 연결
  useEffect(() => {
    if (!roomId) return;

    const socket = new WebSocket(`ws://localhost:8080/ws-chat`);
    setWs(socket);

    socket.onopen = () => {
      console.log("✅ WebSocket 연결 성공");
      // 방 구독
      const subscribeMsg = {
        command: "SUBSCRIBE",
        headers: { id: "sub-0", destination: `/sub/chat/${roomId}` },
      };
      socket.send(JSON.stringify(subscribeMsg));
    };

    socket.onmessage = (event) => {
      try {
        const newMessage: ChatMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, newMessage]);
      } catch (err) {
        console.error("메시지 파싱 실패", err);
      }
    };

    socket.onclose = () => console.log("❌ WebSocket 종료");

    return () => socket.close();
  }, [roomId]);

  return (
    <div className="chat-whole-container">
      {/* 🔼 상단 헤더 */}
      <div className="chat-header">
        <img className="chat-return-button" src={returnButton} alt="돌아가기" />
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
