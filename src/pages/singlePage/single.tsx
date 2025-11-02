import React, { useEffect, useState } from "react";
import "../singlePage/single.css";
import { useParams, useNavigate } from "react-router-dom";
import arrowImg from "../../assets/arrow.png";
import sirenImg from "../../assets/siren.png";
import handshake from "../../assets/handshake.png";
import hearts from "../../assets/hearts.png";
import { Book } from "../../types/singleType";
import { multiImageBook } from "../../mockData/single";
import { fetchBookDetail, createChatRoom, tradeRequest, reportRequest } from "../../API/single";

const Single = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openReportModal, setOpenReportModal] = useState(false); // ✅ 모달 열기 상태

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
        setBook(multiImageBook); /////////////// 임시: 목데이터로 대체
        const detail = await fetchBookDetail(postId);
        if (detail) {
          setBook(detail);
          setExtraInfo({
            courseName: detail.courseName ?? "",
            majorName: detail.majorName ?? "",
            professorName: detail.professorName ?? "",
          });
          setCurrentImageIndex(0);
        } else {
          console.warn("상세 데이터가 없습니다.");
        }
      } catch (err) {
        setBook(multiImageBook); // 임시: 목데이터로 대체
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

  const handleTradeRequest = async () => {
    console.log("🟢 거래요청 버튼 클릭됨");

    // 'confirm' 함수를 사용하여 사용자에게 확인을 요청합니다.
    if (confirm("정말로 이 책을 구매하시겠습니까?") == true) { // 확인을 선택한 경우
        if (!postId) {
            console.log("❌ postId가 없으므로 거래 요청을 진행할 수 없습니다.");
            return;
        }
        
        // 거래 요청을 진행합니다.
        const resultCode = await tradeRequest(postId);
        console.log("✅ 받은 거래요청 결과 코드:", resultCode);
    } else { // 취소를 선택한 경우
        console.log("🛑 사용자가 거래 요청을 취소했습니다.");
        return; // 함수 실행을 종료합니다.
    }
};
  // ✅ 신고 요청 기본 로직
  const handleReport = async () => {
    console.log("🟢 신고하기 버튼 클릭됨");
    if (!postId) return alert("게시글 ID를 찾을 수 없습니다.");

    try {
      const res = await reportRequest(postId, 1); // reason: 임시로 1번 (ex. 부적절한 내용)
      console.log("✅ 신고 요청 결과:", res);
      alert("신고가 정상적으로 접수되었습니다.");
    } catch (err) {
      console.error("❌ 신고 요청 실패:", err);
      alert("신고 중 오류가 발생했습니다.");
    }
  };

  if (!book) return <div>로딩 중...</div>;

  const images = Array.isArray(book.postImage)
    ? book.postImage
    : book.postImage
    ? [book.postImage]
    : [];

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

          <div className="seller-info">          
            <div onClick={handleTradeRequest}>
              <img className="siren" src={handshake} alt="거래요청" />
              <div style={{ fontSize: "12px" }}>거래요청</div>
            </div>
            <div onClick={handleReport}>
              <img className="siren" src={sirenImg} alt="신고" />
              <div style={{ fontSize: "12px" }}>신고하기</div>
            </div>
          </div>
        </div>

        <div className="bookName-wrapper">
          <div className="title">{book.title}</div>
        </div>

        <div className="price-likeCount">
          <div className="price">
            {typeof book.postPrice === "number" ? `${book.postPrice.toLocaleString()}원` : "가격 미정"}
          </div>
          <div className="info-set">
            <div className="status">{book.PostStatus}</div>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "5px"}}>
              <img className="hearts" src={hearts} alt="찜" />
              <div className="likeCount">{book.likeCount}</div>
            </div>
            <div className="created-at">
              {(() => {
                const d = new Date(book.createdAt);
                return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
              })()}
            </div>
          </div>
        </div>

        <div className="content">{book.content}</div>

        <button className="buy-button" onClick={handleCreateChatRoom}>
          구매요청하기
        </button>
      </div>

      {/* ✅ 추후 신고 모달 자리 */}
      {openReportModal && <div className="modal">신고 모달 자리</div>}
    </div>
  );
};

export default Single;
