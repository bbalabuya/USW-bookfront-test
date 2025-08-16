import React, { useEffect, useState } from "react";
import "./single.css";
import { useParams, useNavigate } from "react-router-dom";
import arrowImg from "../../assets/arrow.png";
import sirenImg from "../../assets/siren.png";
import hearts from "../../assets/hearts.png";
import axios from "axios";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

interface Book {
  bookId: number;
  title: string;
  postPrice: number;
  status: string;
  content: string;
  professor: string;
  courseName: string;
  grade: number;
  semester: number;
  postImage: string;
  likeCount: number;
  seller?: {
    sellerId: number;
    name: string;
    profileImage: string;
  };
  createdAt: string;
}

const Single = () => {
  const [book, setBook] = useState<Book | null>(null);
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  // 단일 게시물 정보 불러오기
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

  // 채팅방 생성 요청
  const getRoomId = () => {
    if (!book?.bookId) return;

    axios
      .post(
        `${URL}/api/posts/${postId}/chat-rooms`,
        { postId: book.bookId },
        { withCredentials: true }
      )
      .then((res) => {
        const roomId = res.data.roomId;
        if (roomId) {
          makeChatRoom(roomId);
        } else {
          console.error("roomId가 존재하지 않습니다.");
        }
      })
      .catch((err) => {
        console.error("채팅방 생성 실패:", err);
      });
  };

  // 채팅방 입장 처리
  const makeChatRoom = (roomId: string) => {
    if (!book?.bookId || !book?.seller?.sellerId) return;

    axios
      .post(
        `${URL}/api/chat/rooms/${roomId}`,
        {
          postId: book.bookId,
          sellerId: book.seller.sellerId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        const newRoomId = res.data.roomId;
        navigate(`/chat/${newRoomId}`); // 경로 수정해야 필요!!!
      })
      .catch((err) => {
        console.error("채팅방 입장 실패:", err);
      });
  };

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
