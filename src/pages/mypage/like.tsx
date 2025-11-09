import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Selecter from "./selecter";
import like from "../../assets/like.png";
import unlike from "../../assets/unlike.png";
import { likeBook } from "../../types/likeType";
import { likeSampleData } from "../../mockData/likeSample";
import api from "../../API/index";
import { likeRequest } from "../../API/commonAPI";
import "./like.css";

// 📅 날짜 계산 함수 (홈 페이지와 동일)
const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff === 0 ? "오늘" : `${diff}일 전`;
};

const Like = () => {
  // ✅ 초기값: 예시 데이터 (API 실패 시 대비)
  const [books, setBooks] = useState<likeBook[]>(likeSampleData);
  const [isLiked,setIsLiked] = useState(false);

  useEffect(() => {
    const getLikeBook = async () => {
      try {
        const response = await api.get("/api/user/likePost");
        console.log("✅ 찜한 책 목록 불러오기 성공");
        console.log(response.data);

        // 데이터 유효성 확인
        if (response.data?.data?.content) {
          setBooks(response.data.data.content);
        } else {
          console.warn("⚠️ 서버 응답 데이터 형식이 예상과 다릅니다.");
          setBooks([]);
        }
      } catch (err) {
        console.error("❌ 찜한 책 목록 불러오기 실패 — 예시데이터 사용", err);
        setBooks(likeSampleData);
      }
    };
    getLikeBook();
  }, []);

  return (
    <div className="like-whole-container">
      {/* 왼쪽: 필터 / 선택 영역 */}
      <div className="like-left-container">
        <Selecter />
      </div>

      {/* 오른쪽: 찜한 책 리스트 */}
      <div className="like-right-container">
        <div className="like-book-list-container">
          {books.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "bold",
                color: "gray",
              }}
            >
              찜한 책이 없습니다.
            </div>
          ) : (
            books.map((book) => (
              <Link
                to={`/single/${book.id}`}
                key={book.id}
                className="book-card"
              >
                {/* 📘 책 이미지 */}
                <img
                  src={book.postImage}
                  alt="책 사진"
                  className="book-image"
                />

                {/* 📖 제목 */}
                <div className="book-title">{book.postTitle}</div>

                {/* 📚 카드 하단 영역 */}
                <div className="book-card-footer">
                  {/* ❤️ 좋아요 & 날짜 */}
                  <div className="book-info-top">
                    <div
                      className="book-heart"
                      onClick={(e) => {
                        e.preventDefault(); // 링크 이동 방지
                        e.stopPropagation(); // 상위 이벤트 차단
                        likeRequest(book.id);
                      }}
                    >
                      <img
                        src={like}
                        alt="좋아요"
                        className="heart-icon"
                      />
                      <span>{book.likeCount}</span>
                    </div>

                    <div className="book-date">
                      {getTimeAgo(book.createdAt)}
                    </div>
                  </div>

                  {/* 💰 가격 + 상태 */}
                  <div className="book-info-bottom">
                    <div className="book-price">
                      {book.price.toLocaleString()}원
                    </div>
                    {book.status !== "판매중" && (
                      <div className="book-status">거래완료</div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Like;
