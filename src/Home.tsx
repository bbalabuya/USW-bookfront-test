import React, { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";
import heartImg from "./assets/hearts.png";
import { Link, useSearchParams } from "react-router-dom";
import { Book } from "./types/homeType";
import { fetchPosts } from "./API/homeAPI";
import { sampleBooks } from "./mockData/homeSample";

const URL = import.meta.env.VITE_DOMAIN_URL;

// 🔹 시간 변환 함수
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
  const keyword = decodeURIComponent(searchParams.get("keyword") || "");

  // 🔹 필터 상태
  const [grade, setGrade] = useState<number | null>(null);
  const [semester, setSemester] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);

  // 🔹 게시글 불러오기
  useEffect(() => {
    console.log("📍 현재 URL:", window.location.href);
    console.log("📍 searchType:", searchType, "keyword:", keyword);
    const token = localStorage.getItem("accessToken");
    console.log("home에서 토큰 불러오기 성공");

    const loadBooks = async () => {
      setLoading(true);
      try {
        const params: any = { pageNumber };

        // 검색어가 있을 때만 추가
        if (keyword.trim()) {
          if (searchType === "bookName") params.bookName = keyword;
          else if (searchType === "className") params.className = keyword;
        }

        // 필터가 선택되어 있다면 추가
        if (grade) params.grade = grade;
        if (semester) params.semester = semester;
        if (status) params.status = status;
        if (priceMin) params.priceMin = priceMin;
        if (priceMax) params.priceMax = priceMax;

        const res = await fetchPosts(params);
        const data = res?.data;

        if (data?.content && Array.isArray(data.content)) {
          setBooks(data.content);
          setTotalPages(data.totalPages || 1);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("API 요청 에러:", err);
        setBooks(sampleBooks); // Mock 데이터로 대체
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [
    keyword,
    searchType,
    grade,
    semester,
    status,
    priceMin,
    priceMax,
    pageNumber,
  ]);

  /*
  // 🔹 로그인 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await loginCheck();
        console.log("✅ 로그인 상태:", response);
      } catch (error) {
        console.log("❌ 비로그인 상태:", error);
      }
    };
    checkLoginStatus();
  }, []);
  */

  return (
    <div className="home-container">
      {/* 왼쪽 필터 */}
      <div className="filter-container">
        <div className="filter-title">필터</div>

        {/* 판매 상태 */}
        {["판매중", "거래완료"].map((s) => (
          <label key={s} className="checkbox-wrapper">
            <input
              type="radio"
              name="status"
              checked={status === s}
              onChange={() => setStatus(s)}
            />
            {s}
          </label>
        ))}
        <button onClick={() => setStatus(null)} className="reset-button">
          상태 초기화
        </button>

        <span className="divider" />

        {/* 학년 */}
        {[1, 2, 3, 4].map((g) => (
          <label key={g} className="checkbox-wrapper">
            <input
              type="radio"
              name="grade"
              checked={grade === g}
              onChange={() => setGrade(g)}
            />
            {g}학년
          </label>
        ))}
        <button onClick={() => setGrade(null)} className="reset-button">
          학년 초기화
        </button>

        <span className="divider" />

        {/* 학기 */}
        {[1, 2].map((s) => (
          <label key={s} className="checkbox-wrapper">
            <input
              type="radio"
              name="semester"
              checked={semester === s}
              onChange={() => setSemester(s)}
            />
            {s}학기
          </label>
        ))}
        <button onClick={() => setSemester(null)} className="reset-button">
          학기 초기화
        </button>

        <span className="divider" />

        {/* 가격 입력 */}
        <div className="filter-subtitle">가격 범위</div>
        <div className="price-range">
          <input
            type="number"
            placeholder="최소"
            value={priceMin ?? ""}
            onChange={(e) =>
              setPriceMin(e.target.value ? Number(e.target.value) : null)
            }
            className="price-input"
          />
          <span>~</span>
          <input
            type="number"
            placeholder="최대"
            value={priceMax ?? ""}
            onChange={(e) =>
              setPriceMax(e.target.value ? Number(e.target.value) : null)
            }
            className="price-input"
          />
        </div>
        <button
          onClick={() => {
            setPriceMin(null);
            setPriceMax(null);
          }}
          className="reset-button"
        >
          가격 초기화
        </button>
      </div>

      {/* 오른쪽 책 목록 */}
      <div className="book-list-container">
        {loading ? (
          <div className="status-text">🔍 검색 중입니다...</div>
        ) : books.length === 0 ? (
          <div className="status-text">책이 없습니다.</div>
        ) : (
          books.map((book) => (
            <Link to={`/single/${book.id}`} key={book.id} className="book-card">
              <img src={book.postImage} alt="책 사진" className="book-image" />

              {/* 제목 */}
              <div className="book-title">{book.title}</div>

              {/* 하트 + 작성시간 */}
              <div className="book-info-top">
                <div className="book-heart">
                  <img src={heartImg} alt="heart" />
                  {book.heart}
                </div>
                <div className="book-date">{getTimeAgo(book.createdAt)}</div>
              </div>

              {/* 가격 + 판매상태 */}
              <div className="book-info-bottom">
                <div className="book-price">
                  {book.postPrice.toLocaleString()}원
                </div>
                {book.status !== "판매중" && (
                  <div className="book-status">거래완료</div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

  
