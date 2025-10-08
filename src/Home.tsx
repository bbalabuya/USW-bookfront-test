import React, { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";
import heartImg from "./assets/hearts.png";
import { Link, useSearchParams } from "react-router-dom";
import { Book } from "./types/homeType";

const URL = import.meta.env.VITE_DOMAIN_URL;

export function getTimeAgo(createdAt: string): string {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - createdDate.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) return "방금 전";
  if (diff < hour) return `${Math.floor(diff / minute)}분 전`;
  if (diff < day) return `${Math.floor(diff / hour)}시간 전`;
  if (diff < month) return `${Math.floor(diff / day)}일 전`;
  if (diff < year) return `${Math.floor(diff / month)}달 전`;
  return `${Math.floor(diff / year)}년 전`;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(0);

  const [searchParams] = useSearchParams();
  const searchType = searchParams.get("type") || "bookName";
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (keyword.trim()) {
          // ✅ 검색 시: bookName/className 검색 API 사용
          const endpoint =
            searchType === "bookName"
              ? `${URL}/api/posts/book/${encodeURIComponent(
                  keyword
                )}?pageNumber=${pageNumber}`
              : `${URL}/api/posts/class/${encodeURIComponent(
                  keyword
                )}?pageNumber=${pageNumber}`;
          res = await axios.get(endpoint);
        } else {
          // ✅ 검색어가 없을 때: 기본 게시글 API 사용
          res = await axios.get(`${URL}/api/posts`, {
            params: { page: pageNumber, size: 8, sort: "createdAt,desc" },
          });
        }

        console.log("서버 응답:", res.data);

        if (res.data?.data?.content && Array.isArray(res.data.data.content)) {
          setBooks(res.data.data.content);
          setTotalPages(res.data.data.totalPages || 1);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("API 요청 에러:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword, searchType, pageNumber]);

  /*  페이지를 따로 구분하는 경우에 사용
  const handlePrevPage = () => {
    if (pageNumber > 0) setPageNumber(pageNumber - 1);
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages - 1) setPageNumber(pageNumber + 1);
  };
*/

  return (
    <div className="home-container">
      {/* 왼쪽 필터 */}
      <div className="filter-container">
        <div className="filter-title">필터</div>
        <label className="checkbox-wrapper">
          <input type="checkbox" />
          <span className="custom-checkbox"></span>
          거래가능만 보기
        </label>
        <span className="divider" />
        <div
          className="filter-title"
          style={{ fontSize: "25px", fontWeight: "bold" }}
        >
          학년
        </div>
        {["1학년", "2학년", "3학년", "4학년"].map((grade, index) => (
          <label className="checkbox-wrapper" key={index}>
            <input type="checkbox" />
            <span className="custom-checkbox"></span>
            {grade}
          </label>
        ))}
        <span className="divider" />
        <label className="checkbox-wrapper">
          <input type="checkbox" />
          <span className="custom-checkbox"></span>
          교양
        </label>
      </div>

      {/* 오른쪽 책 목록 */}
      <div className="book-list-container">
        {loading ? (
          <div
            style={{ textAlign: "center", color: "#888", fontWeight: "bold" }}
          >
            🔍 검색 중입니다...
          </div>
        ) : books.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: "gray",
            }}
          >
            책이 없습니다.
          </div>
        ) : (
          books.map((book) => (
            <Link to={`/single/${book.id}`} key={book.id} className="book-card">
              <img src={book.postImage} alt="책 사진" className="book-image" />
              <div className="book-title">{book.title}</div>
              <div className="info-status-wrapper">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {book.status !== "판매중" && (
                    <div className="book-status">거래완료</div>
                  )}
                  <div className="book-price">
                    {book.postPrice.toLocaleString()}원
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      marginRight: "5px",
                      color: "#AE00FF",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={heartImg}
                      alt="heart"
                      style={{ marginRight: "2px" }}
                    />
                    {book.heart}
                  </div>
                  <div className="book-date">{getTimeAgo(book.createdAt)}</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
