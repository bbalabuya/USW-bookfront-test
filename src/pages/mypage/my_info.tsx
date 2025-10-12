import React, { useEffect, useState } from "react";
import "./my_info.css";
import Selecter from "./selecter";
import axios from "axios";
import { Link } from "react-router-dom";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

// 서버에서 오는 실제 데이터 타입
type User = {
  name: string;
  majorName: string;
  email: string;
  grade: number;
  semester: number;
  profileImage?: string; // 선택적
};

const My_info: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await axios.get(`${URL}/api/user/infomation`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        // API가 { code, message, data } 구조이므로 data만 저장
        setUser(response.data.data);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };

    getInfo();
  }, []);

  return (
    <div className="my_info-whole-container">
      <div className="left-container">
        <Selecter />
      </div>
      <div className="right-container">
        <img
          className="profile-img"
          src={user?.profileImage || "/default_profile.png"}
          alt="프로필 이미지"
        />
        <div className="info-box">
          <div className="wrapper">
            <div className="title">닉네임</div>
            <div className="info">{user?.name || "불러오는 중..."}</div>
          </div>
          <div className="wrapper">
            <div className="title">학과</div>
            <div className="info">{user?.majorName || "정보 없음"}</div>
          </div>
          <div className="wrapper">
            <div className="title">이메일</div>
            <div className="info">{user?.email || "정보 없음"}</div>
          </div>
          <div className="wrapper">
            <div className="title">학년/학기</div>
            <div className="info">
              {user ? `${user.grade}학년 / ${user.semester}학기` : "정보 없음"}
            </div>
          </div>
        </div>
        <div className="button-set">
          <Link to="/mypage/edit_my_info" className="buttons">
            내 정보 변경
          </Link>
          <Link to="/mypage/change_pw" className="buttons">
            비밀번호 변경
          </Link>
          <Link to="/mypage/withdrawal" className="buttons">
            회원탈퇴
          </Link>
        </div>
      </div>
    </div>
  );
};

export default My_info;
