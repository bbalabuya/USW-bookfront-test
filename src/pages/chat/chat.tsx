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

  // ✅ messages 초기값에 예시 데이터 넣기
  const [messages, setMessages] = useState<ChatMessage[]>(chatExampleMessages || []);
  console.log("메시지 데이터 ", messages)

  //상단 점선 버튼 토클
  const toggleDotButton = () => {
    setDotButton((prev) => !prev);
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

  // 채팅방 입장하고 처음 API 호출
  useEffect(() => {
    if (!roomId) return;
    axios
      .get(`${URL}/api/chat/rooms/${roomId}/message`, {
        withCredentials: true,
      })
      .then((res) => {
          ///////// APi 연결하면 주석 해제하고 예시 데이터 삭제하기
          //setMessages(res.data.data); 
        })
      .catch(() => console.error("메시지 불러오기 실패"));
  }, [roomId]);

  return (
    <div className="chat-whole-container">
      {/* 처음 상단 구성  */}
      <div className="chat-header">
        <img className="chat-return-button" src={returnButton} alt="돌아가기" />
        <div className="chat-info">
          <div className="opponentName">상대방 이름</div>
          <div className="chat-board-name">게시글 제목</div>
        </div>
        <img className="chat-dot-button" src={dotButtonImg} onClick={toggleDotButton} />

        {dotButton && (
          <div className="dot-box">
            <div className="chat-button-set">
              <div className="indi-buttonSet">
                <div className="buttonSet">유저 차단</div>
              </div>
              <div className="indi-buttonSet">
                <div className="buttonSet">유저 신고</div>
              </div>
              <div className="indi-buttonSet">
                <div className="buttonSet">거래하기</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 중간 대화 내역 */}
      <div className="chat-message-screen">
        {messages.map((msg) => (
          <div key={msg.messageId} className="chat-message">
            <span className="chat-sender">{msg.senderId}</span>:{" "}
            <span className="chat-text">{msg.message}</span>
            <div className="chat-time">
              {new Date(msg.sentAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 메시지 입력창 */}
      <div className="chat-input">
        {imgSelected && (
          <div className="chat-selected-box">
            <img src={selectedImg} alt="선택한 이미지" className="selected-img-show" />
            <button className="remove-img-btn" onClick={handleRemoveImage}>
              ✖
            </button>
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
    </div>
  );
};

export default Chat;
