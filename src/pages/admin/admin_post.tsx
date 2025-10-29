import React, { use, useEffect, useState } from "react";
import { fetchPosts } from "../../API/homeAPI";
import arrowImg from "../../assets/arrow.png";
import sirenImg from "../../assets/siren.png";
import hearts from "../../assets/hearts.png";
import "./admin_post_css.css";
import { Book } from "../../types/singleType";

export const AdminPostViewer = ({ postId }: { postId: string }) => {
  const [book, setBook] = useState<Book>();

  useEffect(() => {
    const loadPostContent = async () => {
      try {
        const response = await fetchPosts({ postId });
        setBook(response);
        console.log("✅ 게시글 데이터:", response);
      } catch (error) {
        console.error("❌ 게시글 불러오기 실패:", error);
      }
    };
    loadPostContent();
  }, [postId]);

  // bookImage typeError 해결 필요
  return (
    <>
      {!book ? (
        <div className="loading">게시글 불러오는 중...</div>
      ) : (
        <div className="single-page-container">
          <div className="img-wrapper">
            <img
              className="arrow-button left"
              src={arrowImg}
              alt="이전 화살표"
              style={{ transform: "rotate(180deg)" }}
            />
            <img className="imgset" src={book.postImage} alt="책 이미지" />
            <img
              className="arrow-button right"
              src={arrowImg}
              alt="다음 화살표"
            />
          </div>

          <div className="text-section">
            <div className="seller-wrapper">
              <div className="seller-info">
                <img
                  className="seller-img"
                  src={
                    book?.seller?.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt="판매자 사진"
                />
                <div>{book?.seller?.name || "이름 없음"}</div>
              </div>
              <div className="siren-wrapper">
                <img className="siren" src={sirenImg} alt="신고 이미지" />
                <div>신고하기</div>
              </div>
            </div>

            <div className="bookName-wrapper">
              <div className="title">{book.title}</div>
              <div className="status">{book.status}</div>
              <div className="created-at">
                {(() => {
                  const date = new Date(book.createdAt);
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  const day = date.getDate();
                  return `${year}년 ${month}월 ${day}일`;
                })()}
              </div>
            </div>

            <div className="price-likeCount">
              <div className="price">
                {typeof book.postPrice === "number"
                  ? `${book.postPrice.toLocaleString()}원`
                  : "가격 미정"}
              </div>

              <img className="hearts" src={hearts} alt="찜 이미지" />
              <div className="likeCount">{book.likeCount}</div>
            </div>

            <div className="content">{book.content}</div>
          </div>
        </div>
      )}
    </>
  );
};
