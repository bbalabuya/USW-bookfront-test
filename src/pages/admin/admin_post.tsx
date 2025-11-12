// 📁 src/pages/admin/AdminPostViewer.tsx
import React, { useEffect, useState } from "react";
import "./admin_post_css.css";
import sirenImg from "../../assets/siren.png";
import { AdminBook } from "../../types/report";
import { fetchBookDetail } from "../../API/single";
import { mockAdminBook } from "../../mockData/report";
import { userBan } from "../../API/adminAPI";
import { deletePost } from "../../API/adminAPI";

export const AdminPostViewer = ({ postId }: { postId: string }) => {
  const [book, setBook] = useState<AdminBook | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetchBookDetail(postId);
        if (!response) {
          setBook(mockAdminBook);
          return;
        }

        setBook({
          postId: response.id,
          title: response.title,
          content: response.content,
          postImage: response.postImage,
          postPrice: response.postPrice,
          likeCount: response.likeCount,
          status: response.PostStatus,
          createdAt: response.createdAt,
          seller: {
            id: response.sellerId,
            name: response.sellerName,
            profileImage: response.profileImage,
          },
        });
        console.log("불러온 글 내용", book);
      } catch (err) {
        console.error("❌ 게시글 불러오기 실패:", err);
        setBook(mockAdminBook);
      }
    };

    loadPost();
  }, [postId]);

  // 🚨 관리자 조치 함수
  const handleDeletePost = async (postId) => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      try {
        await deletePost(postId);
        alert("게시글이 삭제되었습니다.");
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
      }
    }
  };

  const handleBanSeller = async () => {
    if (window.confirm("정말 판매자를 밴 처리하시겠습니까?")) {
      try {
        await userBan(book?.seller.id);
        alert("판매자가 밴 처리되었습니다.");
      } catch (error) {
        console.error("판매자 밴 실패:", error);
      }
    }
  };

  if (!book) return <div className="loading">게시글 정보를 불러오는 중...</div>;

  return (
    <div className="admin-page-container">
      {/* 왼쪽: 이미지 */}
      <div className="admin-img-section">
        <img
          className="admin-post-img"
          src={book.postImage || "https://via.placeholder.com/400"}
          alt="상품 이미지"
        />
      </div>

      {/* 오른쪽: 내용 */}
      <div className="admin-info-section">
        {/* 판매자 정보 */}
        <div className="admin-seller-info">
          <img
            className="admin-seller-img"
            src={book.seller?.profileImage || "https://via.placeholder.com/100"}
            alt="판매자 사진"
          />
          <div className="admin-seller-text">
            <div className="seller-name">{book.seller?.name}</div>
            <div className="seller-id">ID: {book.seller?.id}</div>
          </div>
        </div>

        {/* 신고 내역 (예시용) */}
        <div className="admin-report-box">
          <img src={sirenImg} alt="신고" className="report-icon" />
          <div>
            <div className="report-title">신고 내역</div>
            <div className="report-content">
              사용자가 게시글을 광고성 내용으로 신고했습니다.
            </div>
          </div>
        </div>

        {/* 게시글 정보 */}
        <div className="admin-post-detail">
          <div className="post-title">{book.title}</div>
          <div className="post-date">
            작성일: {new Date(book.createdAt).toLocaleDateString("ko-KR")}
          </div>
          <div className="post-status">상태: {book.status}</div>
          <div className="post-price">
            가격:{" "}
            {typeof book.postPrice === "number"
              ? `${book.postPrice.toLocaleString()}원`
              : "가격 미정"}
          </div>
        </div>

        {/* 본문 */}
        <div className="admin-post-content">{book.content}</div>

        {/* 조치 버튼 */}
        <div className="admin-action-btns">
          <button onClick={handleDeletePost}>게시글 삭제</button>
          <button onClick={handleBanSeller}>판매자 밴</button>
          <button className="cancel-btn">조치 반려</button>
        </div>
      </div>
    </div>
  );
};
