import React, { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";
import heartImg from "./assets/hearts.png";
import { Link } from "react-router-dom";

type Book = {
  id: number;
  postImage: string;
  title: string;
  postPrice: number;
  status: string;
  createdAt: string;
  heart: number;
};

const URL = (import.meta as any).env.VITE_API_URL;

// utils/getTimeAgo.ts (또는 컴포넌트 내부 함수로)
export function getTimeAgo(createdAt: string): string {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - createdDate.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return "방금 전";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}분 전`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}시간 전`;
  } else if (diff < month) {
    const days = Math.floor(diff / day);
    return `${days}일 전`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months}달 전`;
  } else {
    const years = Math.floor(diff / year);
    return `${years}년 전`;
  }
}



export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    /*axios.get(`${URL}/books`)
      .then((res) => {
        console.log("서버 응답 확인:", res.data);
        {/*실제로 작동할 때 리스트 확인 필요
        if (Array.isArray(res.data.data)) { 
          setBooks(res.data.data);
        } else {
          console.warn("데이터가 배열이 아닙니다:", res.data.data);
        }
      })
      .catch((err) => console.error("API 요청 에러:", err));*/
      const sampleBooks: Book[] = [
        {
          id: 1,
          postImage: "https://via.placeholder.com/150",
          title: "운영체제 책 팝니다",
          postPrice: 25000,
          status: "판매중",
          createdAt: "2025-06-30T12:00:00",
          heart: 10,
        },
        {
          id: 2,
          postImage: "https://via.placeholder.com/150",
          title: "자료구조 책 판매합니다",
          postPrice: 18000,
          status: "거래완료",
          createdAt: "2025-07-01T09:30:00",
          heart: 10,
        },
        {
          id: 3,
          postImage: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg",
          title: "컴퓨터 네트워크 책 있어요",
          postPrice: 22000,
          status: "판매중",
          createdAt: "2025-07-20T15:10:00",
          heart: 3,
        },
      ];
      setBooks(sampleBooks);
      console.log(books.length);
  }, []);

  return (
    <div className="home-container">
      <div className="filter-container">
        <div className="filter-title">필터</div>
        <label className="checkbox-wrapper">
          <input type="checkbox" />
          <span className="custom-checkbox"></span>
          거래가능만 보기
        </label>
        <span className="divider" />
        <div className="filter-title" style={{ fontSize: "25px", fontWeight: "bold" }}>학년</div>
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

      <div className="book-list-container">
        {books.length === 0 ? (
          <div style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", color: "gray" }}>책이 없습니다.</div>
        ) : (
          books.map((book, index) => (
            <Link to={`/single/${book.id}`} key={book.id} className="book-card">
              <img src={book.postImage} alt="책 사진" className="book-image" />
              <div className="book-title">{book.title}</div>
              <div className="info-status-wrapper">
                <div style={{display: "flex", alignItems: "center"}}>
              {book.status !== "판매중" && (
  <div className="book-status">거래완료</div>
)}

                <div className="book-price">{book.postPrice.toLocaleString()}원</div>
                </div>
                <div style={{display: "flex", alignItems: "center"}}>
                <div style={{marginRight: "5px",color: "#AE00FF", display: "flex", alignItems: "center"}}>
                  <img src={heartImg} alt="heart" style={{marginRight: "2px"}}/>{book.heart}</div>
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
