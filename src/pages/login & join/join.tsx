import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import imgUpload from "../../assets/imgUpload.png";
import {
  sendEmailVerification,
  checkEmailVerification,
  join,
  getMojorList,
} from "../../API/joinAPI";
import { JoinRequest } from "../../types/join";
import "./join.css";

const Join: React.FC = () => {
  const navigate = useNavigate();

  // 회원가입 정보 상태
  const [name, setName] = useState("");
  const [school] = useState("수원대학교"); // 고정
  const [grade, setGrade] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [major, setMajor] = useState("");
  const [majorList, setMajorList] = useState<string[]>([]);
  const [studentCode, setStudentCode] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  // 이메일 인증 상태
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 프로필 이미지 상태
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>(imgUpload);

  // 컴포넌트 마운트 시 전공 리스트 가져오기
  useEffect(() => {
    const fetchMajorList = async () => {
      try {
        const majors = await getMojorList();
        setMajorList(majors); // API에서 받아온 리스트 저장
      } catch (err) {
        console.error("❌ 전공 리스트 불러오기 실패:", err);
      }
    };
    fetchMajorList();
  }, []);

  // 이메일 인증코드 발송
  const handleEmailVerify = async () => {
    if (!email.endsWith("@suwon.ac.kr")) {
      alert("현재 수원대학교 이메일(@suwon.ac.kr)만 사용 가능합니다.");
      return;
    }

    try {
      await sendEmailVerification(email);
      alert("인증코드가 발송되었습니다. 이메일을 확인해주세요.");
      setIsEmailSent(true);
    } catch (err) {
      console.error("❌ 이메일 인증 요청 실패:", err);
    }
  };

  // 이메일 인증코드 확인
  const handleEmailVerifyCheck = async () => {
    try {
      await checkEmailVerification(email, emailCode);
      alert("이메일 인증이 완료되었습니다.");
      setIsEmailVerified(true);
    } catch (err) {
      console.error("❌ 이메일 인증 확인 실패:", err);
    }
  };

  // 이미지 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // 회원가입 처리
  const handleJoin = async () => {
    // 필수 입력값 확인(이미지는 필수 아님)
    if (
      !name ||
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

    // 비밀번호 유효성 검사
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^])[A-Za-z\d@$!%*?&^]{8,20}$/;
    if (!passwordRegex.test(password)) {
      alert("비밀번호는 영문, 숫자, 특수문자를 포함한 8~20자여야 합니다.");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    const userInfo: JoinRequest = {
      studentCode,
      email,
      password,
      name,
      majorName: major,
      grade,
      semester,
    };

    try {
      await join(userInfo, profileFile || undefined);
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      navigate("/login");
    } catch (err) {
      console.error("❌ 회원가입 실패:", err);
    }
  };

  return (
    <div className="join-container">
      <div className="join-title">회원가입을 진행합니다</div>

      {/* 이름 + 학교 */}
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

      {/* 학년 + 학기 + 전공 */}
      <div className="double-input-container">
        <div className="join-input-container" style={{ width: "25%" }}>
          <div className="join-input-title">학년</div>
          <select
            className="join-input select"
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
          >
            <option value="">선택</option>
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>
                {y}학년
              </option>
            ))}
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
        <div className="join-input-container" style={{ width: "50%" }}>
          <div className="join-input-title">전공</div>
          <select
            className="join-input"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          >
            <option value="">선택</option>
            {majorList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
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

      {/* 이메일 + 인증 */}
      <div className="double-input-container">
        <div className="join-input-container" style={{ width: "75%" }}>
          <div className="join-input-title">학교 이메일</div>
          <input
            type="email"
            className="join-input"
            placeholder="학교 이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailSent}
          />
        </div>
        <div className="join-input-container" style={{ width: "25%" }}>
          <button
            className="email-verify-button"
            onClick={handleEmailVerify}
            disabled={isEmailSent}
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
            disabled={isEmailVerified}
          />
        </div>
        <div className="join-input-container" style={{ width: "15%" }}>
          <button
            className="email-verify-button"
            onClick={handleEmailVerifyCheck}
            disabled={isEmailVerified}
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
          onClick={() => document.getElementById("profile-upload")?.click()}
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
