import React, { useEffect, useState } from "react";
import "./single.css";
import { useParams, useNavigate } from "react-router-dom";
import arrowImg from "../../assets/arrow.png";
import sirenImg from "../../assets/siren.png";
import hearts from "../../assets/hearts.png";
import axios from "axios";
import { Book } from "../../types/singleType";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;


const Single = () => {
  const [book, setBook] = useState<Book | null>(null);
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  // 게시글 정보 불러오기
  const callBook = async () => {
    try {
      const response = await axios.get(`${URL}/api/posts/${postId}`, {
        withCredentials: true,
      });
      setBook(response.data);
    } catch (err) {
      console.error("책 정보를 불러오는 중 에러 발생:", err);
    }
  };

  // 버튼 클릭 시 채팅방 생성 요청
  const getRoomId = () => {
    if (!postId) return (alert("채팅방 이동 실패"))
    axios
      .post(
        `${URL}/api/posts/${postId}/chat-rooms`,
        { postId: postId },
        { withCredentials: true }
      )
      .then((res) => {
        const roomId = res.data.roomId;
        if (roomId) {
          navigate(`/chat/${roomId}`)
        } else {
          console.error("roomId를 받지 못했습니다.");
        }
      })
      .catch((err) => {
        console.error("채팅방 생성 실패:", err);
      });
  };


  // 페이가 처음 로딩되고 게시글 정보 불러오기
  useEffect(() => {
    if (postId) {
      callBook();
    }
  }, [postId]);

  if (!book) return <div>로딩 중...</div>;

  return (
    <div className="single-page-container">
      <div className="img-wrapper">
        <img
          className="arrow-button left"
          src={arrowImg}
          alt="이전 화살표"
          style={{ transform: "rotate(180deg)" }}
        />
        <img className="imgset" src={book.postImage} alt="책 이미지" />
        <img className="arrow-button right" src={arrowImg} alt="다음 화살표" />
      </div>

      <div className="text-section">
        <div className="seller-wrapper">
          <div className="seller-info">
            <img
              className="seller-img"
              src={book?.seller?.profileImage || "https://via.placeholder.com/150"}
              alt="판매자 사진"
            />
            <div>{book?.seller?.name || "이름 없음"}</div>
          </div>
          <div className="siren-wrapper">
            <img className="siren" src={sirenImg} alt="신고 이미지" />
            <div>신고하기</div>
          </div>
        </div>

        <div className="bookName-wrapper">
          <div className="title">{book.title}</div>
          <div className="status">{book.status}</div>
          <div className="created-at">
            {(() => {
              const date = new Date(book.createdAt);
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const day = date.getDate();
              return `${year}년 ${month}월 ${day}일`;
            })()}
          </div>
        </div>

        <div className="price-likeCount">
        <div className="price">
  {typeof book.postPrice === "number" ? `${book.postPrice.toLocaleString()}원` : "가격 미정"}
</div>

          <img className="hearts" src={hearts} alt="찜 이미지" />
          <div className="likeCount">{book.likeCount}</div>
        </div>

        <div className="content">{book.content}</div>

        <button className="buy-button" onClick={getRoomId}>
          구매요청하기
        </button>
      </div>
    </div>
  );
};

export default Single;
