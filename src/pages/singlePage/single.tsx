import React, { useEffect, useState } from "react";
import "./single.css";
import { useParams, useNavigate } from "react-router-dom";
import arrowImg from "../../assets/arrow.png";
import sirenImg from "../../assets/siren.png";
import handshake from "../../assets/handshake.png";
import hearts from "../../assets/hearts.png";
import { Book } from "../../types/singleType";
import { fetchBookDetail, createChatRoom } from "../../API/single";

const Single = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 부가 정보도 상태로 관리 (나중에 사용)
  const [extraInfo, setExtraInfo] = useState({
    courseName: "",
    majorName: "",
    professorName: "",
  });

  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBook = async () => {
      if (!postId) return;
      try {
        const detail = await fetchBookDetail(postId); // Book | null

        if (detail) {
          // detail은 이미 Book 타입이므로 그대로 저장
          setBook(detail);

          setExtraInfo({
            courseName: detail.courseName ?? "",
            majorName: detail.majorName ?? "",
            professorName: detail.professorName ?? "",
          });

          // 이미지 인덱스 안전 초기화
          setCurrentImageIndex(0);
        } else {
          // 상세가 없을 때 (404 등) 처리 — 예: 뒤로 가기나 메시지
          console.warn("상세 데이터가 없습니다.");
        }
      } catch (err) {
        console.error("게시글 로드 실패:", err);
      }
    };

    loadBook();
  }, [postId]);

const handleCreateChatRoom = async () => {
  console.log("🟢 구매요청 버튼 클릭됨");

  if (!postId) {
    console.warn("❌ postId 없음");
    return alert("채팅방 이동 실패");
  }

  const roomId = await createChatRoom(postId);
  console.log("✅ 받은 roomId:", roomId);

  if (roomId) {
    console.log("🚀 navigate 실행!");
    navigate(`/chat/${roomId}`);
  } else {
    console.warn("⚠️ roomId 없음, 이동 중단");
  }
};


  // 이미지 페이징
  const images = book
    ? Array.isArray(book.postImage)
      ? book.postImage
      : [book.postImage]
    : [];

  
  if (!book) return <div>로딩 중...</div>;

  const mainImage = images[currentImageIndex] ?? "";

  return (
    <div className="single-page-container">
      <div className="image-gallery">
        <div className="main-image-wrapper">
          <img className="main-image" src={mainImage} alt={`이미지 ${currentImageIndex + 1}`} />
        </div>

        <div className="thumbnail-container">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`thumbnail-item ${currentImageIndex === idx ? "selected" : ""}`}
              onClick={() => setCurrentImageIndex(idx)}
            >
              <img src={img} alt={`썸네일 ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="text-section">
        <div className="seller-wrapper">
          <div className="seller-info">
            <img className="seller-img" src={"https://via.placeholder.com/150"} alt="판매자" />
            <div>{book.sellerName ?? "이름 없음"}</div>
          </div>

          <div className="siren-wrapper">
            <img className="siren" src={handshake} alt="거래요청" />
            <div style={{fontSize:"12px"}}>거래요청</div>
            <img className="siren" src={sirenImg} alt="신고" />
            <div style={{fontSize:"12px"}}>신고하기</div>
          </div>
        </div>

        <div className="bookName-wrapper">
          <div className="title">{book.title}</div>
          <div className="status">{book.PostStatus}</div>
          <div className="created-at">
            {(() => {
              const d = new Date(book.createdAt);
              return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
            })()}
          </div>
        </div>

        <div className="price-likeCount">
          <div className="price">{typeof book.postPrice === "number" ? `${book.postPrice.toLocaleString()}원` : "가격 미정"}</div>
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
