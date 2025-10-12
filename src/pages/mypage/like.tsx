import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Selecter from "./selecter";
import heartImg from "../../assets/hearts.png";
import { likeBook } from "../../types/likeType";
import { likeSampleData } from "../../mockData/likeSample";
import api from "../../API/index";
import "./like.css";

const API_URL = import.meta.env.VITE_DOMAIN_URL;

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  return diff === 0 ? "오늘" : `${diff}일 전`;
};



const Like = () => {
  const [books, setBooks] = useState<likeBook[]>([]);

  useEffect(() => {
    const getLikeBook = async () => {
      try{
        const response = await api.get("/api/me/posts/likes");
        console.log("찜한 책 목록 불러오기 성공");
        setBooks(response.data.data);
      }catch(err){
        console.error("찜한 책 목록 불러오기 실패, 예시데이터 사용", err);
        setBooks(likeSampleData);
      }
    };
    getLikeBook();
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
