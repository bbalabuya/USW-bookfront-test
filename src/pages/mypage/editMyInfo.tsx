import React, { useEffect, useRef, useState } from "react";
import "./editMyInfo.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = (import.meta as any).env.VITE_DOMAIN_URL;

const EditMyInfo = () => {
  const navigate = useNavigate();

  // 사용자 정보 상태
  const [profileImage, setProfileImage] = useState<string>(""); // 서버에서 받은 원본 URL
  const [profileFile, setProfileFile] = useState<File | null>(null); // 새로 업로드한 파일
  const [profilePreview, setProfilePreview] = useState<string>(""); // 미리보기 URL
  const [nickname, setNickname] = useState<string>("");
  const [year, setYear] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [major, setMajor] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1️⃣ 내 정보 불러오기
  useEffect(() => {
    axios
      .get(`${API_URL}/api/me`)
      .then((res) => {
        setProfileImage(res.data.img || "");
        setNickname(res.data.name || "");
        setYear(res.data.year || 1);
        setSemester(res.data.semester || 1);
        setMajor(res.data.major || "");
      })
      .catch((err) => console.error(err));
  }, []);

  // 2️⃣ 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file); // 실제 전송할 파일
      setProfilePreview(URL.createObjectURL(file)); // 미리보기용 URL
    }
  };

  // 3️⃣ 저장하기
  const handleSave = async () => {
    try {
      // JSON 객체 생성
      const userInfo = {
        name: nickname,
        year,
        semester,
        major,
      };

      const formData = new FormData();
      // JSON을 Blob으로 추가 (requestPart 방식)
      formData.append(
        "changeInfoRequest",
        new Blob([JSON.stringify(userInfo)], { type: "application/json" })
      );

      // 이미지가 있으면 추가
      if (profileFile) {
        formData.append("profileImage", profileFile);
      } else {
        // 기존 이미지 URL을 그대로 보내고 싶으면 서버에서 처리
        formData.append("profileImage", profileImage);
      }

      await axios.post(`${API_URL}/api/me`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("정보가 저장되었습니다!");
      // 필요 시 페이지 이동
      // navigate("/somepath");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 4️⃣ 버튼 클릭 시 파일 선택창 열기
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="edit-whole-container">
      <div className="edit-profile-set">
        <img
          className="edit-img"
          src={profilePreview || profileImage}
          alt="프로필 이미지"
        />

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button className="edit-profile-button" onClick={handleButtonClick}>
          프로필 이미지 변경하기
        </button>
      </div>

      <div className="edit-input-set">
        <div className="edit-title">닉네임</div>
        <input
          className="edit-input"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="edit-select-setting">
        <div className="each-set">
          <div className="edit-title">학년</div>
          <select
            className="edit-select-option"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            <option value={1}>1학년</option>
            <option value={2}>2학년</option>
            <option value={3}>3학년</option>
            <option value={4}>4학년</option>
          </select>
        </div>

        <div className="each-set">
          <div className="edit-title">학기</div>
          <select
            className="edit-select-option"
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
          >
            <option value={1}>1학기</option>
            <option value={2}>2학기</option>
          </select>
        </div>
      </div>

      <div className="edit-select-setting">
        <div className="each-set">
          <div className="edit-title">전공</div>
          <select
            className="edit-major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          >
            <option value="임시">임시</option>
            <option value="임시2">임시2</option>
          </select>
        </div>
      </div>

      <button className="save-button" onClick={handleSave}>
        저장하기
      </button>
    </div>
  );
};

export default EditMyInfo;
