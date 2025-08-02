import React, { useEffect, useState } from "react";
import "./my_info.css";
import Selecter from "./selecter";
import axios from "axios";
import { Link } from "react-router-dom";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

type User = {
  userId: number;
  studentCode:string;
  email: string;
  name: string;
  createdAt: string;
  major:string;
  grade:number;
  semeseter:number;
  profileImage?: string;
};

const My_info = () => {
  const [user, setUser] = useState<User | null>(null);

  const getInfo = async () => {
    try {
      const response = await axios.get(`${URL}/api/me`, {
        withCredentials: true,
      });
      setUser(response.data); // 서버에서 받아온 유저 정보 저장
    } catch (err) {
      console.error("유저 정보 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div className="whole-container">
      <div className="left-container">
        <Selecter />
      </div>
      <div className="right-container">
        <img
          className="profile-img"
          src={user?.profileImage || "/default_profile.png"} // 기본 이미지 경로 설정 가능
          alt="프로필 이미지"
        />
        <div className="info-box">
          <div className="wrapper">
            <div className="title">닉네임</div>
            <div className="info">{user?.name || "불러오는 중..."}</div>
          </div>
          <div className="wrapper">
            <div className="title">학과</div>
            <div className="info">{user?.major || "정보 없음"}</div>
          </div>
          <div className="wrapper">
            <div className="title">이메일</div>
            <div className="info">{user?.email || "정보 없음"}</div>
          </div>
          <div className="wrapper">
            <div className="title">가입일</div>
            <div className="info">
                {user?.createdAt ? (() => {
                    const date = new Date(user.createdAt);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    return `${year}년 ${month}월 ${day}일`;
                    })() : "정보 없음"}
            </div>
        </div>

        </div>
        <div className="button-set">
          <Link to="change_info" className="buttons">내 정보 변경</Link>
          <div className="buttons">회원탈퇴</div>
        </div>
      </div>
    </div>
  );
};

export default My_info;
