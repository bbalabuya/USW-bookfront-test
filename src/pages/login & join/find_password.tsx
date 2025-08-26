import React, { useState } from "react";
import "./find_password.css";
import axios from "axios";

const Find_password = () => {
  const URL = (import.meta as any).env.VITE_DOMAIN_URL;
  const [email, setEmail] = useState("");
  const [activeButton, setActiveButton] = useState(false); // 인증코드 발송 완료 여부
  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [change_password, setChange_password] = useState("");
  const [confirm_password, setConfirm_password] = useState("");

  // 이메일 조건 확인
  const emailTest = email.includes("@") && email.endsWith(".com");

  // 1. 이메일 인증코드 발송
  const sendCode = () => {
    if (!emailTest) return;

    axios
      .post(
        `${URL}/api/mail/send-verification`,
        { email: email },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          alert("인증코드가 발송되었습니다!");
          setActiveButton(true); // 인증 확인 버튼 활성화
        }
      })
      .catch((error) => {
        console.error(error);
        alert("인증코드 발송 실패");
      });
  };

  // 2. 인증코드 확인
  const verifyCode = () => {
    if (!code) {
      alert("인증코드를 입력해주세요.");
      return;
    }

    axios
      .post(
        `${URL}/api/emails/verify`,
        { email: email, code: code },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          alert("인증 성공!");
          setIsVerified(true); // 비밀번호 입력창 활성화
        } else {
          alert("인증코드가 올바르지 않습니다.");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("인증 확인 중 오류가 발생했습니다.");
      });
  };

  // 3. 비밀번호 초기화
  const sendNewPassword = () => {
    if (change_password !== confirm_password) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    axios
      .post(
        `${URL}/api/me/auth/reset-password`,
        { email: email, newPassword: change_password },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          alert("비밀번호가 변경되었습니다. 로그인 해주세요.");
          // 초기화
          setChange_password("");
          setConfirm_password("");
          setIsVerified(false);
          setCode("");
          setActiveButton(false);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("비밀번호 변경 실패");
      });
  };

  return (
    <div className="find_password-whole-container">
      <div className="find_password-header">
        <div className="find_password-title">비밀번호 찾기</div>
      </div>

      <div className="find_password-content">
        {/* 1. 이메일 */}
        <div className="find_password-set">
          <div className="find_password-input-title">
            가입했던 이메일을 입력해주세요
          </div>
          <div className="find_password-code-set">
            <input
              className="find_password-enter"
              placeholder="학교 이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="find_password-send-code"
              onClick={sendCode}
              disabled={!emailTest}
            >
              인증코드 발송
            </button>
          </div>
        </div>

        {/* 2. 인증코드 */}
        <div className="find_password-set">
          <div className="find_password-input-title">인증코드를 입력해주세요</div>
          <div className="find_password-code-set">
            <input
              className="find_password-enter"
              placeholder="인증코드를 입력하세요"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={!activeButton}
            />
            <button
              className="find_password-send-code"
              onClick={verifyCode}
              disabled={!activeButton}
            >
              인증 확인
            </button>
          </div>
        </div>

        {/* 3. 비밀번호 변경 */}
        <div className="find_password-set">
          <div className="find_password-input-title">변경할 비밀번호를 입력해주세요</div>
          <input
            type="password"
            className="find_password-enter"
            placeholder="새 비밀번호 입력"
            disabled={!isVerified}
            value={change_password}
            onChange={(e) => setChange_password(e.target.value)}
          />
        </div>
        <div className="find_password-set">
          <div className="find_password-input-title">비밀번호 확인</div>
          <input
            type="password"
            className="find_password-enter"
            placeholder="비밀번호 재입력"
            disabled={!isVerified}
            value={confirm_password}
            onChange={(e) => setConfirm_password(e.target.value)}
          />
        </div>

        {/* 4. 비밀번호 초기화 버튼 */}
        <button
          className="find_password-reset-password"
          onClick={sendNewPassword}
          disabled={!isVerified || !change_password || !confirm_password}
        >
          비밀번호 초기화
        </button>
      </div>
    </div>
  );
};

export default Find_password;
