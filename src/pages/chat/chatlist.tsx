import React, { useEffect, useState } from "react";
import "./chatlist.css";
import { Link } from "react-router-dom";
import { ChatRoom } from "../../types/chatlist";
import { sampleChatList } from "../../mockData/chatlistexample";
import { fetchChatRooms } from "../../API/chatlistAPI";

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
    const loadChatRooms = async () => {
      const rooms = await fetchChatRooms();
      if (rooms.length > 0) {
        setChatlist(rooms);
      } else {
        console.warn("⚠️ 서버에서 데이터를 못 받아서 샘플 데이터 사용");
        setChatlist(sampleChatList);
        // alert("⚠️ 서버에서 채팅방 데이터를 받아오지 못했습니다.");
      }
    };

    loadChatRooms();
  }, []);

  return (
    <div className="chatlist-whole-container">
      <div className="chatlist-title">채팅방</div>
      <div className="chatlist-container">
        {(chatlist || []).map((room) => (
          <Link
            to={`/chat/${room.roomId}`}
            key={room.roomId}
            className="roomlist"
          >
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
