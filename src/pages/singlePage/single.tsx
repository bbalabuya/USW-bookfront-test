import React, { useEffect, useState } from "react";
import "./single.css";
import { useParams, useNavigate } from "react-router-dom";
import arrowImg from "../../assets/arrow.png";
import sirenImg from "../../assets/siren.png";
import hearts from "../../assets/hearts.png";
import { Book } from "../../types/singleType";
import { fetchBookDetail, createChatRoom } from "../../API/single";

const Single = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  /** 📚 게시글 상세 불러오기 */
  useEffect(() => {
    const loadBook = async () => {
      if (!postId) return;
      const data = await fetchBookDetail(postId);
      if (data) setBook(data);
    };
    loadBook();
  }, [postId]);

  /** 💬 채팅방 생성 */
  const handleCreateChatRoom = async () => {
    if (!postId) return alert("채팅방 이동 실패");
    const roomId = await createChatRoom(postId);
    if (roomId) navigate(`/chat/${roomId}`);
  };

  /** 🔁 이미지 넘기기 (좌우 화살표 클릭 시) */
  const handlePrevImage = () => {
    if (!book || !Array.isArray(book.postImage)) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? book.postImage.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!book || !Array.isArray(book.postImage)) return;
    setCurrentImageIndex((prev) =>
      prev === book.postImage.length - 1 ? 0 : prev + 1
    );
  };

  if (!book) return <div>로딩 중...</div>;

  // ✅ 이미지 배열 처리 (단일 URL인 경우에도 대응)
  const images = Array.isArray(book.postImage)
    ? book.postImage
    : [book.postImage];

  const mainImage = images[currentImageIndex] || "";

  return (
    <div className="single-page-container">
      {/* ---------- 🖼 이미지 갤러리 섹션 ---------- */}
      <div className="image-gallery">
        <div className="main-image-wrapper">
          {images.length > 1 && (
            <img
              className="arrow-button left"
              src={arrowImg}
              alt="이전"
              onClick={handlePrevImage}
              style={{ transform: "rotate(180deg)" }}
            />
          )}

          <img
            className="main-image"
            src={mainImage}
            alt={`이미지 ${currentImageIndex + 1}`}
          />

          {images.length > 1 && (
            <img
              className="arrow-button right"
              src={arrowImg}
              alt="다음"
              onClick={handleNextImage}
            />
          )}
        </div>

        {/* 하단 썸네일 */}
        <div className="thumbnail-container">
          {images.map((img, index) => (
            <div
              key={index}
              className={`thumbnail-item ${
                currentImageIndex === index ? "selected" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img src={img} alt={`썸네일 ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* ---------- 📄 상세 정보 섹션 ---------- */}
      <div className="text-section">
        <div className="seller-wrapper">
          <div className="seller-info">
            <img
              className="seller-img"
              src={book?.seller?.profileImage || "https://via.placeholder.com/150"}
              alt="판매자 사진"
            />
            <div>{book?.seller?.name || "이름 없음"}</div>
          </div>
          <div className="siren-wrapper">
            <img className="siren" src={sirenImg} alt="신고" />
            <div>신고하기</div>
          </div>
        </div>

        <div className="bookName-wrapper">
          <div className="title">{book.title}</div>
          <div className="status">{book.status}</div>
          <div className="created-at">
            {(() => {
              const date = new Date(book.createdAt);
              return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
            })()}
          </div>
        </div>

        <div className="price-likeCount">
          <div className="price">
            {typeof book.postPrice === "number"
              ? `${book.postPrice.toLocaleString()}원`
              : "가격 미정"}
          </div>
          <img className="hearts" src={hearts} alt="찜" />
          <div className="likeCount">{book.likeCount}</div>
        </div>

        <div className="content">{book.content}</div>

        <button className="buy-button" onClick={handleCreateChatRoom}>
          구매요청하기
        </button>
      </div>
    </div>
  );
};

export default Single;
