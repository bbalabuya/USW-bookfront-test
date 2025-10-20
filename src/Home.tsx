import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import heartImg from "./assets/hearts.png";
import { Link, useSearchParams } from "react-router-dom";
import { Book } from "./types/homeType";
import { fetchPosts } from "./API/homeAPI";
import { sampleBooks } from "./mockData/homeSample";

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

  // 현재 로드된 마지막 페이지 (0-based)
  const [pageNumber, setPageNumber] = useState(0);

  const [searchParams] = useSearchParams();
  const searchType = searchParams.get("type") || "bookName";
  const keyword = searchParams.get("keyword") || "";

  // 🔹 필터 상태
  const [grade, setGrade] = useState<number | null>(null);
  const [semester, setSemester] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);

  // 관찰용 ref (무한스크롤)
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 현재 더 불러올 수 있는지
  const hasMore = pageNumber < Math.max(0, totalPages - 1);

  // ---------- 공통 페치 함수 ----------
  const fetchPage = async (page: number, append = false) => {
    // page는 0-based로 서버에 전달합니다.
    setLoading(true);
    try {
      const params: any = {
        page: pageNumber,
        size: 8,
        sort: "createdAt,desc",
      };

      if (keyword.trim()) {
        if (searchType === "bookName") params.bookName = keyword;
        else if (searchType === "className") params.className = keyword;
      }

      if (grade) params.grade = grade;
      if (semester) params.semester = semester;
      if (status) params.status = status;
      if (priceMin || priceMin === 0) params.priceMin = priceMin;
      if (priceMax || priceMax === 0) params.priceMax = priceMax;

      // 서버 응답 형태에 따라 유연하게 처리:
      // - fetchPosts가 axios response 전체를 반환하면 res.data가 실제 내용일 수 있고,
      // - fetchPosts가 response.data를 바로 반환하면 res가 바로 내용일 수 있음.
      const res = await fetchPosts(params);
      const serverData = res?.data ?? res; // try res.data first, otherwise res

      const content = serverData?.content ?? serverData ?? [];
      const tp = serverData?.totalPages ?? totalPages ?? 1;

      if (Array.isArray(content)) {
        if (append) {
          setBooks((prev) => [...prev, ...content]);
        } else {
          setBooks(content);
        }
      } else {
        // 안전망: content가 배열이 아니면 빈 배열로 처리
        if (!append) setBooks([]);
      }

      setTotalPages(tp);
      setPageNumber(page);
    } catch (err) {
      console.error("API 요청 에러:", err);
      if (!append) {
        setBooks(sampleBooks); // 초기 로드 실패 시 목데이터로 대체
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- 필터/검색어 변경 시: 페이지 초기화 후 첫 페이지 로드 ----------
  useEffect(() => {
    // reset -> load page 0
    setBooks([]);
    setPageNumber(0);
    setTotalPages(1);
    fetchPage(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, searchType, grade, semester, status, priceMin, priceMax]);

  // ---------- 무한 스크롤: 관찰요소가 보이면 다음 페이지 로드 ----------
  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && hasMore) {
          // 다음 페이지 요청 (append)
          fetchPage(pageNumber + 1, true);
        }
      },
      { threshold: 0.5 } // 조금 보이면 트리거 (원하면 1.0으로 바꿔도 됩니다)
    );

    io.observe(el);
    return () => io.disconnect();
    // pageNumber/hasMore/loading은 내부에서 참조되므로 의존성으로 넣지 않음(의도적으로),
    // fetchPage는 항상 최신 상태를 사용하도록 설계됨.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerRef.current]);

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
        {loading && books.length === 0 ? (
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

        {/* 관찰 요소: 이 요소가 보이면 다음 페이지를 불러옵니다 */}
        <div ref={observerRef} style={{ height: 20 }} />

        {/* 더 불러오는 중 (페이지가 이미 있던 상태에서 추가로 불러올 때) */}
        {loading && books.length > 0 && (
          <div className="status-text">📚 더 불러오는 중...</div>
        )}
      </div>
    </div>
  );
}
