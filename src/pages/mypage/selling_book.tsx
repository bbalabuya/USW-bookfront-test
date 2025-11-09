import React, { useEffect, useState } from "react";
import Selecter from "./selecter";
import "./selling_book.css";
import axios from "axios";
import api from "../../API/index";
import heartImg from "../../assets/hearts.png";
import unlike from "../../assets/unlike.png";
import { Link } from "react-router-dom";
import { SellingBook } from "../../types/selling_bookType";
import { selling_bookExample } from "../../mockData/selling_bookExample";

const API_URL = import.meta.env.VITE_DOMAIN_URL;

// 날짜 포맷 변환 함수 (2025-07-01 → 2025.07.01)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

const Selling_book = () => {
    const [sellingBook, setSellingBook] = useState<SellingBook[]>([]);

    useEffect(() => {
        const getSellingBooks = async () => {
            try{
                const response = await api.get(`${API_URL}/api/user/post`);
                console.log("판매중인 책 목록 불러오기 성공", response.data);
                setSellingBook(response.data.data.content);
            }catch(err){
                console.error("판매중인 책 목록 불러오기 실패, 예시데이터 사용", err);
                setSellingBook(selling_bookExample);
            }
        };
        getSellingBooks();
    }, []);

    const deletePost = async (postId) => {
      try {
        const res = await api.delete(`api/posts${postId}`);
      } catch (err) {
        console.error("게시글 삭제 실패", err);
      }
    };

    return (
      <div className="selling-whole-container">
        <div className="selling-left-container">
          <Selecter />
        </div>

        <div className="selling-right-container">
          <div className="sell-container">
            {sellingBook.map((book) => (
              <div className="sell-plate" key={book.postId}>
                <img
                  className="sell-picture"
                  src={book.postImage}
                  alt={book.postTitle}
                />
                <div className="middle-set">
                  <div className="middle-upper-set">
                    <div className="title-set">
                      <div className="book-title">{book.postTitle}</div>
                      <div className="sell-book-status">{book.status}</div>
                      <div className="book-price">{book.price}원</div>
                      <div className="upload-date">
                        {formatDate(book.createdAt)}
                      </div>
                    </div>
                    <div className="like-set">
                      <img
                        className="heart-img"
                        src={unlike}
                        alt="하트 이미지"
                      />
                      <div className="book-heart">{book.likeCount}</div>
                    </div>
                  </div>
                  <div className="middle-down-set">설명칸</div>
                </div>
                <div className="plate-button-set">
                  <Link to={`/single/${book.postId}`} className="sell-button">
                    게시글로 이동하기
                  </Link>
                  <Link
                    to={`/editpost/${book.postId}`}
                    className="sell-button"
                    state={{ PostId: book.postId }}
                  >
                    글 수정하기
                  </Link>
                  <button className="sell-button" onClick={deletePost}>
                    글 삭제하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default Selling_book;
