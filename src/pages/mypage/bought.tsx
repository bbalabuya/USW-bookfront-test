import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Selecter from "./selecter";
import heartImg from "../../assets/hearts.png";
import { boughtBook } from "../../types/boughtType";
import { boughtBookExample } from "../../mockData/boughtSample";
import { getBoughtBooks } from "../../API/boughtAPI";
import "./bought.css";
import { get } from "http";

// 시간 경과 함수
const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  return diff === 0 ? "오늘" : `${diff}일 전`;
};

const Bought = () => {
  const [books, setBooks] = useState<boughtBook[]>([]);

  useEffect(() => {
    const getBoughtBooksData = async () => {
      try {
        const data = await getBoughtBooks();
        setBooks(data || []);
      }catch(err){
        console.error("구매한 책 목록 불러오기 실패, 예시데이터 사용", err);
        setBooks(boughtBookExample);
      }
      getBoughtBooksData();
    }
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
                    <div className="bought-book-status">거래완료</div>
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
