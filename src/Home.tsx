import React, { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";
import heartImg from "./assets/hearts.png";
import { Link, useSearchParams } from "react-router-dom";
import { Book } from "./types/homeType";

const URL = import.meta.env.VITE_DOMAIN_URL;

// 🔹 시간 표시 함수
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

// 🔹 Home 컴포넌트
export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();
  const searchType = searchParams.get("type") || "bookName";
  const keyword = searchParams.get("keyword") || "";

  // 🔹 필터 상태
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [grades, setGrades] = useState<string[]>([]);
  const [isLiberalArts, setIsLiberalArts] = useState(false);

  // 🔹 필터 변경 시 데이터 다시 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;

        // 기본 URL 구성
        let endpoint = `${URL}/api/posts`;
        let params: any = { page: pageNumber, size: 8, sort: "createdAt,desc" };

        // 검색어 존재 시
        if (keyword.trim()) {
          endpoint =
            searchType === "bookName"
              ? `${URL}/api/posts/book/${encodeURIComponent(keyword)}`
              : `${URL}/api/posts/class/${encodeURIComponent(keyword)}`;
          params = { pageNumber };
        }

        // 🔹 필터 조건 추가
        if (onlyAvailable) params.status = "판매중";
        if (grades.length > 0) params.grades = grades.join(",");
        if (isLiberalArts) params.category = "교양";

        res = await axios.get(endpoint, { params });

        console.log("📦 서버 응답:", res.data);

        if (res.data?.data?.content && Array.isArray(res.data.data.content)) {
          setBooks(res.data.data.content);
          setTotalPages(res.data.data.totalPages || 1);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("❌ API 요청 에러:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword, searchType, pageNumber, onlyAvailable, grades, isLiberalArts]);

  // 🔹 필터 조작 핸들러
  const toggleGrade = (grade: string) => {
    setGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  return (
    <div className="home-container">
      {/* 🔹 왼쪽 필터 */}
      <div className="filter-container">
        <div className="filter-title">필터</div>

        {/* 거래가능 필터 */}
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          <span className="custom-checkbox"></span>
          거래가능만 보기
        </label>

        <span className="divider" />

        {/* 학년 필터 */}
        <div
          className="filter-title"
          style={{ fontSize: "22px", fontWeight: "bold" }}
        >
          학년
        </div>
        {["1학년", "2학년", "3학년", "4학년"].map((grade, idx) => (
          <label className="checkbox-wrapper" key={idx}>
            <input
              type="checkbox"
              checked={grades.includes(grade)}
              onChange={() => toggleGrade(grade)}
            />
            <span className="custom-checkbox"></span>
            {grade}
          </label>
        ))}

        <span className="divider" />

        {/* 교양 필터 */}
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={isLiberalArts}
            onChange={(e) => setIsLiberalArts(e.target.checked)}
          />
          <span className="custom-checkbox"></span>
          교양
        </label>
      </div>

      {/* 🔹 오른쪽 책 목록 */}
      <div className="book-list-container">
        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontWeight: "bold",
              marginTop: "50px",
            }}
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
              marginTop: "50px",
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
