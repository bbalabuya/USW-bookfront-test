// Single.tsx
import React, { useEffect, useState } from "react";
import "../singlePage/single.css";
import { useParams, useNavigate } from "react-router-dom";
import handshake from "../../assets/handshake.png";
import sirenImg from "../../assets/siren.png";
import hearts from "../../assets/hearts.png";
import { Book } from "../../types/singleType";
import { multiImageBook } from "../../mockData/single";
import {
  fetchBookDetail,
  createChatRoom,
  reportRequest,
} from "../../API/single";

const reasonList = ["욕설", "비방", "광고", "도배", "부적절한_내용"];

const Single: React.FC = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 신고 모달 관련 상태
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");

  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBook = async () => {
      if (!postId) return;
      try {
        // 로컬 테스트용 기본 목데이터 먼저 세팅 (빠른 렌더링)
        setBook(multiImageBook);

        // 실제 API 조회 시도
        const detail = await fetchBookDetail(postId);
        if (detail) {
          setBook(detail);
          setCurrentImageIndex(0);
        } else {
          console.warn("상세 데이터가 없습니다. (API가 빈값 반환)");
        }
      } catch (err) {
        // 실패하면 목데이터로 계속 테스트 가능
        console.error("게시글 로드 실패:", err);
        setBook(multiImageBook);
      }
    };

    loadBook();
  }, [postId]);

  // 채팅방 생성 / 이동
  const handleCreateChatRoom = async () => {
    if (!postId) {
      alert("게시글 ID가 없습니다.");
      return;
    }
    try {
      const roomId = await createChatRoom(postId);
      if (roomId) navigate(`/chat/${roomId}`);
      else alert("채팅방 생성 실패");
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  // 모달 열기
  const handleOpenReportModal = () => {
    setSelectedReason("");
    setOpenReportModal(true);
  };

  // 모달 닫기
  const handleCloseReportModal = () => {
    setOpenReportModal(false);
    setSelectedReason("");
  };

  // Single.tsx 내부 — 신고 확인 버튼 핸들러
  const handleConfirmReport = async () => {
    if (!selectedReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }
    if (!postId) {
      alert("게시글 ID가 없습니다.");
      return;
    }

    try {
      await reportRequest(postId, selectedReason); // <-- 변경된 호출 방식
      alert("신고가 정상적으로 접수되었습니다.");
      handleCloseReportModal();
    } catch (err) {
      console.error("신고 전송 실패:", err);
      alert("신고 전송에 실패했습니다. 콘솔을 확인하세요.");
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
      {/* 이미지 영역 */}
      <div className="image-gallery">
        <div className="main-image-wrapper">
          <img
            className="main-image"
            src={mainImage}
            alt={`이미지 ${currentImageIndex + 1}`}
          />
        </div>

        <div className="thumbnail-container">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`thumbnail-item ${
                currentImageIndex === idx ? "selected" : ""
              }`}
              onClick={() => setCurrentImageIndex(idx)}
            >
              <img src={img} alt={`썸네일 ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="text-section">
        <div className="seller-wrapper">
          <div className="seller-info">
            <img
              className="seller-img"
              src={"https://via.placeholder.com/150"}
              alt="판매자"
            />
            <div>{book.sellerName ?? "이름 없음"}</div>
          </div>
          <div
            onClick={handleOpenReportModal}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <img className="siren" src={sirenImg} alt="신고" />
            <div style={{ fontSize: 12 }}>신고하기</div>
          </div>
        </div>
      </div>

      <div className="bookName-wrapper">
        <div className="title">{book.title}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: "bold" }}>{book.postName}</div>
        <div className="course-info">
          {book.majorName}, {book.professorName} 교수님의 {book.courseName}
        </div>
      </div>

      <div className="price-likeCount">
        <div className="price">
          {typeof book.postPrice === "number"
            ? `${book.postPrice.toLocaleString()}원`
            : "가격 미정"}
        </div>

        <div className="info-set">
          <div className="status">{book.PostStatus}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <img className="hearts" src={hearts} alt="찜" />
            <div className="likeCount">{book.likeCount}</div>
          </div>
          <div className="created-at">
            {(() => {
              const d = new Date(book.createdAt);
              return `${d.getFullYear()}년 ${
                d.getMonth() + 1
              }월 ${d.getDate()}일`;
            })()}
          </div>
        </div>
      </div>

      <div className="content">{book.content}</div>

      <button className="buy-button" onClick={handleCreateChatRoom}>
        판매자와 대화하기
      </button>

      {openReportModal && (
        <div className="modal-overlay" onClick={handleCloseReportModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>신고 사유를 선택해주세요</h3>

            <div className="reason-list" style={{ marginTop: 12 }}>
              {reasonList.map((r) => (
                <label
                  key={r}
                  style={{
                    display: "block",
                    marginBottom: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={selectedReason === r}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    style={{ marginRight: 8 }}
                  />
                  {r}
                </label>
              ))}
            </div>

            <div
              className="modal-buttons"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 18,
              }}
            >
              <button
                onClick={handleCloseReportModal}
                style={{ padding: "8px 12px" }}
              >
                취소
              </button>
              <button
                onClick={handleConfirmReport}
                style={{
                  padding: "8px 12px",
                  background: "#b516ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Single;
