import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Selecter from "./selecter";
import heartImg from "../../assets/hearts.png";
import "./bought.css";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

// 시간 경과 함수
const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  return diff === 0 ? "오늘" : `${diff}일 전`;
};

type Book = {
  id: string;
  title: string;
  sellerName: string;
  postImage: string;
  completedAt: string;
  postPrice: number;
  status: string;
  heart: number;
};

const Bought = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const exampleData: Book[] = [
      {
        id: "1",
        title: "운영체제 책 구매",
        sellerName: "김철수",
        postImage: "https://via.placeholder.com/200x280.png?text=Book+1",
        completedAt: "2025-06-30T09:00:00",
        postPrice: 12000,
        status: "거래완료",
        heart: 5,
      },
      {
        id: "2",
        title: "자료구조 책 구매",
        sellerName: "박영희",
        postImage: "https://via.placeholder.com/200x280.png?text=Book+2",
        completedAt: "2025-07-01T12:00:00",
        postPrice: 15000,
        status: "판매중",
        heart: 8,
      },
    ];

    setBooks(exampleData);

    // 실제 API 호출 예시
    /*
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${URL}/api/me/posts/buy`);
        setBooks(res.data);
      } catch (err) {
        console.error("책 데이터 불러오기 실패", err);
      }
    };

    fetchBooks();
    */
  }, []);

  return (
    <div className="bought-whole-container">
      <div className="bought-left-container">
        <Selecter />
      </div>
      <div className="bought-right-container">
        <div className="bought-book-list-container">
          {books.length === 0 ? (
            <div style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", color: "gray" }}>
              책이 없습니다.
            </div>
          ) : (
            books.map((book) => (
              <Link to={`/single/${book.id}`} key={book.id} className="bought-book-card">
                <img src={book.postImage} alt="책 사진" className="bought-book-image" />
                <div className="bought-book-title">{book.title}</div>
                <div className="bought-info-status-wrapper">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {book.status !== "판매중" && (
                      <div className="bought-book-status">거래완료</div>
                    )}
                    <div className="bought-book-price">{book.postPrice.toLocaleString()}원</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginRight: "5px", color: "#AE00FF", display: "flex", alignItems: "center" }}>
                      <img src={heartImg} alt="heart" style={{ marginRight: "2px" }} />
                      {book.heart}
                    </div>
                    <div className="bought-book-date">{getTimeAgo(book.completedAt)}</div>
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

export default Bought;
