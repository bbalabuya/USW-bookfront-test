import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Selecter from "./selecter";
import heartImg from "../../assets/hearts.png";
import "./like.css";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

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
  createdAt: string;
  postPrice: number;
  status: string;
  heart: number;
};

const Like = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const exampleData: Book[] = [
      {
        id: "1",
        title: "운영체제 책 구매",
        sellerName: "김철수",
        postImage: "https://via.placeholder.com/200x280.png?text=Book+1",
        createdAt: "2025-06-30T09:00:00",
        postPrice: 12000,
        status: "거래완료",
        heart: 5,
      },
      {
        id: "2",
        title: "자료구조 책 구매",
        sellerName: "박영희",
        postImage: "https://via.placeholder.com/200x280.png?text=Book+2",
        createdAt: "2025-07-01T12:00:00",
        postPrice: 15000,
        status: "판매중",
        heart: 8,
      },
    ];

    setBooks(exampleData);
  }, []);

  return (
    <div className="like-whole-container">
      <div className="like-left-container">
        <Selecter />
      </div>
      <div className="like-right-container">
        <div className="like-book-list-container">
          {books.length === 0 ? (
            <div style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", color: "gray" }}>
              책이 없습니다.
            </div>
          ) : (
            books.map((book) => (
              <Link to={`/single/${book.id}`} key={book.id} className="like-book-card">
                <img src={book.postImage} alt="책 사진" className="like-book-image" />
                <div className="like-book-title">{book.title}</div>
                <div className="like-info-status-wrapper">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {book.status !== "판매중" && (
                      <div className="like-book-status">거래완료</div>
                    )}
                    <div className="like-book-price">{book.postPrice.toLocaleString()}원</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginRight: "5px", color: "#AE00FF", display: "flex", alignItems: "center" }}>
                      <img src={heartImg} alt="heart" style={{ marginRight: "2px" }} />
                      {book.heart}
                    </div>
                    <div className="like-book-date">{getTimeAgo(book.createdAt)}</div>
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
