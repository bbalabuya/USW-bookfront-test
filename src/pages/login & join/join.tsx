import React, { useState } from "react";
import "./join.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imgUpload from "../../assets/imgUpload.png";

const API_URL = (import.meta as any).env.VITE_DOMAIN_URL;

const Join = () => {
  const navigate = useNavigate();

  // 회원가입 정보 상태
  const [name, setName] = useState<string>("");
  const [school, setSchool] = useState<string>("수원대학교");
  const [grade, setGrade] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [major, setMajor] = useState<string>("");
  const [studentCode, setStudentCode] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailCode, setEmailCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");

  // 이메일 인증 상태
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false); // 인증코드 발송됨
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false); // 인증 완료됨

  // 프로필 이미지 상태
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>(imgUpload);

  // 이메일 인증코드 발송
  const handleEmailVerify = () => {
    if (!email.endsWith("@suwon.ac.kr")) {
      alert("현재 수원대학교 이메일(@suwon.ac.kr)만 사용 가능합니다.");
      return;
    }

    axios
      .post(`${API_URL}/api/mail/send-verification`, { email })
      .then((res) => {
        console.log("확인 응답:", res);
        alert("인증코드가 발송되었습니다. 이메일을 확인해주세요.");
        setIsEmailSent(true); // 이메일 발송 완료 → 입력창 잠금
      })
      .catch((err) => {
        console.error("❌ 에러:", err);
      });
  };

  // 이메일 인증코드 확인
  const handleEmailVerifyCheck = () => {
    axios
      .post(`${API_URL}/api/me/emails/verify`, { email, authcode: emailCode })
      .then((res) => {
        alert(res.data.message);
        setIsEmailVerified(true); // 인증 성공 → 인증코드 입력창 잠금
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(window.URL.createObjectURL(file));
    }
  };

  // 회원가입 처리
const handleJoin = () => {
  // 빈칸 없도록
  if (
    !name ||
    !school ||
    !grade ||
    !semester ||
    !major ||
    !studentCode ||
    !email ||
    !emailCode ||
    !password 
  ) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  // 비밀번호 유효성 검사(정규식)
  const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^])[A-Za-z\d@$!%*?&^]{8,20}$/;
  if (!passwordRegex.test(password)) {
    alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다.");
    return;
  }

  // 비밀번호 확인이 일치하지 않는 경우
  if (password !== passwordCheck) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 이메일 인증을 하지 않은 경우
  if (!isEmailVerified) {
    alert("이메일 인증을 완료해주세요.");
    return;
  }

  // JSON 객체 생성
  const userInfo = {
    studentCode,
    email,
    password,
    name,
    majorName: major,
    grade,
    semester,
  };

  const formData = new FormData();
  formData.append(
    "requestDto",
    new Blob([JSON.stringify(userInfo)], { type: "application/json" })
  );

  // 이미지는 존재하는 경우만
  if (profileFile) {
    formData.append("profileImage", profileFile);
  }

  // 요청 전송
  axios
    .post(`${API_URL}/api/me/join`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      console.log(res);
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      navigate("/login");
    })
    .catch((err) => {
      console.error(err);
    });
};


  return (
    <div className="join-container">
      <div className="join-title">회원가입을 진행합니다</div>

      {/* 이름, 소속 학교 */}
      <div className="double-input-container">
        <div className="join-input-container">
          <div className="join-input-title">이름</div>
          <input
            type="text"
            className="join-input"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="join-input-container">
          <div className="join-input-title">소속 학교</div>
          <input
            type="text"
            className="join-input input-disabled"
            value={school}
            disabled
          />
        </div>
      </div>

      {/* 학년, 학기 */}
      <div className="double-input-container">
        <div className="join-input-container" style={{ width: "25%" }}>
          <div className="join-input-title">학년</div>
          <select
            className="join-input select"
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
          >
            <option value="">선택</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">4학년</option>
            <option value="5">5학년 이상</option>
          </select>
        </div>
        <div className="join-input-container" style={{ width: "25%" }}>
          <div className="join-input-title">학기</div>
          <select
            className="join-input select"
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
          >
            <option value="">선택</option>
            <option value="1">1학기</option>
            <option value="2">2학기</option>
          </select>
        </div>
        
        {/* 전공 */}
        <div className="join-input-container" style={{ width: "50%" }}>
          <div className="join-input-title">전공</div>
          <select
            className="join-input"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          >
            <option value="">선택</option>
            <option value="컴퓨터공학과">컴퓨터공학과</option>
            <option value="전자공학과">전자공학과</option>
            <option value="기계공학과">기계공학과</option>
            <option value="화학공학과">화학공학과</option>
            <option value="생명공학과">생명공학과</option>
          </select>
        </div>
      </div>

      {/* 학번 */}
      <div className="join-input-container">
        <div className="join-input-title">학번</div>
        <input
          type="text"
          className="join-input"
          placeholder="학번을 입력해주세요"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
        />
      </div>

      {/* 이메일, 인증 */}
      <div className="double-input-container">
        <div className="join-input-container" style={{ width: "75%" }}>
          <div className="join-input-title">학교 이메일</div>
          <input
            type="email"
            className="join-input"
            placeholder="학교 이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailSent} // 발송 후 잠금
          />
        </div>
        <div className="join-input-container" style={{ width: "25%" }}>
          <button
            className="email-verify-button"
            onClick={handleEmailVerify}
            disabled={isEmailSent} // 발송 후 잠금
          >
            인증코드 발송
          </button>
        </div>
      </div>
      <div className="double-input-container" style={{ marginBottom: "15px" }}>
        <div className="join-input-container" style={{ width: "85%" }}>
          <div className="join-input-title">인증코드 입력</div>
          <input
            type="text"
            className="join-input"
            placeholder="인증코드를 입력해주세요"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
            disabled={isEmailVerified} // 인증 완료 후 잠금
          />
        </div>
        <div className="join-input-container" style={{ width: "15%" }}>
          <button
            className="email-verify-button"
            onClick={handleEmailVerifyCheck}
            disabled={isEmailVerified} // 인증 완료 후 잠금
          >
            확인
          </button>
        </div>
      </div>

      {/* 프로필 이미지 */}
      <div className="join-profile-set">
        <img
          key={profilePreview}
          src={profilePreview}
          className="join-profile-box"
          style={{ padding: profileFile ? 0 : "10px" }}
        />
        <input
          type="file"
          accept="image/*"
          id="profile-upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          className="join-profile-button"
          onClick={() =>
            document.getElementById("profile-upload")?.click()
          }
        >
          프로필 이미지 업로드하기
        </button>
      </div>

      {/* 비밀번호 */}
      <div className="double-input-container">
        <div className="join-input-container">
          <div className="join-input-title">비밀번호</div>
          <input
            type="password"
            className="join-input"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="double-input-container">
        <div className="join-input-container">
          <div className="join-input-title">비밀번호 확인</div>
          <input
            type="password"
            className="join-input"
            placeholder="비밀번호 다시 입력"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <div className="join-submit-container">
        <button className="join-button" onClick={handleJoin}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Join;
