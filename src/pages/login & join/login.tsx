import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import reactLogo from "../../assets/react.svg";
import { login } from "../../API/loginAPI";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      await login(email, password);
      alert("로그인 성공! 홈으로 이동합니다.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("로그인 실패");
    }
  };

  return (
    <div className="login-container">
      <img className="logo" src={reactLogo} alt="logo" />
      <div className="title">수북</div>

      <div className="enterbox-container">
        <div className="enterbox-title">학교 이메일</div>
        <input
          type="text"
          required
          className="enterbox"
          placeholder="학교 이메일을 입력해주세요"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="enterbox-container">
        <div className="enterbox-title">비밀번호</div>
        <input
          type="password"
          required
          className="enterbox"
          placeholder="비밀번호를 입력해주세요"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="login-button" onClick={handleLogin}>
        로그인
      </div>

      <div className="join-find-wrapper">
        <div>아직 회원이 아니신가요?</div>
        <Link to="/join">회원가입</Link>
      </div>

      <div className="join-find-wrapper">
        <div>비밀번호를 잊었어요!</div>
        <Link to="/find_password">비밀번호 찾기</Link>
      </div>

      <div className="agree">약관동의</div>
    </div>
  );
};

export default Login;
