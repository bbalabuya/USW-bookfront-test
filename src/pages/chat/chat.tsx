import React, { useEffect, useState } from "react";
import "./chat.css";
import returnButton from "../../assets/return_button.png";
import dotButtonImg from "../../assets/dot_button.png";
import pictureImg from "../../assets/chat_picture.png";
import sendImg from "../../assets/send.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ChatMessage } from "../../types/chat";
import { chatExampleMessages } from "../../mockData/chatMessage";

const DOMAIN_URL = (import.meta as any).env.VITE_DOMAIN_URL;

const Chat = () => {
  const { roomId } = useParams();

  const [dotButton, setDotButton] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(chatExampleMessages || []);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // ✅ 이미지 관련 state
  const [selectedImg, setSelectedImg] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 점 3개 버튼 토글
  const toggleDotButton = () => {
    setDotButton((prev) => !prev);
  };

  // 신고 모달 열기
  const openReportModal = () => {
    setReportOpen(true);
    setDotButton(false);
  };

  // 신고 모달 닫기
  const closeReportModal = () => {
    setReportOpen(false);
    setReportReason("");
  };

  //////////////////////
  // 신고 API 호출
  const handleReportSubmit = () => {
    if (!reportReason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }

    const userId = messages[0]?.senderId;

    axios
      .post(
        `${DOMAIN_URL}/api/users/${userId}/report`,
        {
          roomId,
          reason: reportReason,
        },
        { withCredentials: true }
      )
      .then(() => {
        alert("신고가 접수되었습니다.");
        closeReportModal();
      })
      .catch(() => {
        alert("신고 전송 실패");
      });
  };

  //////////////////////
  // ✅ 파일(이미지) 선택 처리
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file); // 실제 전송용 파일 저장
      const previewUrl = window.URL.createObjectURL(file); // 미리보기용 URL
      setSelectedImg(previewUrl);
    }
  };

  // ✅ 선택한 이미지 제거
  const handleRemoveImage = () => {
    setSelectedImg(undefined);
    setSelectedFile(null);
  };

  //////////////////////
  // 입력한 메시지 및 이미지 전송
  const sendMessage = () => {
    // 텍스트 전송
    if (inputMessage.trim()) {
      axios.post(
        `${DOMAIN_URL}/api/chat/rooms/${roomId}/messages`,
        {
          roomId,
          message: inputMessage,
          senderId: "me",
        },
        { withCredentials: true }
      );
      setInputMessage(""); // 입력창 초기화
    }

    // 이미지 전송
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);

      axios.post(
        `${DOMAIN_URL}/api/chat/rooms/${roomId}/images`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      ).then(() => {
        setSelectedImg(undefined); // 미리보기 제거
        setSelectedFile(null);     // 파일 상태 초기화
      });
    }
  };

  useEffect(() => {
    if (!roomId) return;

    axios
      .get(`${DOMAIN_URL}/api/chat/rooms/${roomId}/message`, {
        withCredentials: true,
      })
      .then((res) => {
        if (!res || !res.data || !Array.isArray(res.data.data)) {
          setMessages(chatExampleMessages);
          return;
        } else {
          setMessages(res.data.data);
        }
      })
      .catch(() => {
        console.error("메시지 불러오기 실패");
      });
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
          const isMine = msg.senderId === "me";
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
  
      {/* 🔽 선택 이미지 미리보기 (하단 입력창 위에 모달처럼) */}
      {selectedImg && (
        <div className="chat-selected-overlay">
          <img src={selectedImg} alt="선택한 이미지" className="selected-img-show" />
          <button className="remove-img-btn" onClick={handleRemoveImage}>✖</button>
        </div>
      )}
  
      {/* 🔽 하단 입력창 */}
      <div className="chat-input">
        {/* 파일 선택 input (숨김) */}
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          style={{ display: "none" }}
          onChange={handleImageSelect}
        />
  
        {/* 카메라 버튼 (라벨로 연결) */}
        <label htmlFor="imageInput" className="chat-picture-label">
          <img
            src={pictureImg}
            alt="카메라 이미지"
            className="chat-picture-img"
          />
        </label>
  
        {/* 메시지 입력 */}
        <input
          className="chat-input-field"
          placeholder="메시지를 입력하세요"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
  
        {/* 전송 버튼 */}
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
            <textarea
              className="report-textarea"
              placeholder="신고 사유를 입력해주세요"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="report-buttons">
              <button onClick={handleReportSubmit}>제출</button>
              <button onClick={closeReportModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  

export default Chat;
