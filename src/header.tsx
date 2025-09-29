import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import arrowImg from "./assets/arrow.png";
import profile from "./assets/basic_profile.png";
import reading_glass from "./assets/reading_glass.png";
import axios from "axios";
import { wrap } from "module";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

// 헤더 전체 컨테이너
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 250px;
  height: 70px;
  max-height: 70px;
  background-color: #f8f8f8;
  border-bottom: 3px solid #b516ff;
`;

// 로고
const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;

  color: black;
  cursor: pointer;
`;

// 네비게이션
const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 17px;
  font-weight: bold;

  a {
    color: #b516ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// 드롭다운 + 검색창을 감싸는 박스
const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 750px;
  max-width: 1000px;
  background-color: white;
  border: 1px solid #b516ff;
  border-radius: 999px;
  overflow: hidden;
`;

// 드롭다운 전체 컨테이너
const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 0px 0px 0px 10px;
  align-items: center;
  border-right: 1px solid #ddd;
`;

// 드롭다운
const Select = styled.select`
  padding: 5px 1px 5px 15px;
  border: none;
  background-color: transparent;
  font-size: 15px;
  color: #333;
  outline: none;
  appearance: none; /* 기본 화살표 제거 */
  cursor: pointer;
`;

// 화살표 (↓)
const Arrow = styled.img.attrs({ src: arrowImg, alt: "화살표" })`
  position: relative;
  width: 15px;
  height: 15px;
  transform: rotate(90deg);
  pointer-events: none;
  margin-right: 7px;
`;

// 검색 입력창
const SearchInput = styled.input`
  flex: 1;
  padding: 15px 12px;
  border: none;
  font-size: 14px;
  outline: none;
  background-color: white;
  color: black;
`;

// 프로필 이미지
const Profile = styled.img`
  width: 45px;
  height: 45px;
  align-items: center;
  cursor: pointer;
`;

// 인증 버튼 (로그인 버튼 포함)
const LoginButton = styled.button`
  padding: 8px 16px;
  background-color: #b516ff;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap; // ✅ 줄바꿈 방지
  font-weight: bold;

  &:hover {
    background-color: #8c13cc;
  }
`;

const Reading_glass = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 13px;
`;

const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchType, setSearchType] = useState("bookName");
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    axios
      .get(`${URL}/search`, {
        params: {
          keyword,
          type: searchType,
        },
      })
      .then((response) => {
        console.log("검색결과: ", response.data);
        navigate("/boardlist");
      })
      .catch((error) => {
        console.log("검색 error", error);
      });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    // 로그아웃 처리 로직 (예: 토큰 삭제, 상태 업데이트 등)
    localStorage.removeItem("accessToken");
    setLoggedIn(false);
    navigate("/");
  };


  return (
    <HeaderContainer>
      <Logo onClick={() => navigate("/")}>중고책 판매(로고)</Logo>

      <SearchBox>
        <SelectWrapper>
          <Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="bookName">책이름</option>
            <option value="professor">교수님</option>
            <option value="className">강의명</option>
          </Select>
          <Arrow />
        </SelectWrapper>
        <SearchInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="책 이름, 강의명, 교수님 이름을 입력해주세요"
        />
        <Reading_glass
          src={reading_glass}
          alt="돋보기 버튼"
          onClick={handleSearch}
        />
      </SearchBox>

      <Nav>
        <Link to="/chatlist" style={{ whiteSpace: "nowrap" }}>
          채팅방
        </Link>
        <Link to="/mypage/my_info" style={{ whiteSpace: "nowrap" }}>
          마이페이지
        </Link>
        <Link to="/upload" style={{ whiteSpace: "nowrap" }}>
          책 팔기
        </Link>
      </Nav>
      <div
        style={{
          width: "80px",
          padding: "0px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loggedIn ? (
          <Profile src={profile} alt="프로필" />
        ) : (
          <div>
            <LoginButton onClick={handleLogin}>로그인</LoginButton>
            <LoginButton onClick={handleLogout}>로그아웃</LoginButton>
          </div>
        )}
      </div>
    </HeaderContainer>
  );
};

export default Header;
