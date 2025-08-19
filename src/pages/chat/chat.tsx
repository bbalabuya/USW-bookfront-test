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

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

const Chat = () => {
  const { roomId } = useParams();
  const [dotButton, setDotButton] = useState(false);
  const [imgSelected, setImgSelected] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | undefined>(undefined);

  const [messages, setMessages] = useState<ChatMessage[]>(chatExampleMessages || []);

  // 신고 모달 관련 상태
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  //상단 점선 버튼 토글
  const toggleDotButton = () => {
    setDotButton((prev) => !prev);
  };

  // 신고 모달 열기
  const openReportModal = () => {
    setReportOpen(true);
    setDotButton(false); // 점3개 닫기
  };

  // 신고 모달 닫기
  const closeReportModal = () => {
    setReportOpen(false);
    setReportReason("");
  };

  // 신고 API 호출
  const handleReportSubmit = () => {
    if (!reportReason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }

    /// 여기서 신고 대상자 ID 가져오기 (확인 필요)
    const userId = messages[0]?.senderId;
    axios
      .post(
        `${URL}/api/users/${userId}/report`,
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

  //사진 선택 로직
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImg(URL.createObjectURL(file));
      setImgSelected(true);
    }
  };

  //선택한 사진 삭제
  const handleRemoveImage = () => {
    setSelectedImg(undefined);
    setImgSelected(false);
  };

  return (
    <div className="chat-whole-container">
      {/* 상단 */}
      <div className="chat-header">
        <img className="chat-return-button" src={returnButton} alt="돌아가기" />
        <div className="chat-info">
          <div className="opponentName">상대방 이름</div>
          <div className="chat-board-name">게시글 제목</div>
        </div>

        {/* 점 3개 버튼 */}
        <img className="chat-dot-button" src={dotButtonImg} onClick={toggleDotButton} />
        {dotButton && (
          <div className="dot-box">
            <div className="indi-buttonSet">
              <div className="buttonSet" onClick={openReportModal}>차단 & 신고</div>
            </div>
            <div className="indi-buttonSet">
              <div className="buttonSet">거래하기</div>
              {/* 거래하기 API 명세서에 안 보임 상의필요 */}
            </div>
          </div>
        )}
      </div>

      {/* 중앙 채팅 */}
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

      {/* 하단 입력창 */}
      <div className="chat-input">
        {imgSelected && (
          <div className="chat-selected-box">
            <img src={selectedImg} alt="선택한 이미지" className="selected-img-show" />
            <button className="remove-img-btn" onClick={handleRemoveImage}>✖</button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <label htmlFor="imageInput" className="chat-picture-label">
          <img src={pictureImg} alt="카메라 이미지" className="chat-picture-img" />
        </label>

        <input className="chat-input-field" placeholder="메시지를 입력하세요" />
        <img src={sendImg} alt="업로드 버튼" className="chat-upload" />
      </div>

      {/* 신고 모달 */}
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
};

export default Chat;
