import React, { useState } from "react";
import "./chat.css";
import returnButton from "../../assets/return_button.png"
import dotButtonImg from "../../assets/dot_button.png";
import pictureImg from "../../assets/chat_picture.png"
import sendImg from "../../assets/send.png"

const Chat = () => {
  const [dotButton, setDotButton] = useState(false);
  const [imgSelected, setImgSelected] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null); // 선택된 이미지 URL 저장

  const toggleDotButton = () => {
    setDotButton((prev) => !prev); // true/false 토글
  };

  // 이미지 선택 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImg(URL.createObjectURL(file)); // 선택한 이미지 미리보기 URL 생성
      setImgSelected(true);
    }
  };

  // 선택한 이미지 제거
  const handleRemoveImage = () => {
    setSelectedImg(null);
    setImgSelected(false);
  };

  return (
    <div className="chat-whole-container">
      <div className="chat-header">
        <img className="chat-return-button" src={returnButton} alt="돌아가기"/>
        <div className="chat-info">
          <div className="opponentName">상대방 이름</div>
          <div className="chat-board-name">게시글 제목</div>
        </div>

        {/* 점 버튼 */}
        <img className="chat-dot-button" src={dotButtonImg} onClick={toggleDotButton} />

        {/* 버튼 세트 */}
        {dotButton && (
          <div className="dot-box">
            <div className="chat-button-set">
              <div className="indi-buttonSet">
                <img className="user-block" />
                <div className="buttonSet">유저 차단</div>
              </div>
              <div className="indi-buttonSet">
                <img className="user-block" />
                <div className="buttonSet">유저 신고</div>
              </div>
              <div className="indi-buttonSet">
                <img className="user-block" />
                <div className="buttonSet">거래하기</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 대화 내역 */}
      <div className="chat-message-screen"></div>

      {/* 하단 메시지 입력창 */}
      <div className="chat-input">
        {imgSelected && (
          <div className="chat-selected-box">
            <img src={selectedImg!} alt="선택한 이미지" className="selected-img-show" />
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

        {/* 카메라 아이콘 클릭 시 파일 업로드 input 실행 */}
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
