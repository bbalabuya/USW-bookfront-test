import React, { useEffect, useState } from "react";
import "./chatlist.css";
import axios from "axios";
import { Link } from "react-router-dom";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

type ChatRoom = {
  roomId: string;
  postId: string;
  name: string; // 사용자 닉네임
  userCount: number;
  lastMessage: string;
  lastMessageTime: string;
  img: string;
  name2: string; // 게시글 제목
};

const sampleChatList: ChatRoom[] = [
  {
    roomId: "room-001",
    postId: "post-001",
    name: "홍길동",
    userCount: 2,
    lastMessage: "네, 내일 거래 가능해요!",
    lastMessageTime: "2025-08-14T09:30:00",
    img: "https://via.placeholder.com/50", // 임시 프로필 이미지
    name2: "중고 노트북 판매"
  },
  {
    roomId: "room-002",
    postId: "post-002",
    name: "김영희",
    userCount: 3,
    lastMessage: "감사합니다!",
    lastMessageTime: "2025-08-13T15:45:00",
    img: "https://via.placeholder.com/50",
    name2: "아이폰 15 미개봉"
  },
  {
    roomId: "room-003",
    postId: "post-003",
    name: "이철수",
    userCount: 2,
    lastMessage: "혹시 가격 네고 가능할까요?",
    lastMessageTime: "2025-08-12T20:10:00",
    img: "https://via.placeholder.com/50",
    name2: "게이밍 마우스 팝니다"
  }
];


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

const Chatlist = () => {
  const [chatlist, setChatlist] = useState<ChatRoom[]>([]);

  useEffect(() => {
    axios
      .get<{ code: number; message: string; data: ChatRoom[] }>(
        `${URL}/api/chat/rooms`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("API 응답:", res.data);
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setChatlist(res.data.data);
        } else {
          console.warn("API 응답이 비었으므로 샘플 데이터 사용");
          setChatlist(sampleChatList);
        }
      })      
  }, []);

  return (
    <div className="chatlist-whole-container">
      <div className="chatlist-title">채팅방</div>
      <div className="chatlist-container">
        {(chatlist || []).map((room) => (
          <Link to="/" key={room.roomId} className={"roomlist"}>
            <img className="list-img" src={room.img} alt="프로필 이미지" />
            <div className="list-middle">
              <div className="list-middle-top">
                <div className="purchaser-nickname">{room.name}</div>
                <div className="board-title">{room.name2}</div>
              </div>
              <div className="chatlist-lastMessage">{room.lastMessage}</div>
            </div>
            <div className="chatlist-lastMessageTime">
              {getTimeAgo(room.lastMessageTime)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Chatlist;
