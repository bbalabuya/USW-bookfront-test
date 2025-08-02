import React, { useState} from "react";
import "./join.css";
import axios from "axios";  
import { useNavigate } from "react-router-dom";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

const Join = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [school, setSchool] = useState<string>("수원대학교");
  const [grade, setGrade] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [major, setMajor] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailCode, setEmailCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);


  const handleEmailVerify = () => {
    axios.post(`${URL}/api/mail/send-verification`, {
      email: email,
    }).then((res) => {
      alert(res.data.message); {/* 인증코드 발송 성공 메시지 */}
    }).catch((err) => {
      console.log(err);
    });
  };

  const handleEmailVerifyCheck = () => {
    axios.post(`${URL}/api/me/emails/verify`, {
      email: email,
      authcode: emailCode,
    }).then((res) => {
      alert(res.data.message); {/* 인증코드 확인 성공 메시지 */}
      setIsEmailVerified(true);
    }).catch((err) => {
      console.log(err);
    });
  };

  const handleJoin = () => {
      if(name === "" || school === "" || grade === 0 || semester === 0 || major === "" || email === "" || emailCode === "" || password === "" || passwordCheck === ""){
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if(password !== passwordCheck){
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if(!isEmailVerified){
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    axios.post(`${URL}/api/me/join`, {
      //studentId: 
      email: email,
      password: password,
      confirmPassword: passwordCheck,
      name: name,
      major: major,
      grade: grade,
      semester: semester,
      //school: school,
    }).then((res) => {
      console.log(res);
      alert("회원가입이 완료되었습니다.로그인 해주세요."); {/* 회원가입 성공 메시지 */}
      navigate("/login");
    }).catch((err) => {
      console.log(err);
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
            placeholder="학교명을 입력하세요"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            disabled={true}
          />
        </div>
      </div>

      {/* 학년, 학기 , 전공 */}
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
        <div className="join-input-container" style={{ width: "50%" }}>
          <div className="join-input-title">전공</div>
          <select  className="join-input"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          >
            <option value="">선택</option>
            <option value="컴퓨터공학과">컴퓨터공학과</option>
            <option value="전자공학과">전자공학과</option>
            <option value="기계공학과">기계공학과</option>
            <option value="화학공학과">화학공학과</option>
            <option value="생명공학과">생명공학과</option>
            <option value="식품공학과">식품공학과</option>
            <option value="환경공학과">환경공학과</option>
            <option value="토목공학과">토목공학과</option>
            <option value="건축공학과">건축공학과</option>
          </select>
        </div>
      </div>

      {/* 학교 이메일, 인증 */}
      <div className="double-input-container">
        <div className="join-input-container" style={{ width: "75%" }}>
          <div className="join-input-title">학교 이메일</div>
          <input
            type="email"
            className="join-input"
            placeholder="학교 이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailVerified}
          />
        </div>
        <div className="join-input-container" style={{ width: "25%" }}>
          <button className="email-verify-button" onClick={handleEmailVerify} disabled={isEmailVerified}>인증코드 발송</button>
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
            disabled={isEmailVerified}
            onChange={(e) => setEmailCode(e.target.value)}
          />
        </div>
        <div className="join-input-container" style={{ width: "15%" }}>
          <button className="email-verify-button" onClick={handleEmailVerifyCheck} disabled={isEmailVerified}>확인</button>
        </div>
      </div>

   

      {/* 비밀번호, 비밀번호 확인 */}
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
