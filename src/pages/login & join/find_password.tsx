import React, { useState } from "react";
import "./find_password.css";
import {
  sendEmailVerification,
  checkEmailVerification,
  resetPassword,
} from "../../API/find_password";

const FindPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activeButton, setActiveButton] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const emailValid = email.includes("@") && email.endsWith(".com");

  // ✅ 1. 이메일 인증코드 발송
  const handleSendCode = async () => {
    if (!emailValid) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }

    const sent = await sendEmailVerification(email);
    if (sent) {
      alert("인증코드가 발송되었습니다. 이메일을 확인해주세요.");
      setActiveButton(true);
    } else {
      alert("인증코드 발송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // ✅ 2. 인증코드 확인
  const handleVerifyCode = async () => {
    if (!authCode) {
      alert("인증코드를 입력해주세요.");
      return;
    }

    const verified = await checkEmailVerification(email, authCode);
    if (verified) {
      alert("이메일 인증이 완료되었습니다.");
      setIsVerified(true);
    } else {
      alert("인증코드가 올바르지 않습니다. 다시 확인해주세요.");
    }
  };

  // ✅ 3. 비밀번호 초기화
  const handleResetPassword = async () => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^])[A-Za-z\d@$!%*?&^]{8,20}$/;

    if (!passwordRegex.test(changePassword)) {
      alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다.");
      return;
    }

    if (changePassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isVerified) {
      alert("이메일 인증을 먼저 완료해주세요.");
      return;
    }

    try {
      const res = await resetPassword({
        email,
        newPassword: changePassword,
      });

      if (res.status === 200) {
        alert("비밀번호가 변경되었습니다. 로그인 해주세요.");
        setEmail("");
        setAuthCode("");
        setChangePassword("");
        setConfirmPassword("");
        setActiveButton(false);
        setIsVerified(false);
      } else {
        alert(res.message || "비밀번호 변경 실패");
      }
    } catch {
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="find_password-whole-container">
      <div className="find_password-header">
        <div className="find_password-title">비밀번호 재설정</div>
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
              onClick={handleSendCode}
              disabled={!emailValid}
            >
              인증코드 발송
            </button>
          </div>
        </div>

        {/* 2. 인증코드 */}
        {activeButton && (
          <div className="find_password-set">
            <div className="find_password-input-title">
              인증코드를 입력해주세요
            </div>
            <div className="find_password-code-set">
              <input
                className="find_password-enter"
                placeholder="인증코드를 입력하세요"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <button
                className="find_password-send-code"
                onClick={handleVerifyCode}
              >
                인증 확인
              </button>
            </div>
          </div>
        )}

        {/* 3. 비밀번호 변경 */}
        {isVerified && (
          <>
            <div className="find_password-set">
              <div className="find_password-input-title">
                변경할 비밀번호를 입력해주세요
              </div>
              <input
                type="password"
                className="find_password-enter"
                placeholder="새 비밀번호 입력"
                value={changePassword}
                onChange={(e) => setChangePassword(e.target.value)}
              />
            </div>
            <div className="find_password-set">
              <div className="find_password-input-title">비밀번호 확인</div>
              <input
                type="password"
                className="find_password-enter"
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              className="find_password-reset-password"
              onClick={handleResetPassword}
              disabled={!changePassword || !confirmPassword}
            >
              비밀번호 재설정하기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FindPassword;
