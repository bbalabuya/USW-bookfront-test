import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import arrowImg from "./assets/arrow.png";
import profile from "./assets/basic_profile.png";
import reading_glass from "./assets/reading_glass.png";

// 🔹 스타일 정의
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 250px;
  height: 70px;
  background-color: #f8f8f8;
  border-bottom: 3px solid #b516ff;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: black;
  cursor: pointer;
`;

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

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  width: 750px;
  background-color: white;
  border: 1px solid #b516ff;
  border-radius: 999px;
  overflow: hidden;
`;

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 0px 0px 0px 10px;
  align-items: center;
  border-right: 1px solid #ddd;
`;

const Select = styled.select`
  padding: 5px 1px 5px 15px;
  border: none;
  background-color: transparent;
  font-size: 15px;
  color: #333;
  outline: none;
  appearance: none;
  cursor: pointer;
`;

const Arrow = styled.img.attrs({ src: arrowImg, alt: "화살표" })`
  position: relative;
  width: 15px;
  height: 15px;
  transform: rotate(90deg);
  pointer-events: none;
  margin-right: 7px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 15px 12px;
  border: none;
  font-size: 14px;
  outline: none;
  background-color: white;
  color: black;
`;

const Profile = styled.img`
  width: 45px;
  height: 45px;
  align-items: center;
  cursor: pointer;
`;

const LoginButton = styled.button`
  padding: 8px 16px;
  background-color: #b516ff;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap;
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

// 🔹 Header 컴포넌트
const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchType, setSearchType] = useState("bookName");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setLoggedIn(!!token);
  }, []);

  // ✅ 검색 버튼 클릭 시 "/"로 이동하면서 쿼리 전달
  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(
      `/?type=${searchType}&keyword=${encodeURIComponent(keyword)}&pageNumber=0`
    );
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate("/")}>중고책 판매(로고)</Logo>

      {/* 검색창 */}
      <SearchBox>
        <SelectWrapper>
          <Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="bookName">책이름</option>
            <option value="className">강의명</option>
          </Select>
          <Arrow />
        </SelectWrapper>

        <SearchInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="책 이름 또는 강의명을 입력하세요"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Enter 검색
        />

        <Reading_glass
          src={reading_glass}
          alt="돋보기 버튼"
          onClick={handleSearch}
        />
      </SearchBox>

      {/* 네비게이션 */}
      <Nav>
        <a href="/chatlist">채팅방</a>
        <a href="/mypage/my_info">마이페이지</a>
        <a href="/upload">책 팔기</a>
      </Nav>

      {/* 로그인 상태 */}
      <div style={{ width: "80px", display: "flex", alignItems: "center" }}>
        {loggedIn ? (
          <Profile src={profile} alt="프로필" />
        ) : (
          <>
            <LoginButton onClick={handleLogin}>로그인</LoginButton>
            <LoginButton onClick={handleLogout}>로그아웃</LoginButton>
          </>
        )}
      </div>
    </HeaderContainer>
  );
};

export default Header;
