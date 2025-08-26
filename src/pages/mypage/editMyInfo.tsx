import React, { useEffect, useState } from "react";
import "./editMyInfo.css";
import axios from "axios";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

const EditMyInfo = () => {
  const [profileImage, setProfileImage] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [year, setYear] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [major, setMajor] = useState<string>("");

  // 1. 내 정보 불러오기
  useEffect(() => {
    axios
      .get(`${URL}/api/me`)
      .then((res) => {
        setProfileImage(res.data.img || "");
        setNickname(res.data.name || "");
        setYear(res.data.year || 1);
        setSemester(res.data.semester || 1);
        setMajor(res.data.major || "");
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // 2. 변경된 정보 저장하기
  const handleSave = () => {
    const updatedData = {
      img: profileImage,
      name: nickname,
      year,
      semester,
      major,
    };

    axios
      // TODO: 변경 API 경로 확정 시 수정
      .put(`${URL}/api/me`, updatedData)
      .then(() => {
        alert("정보가 저장되었습니다!");
      })
      .catch((err) => {
        console.error(err);
        alert("저장 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="edit-whole-container">
      <div className="edit-profile-set">
        <img className="edit-img" src={profileImage} alt="프로필 이미지" />
        <button
          className="edit-profile-button"
          onClick={() => alert("프로필 변경 기능은 추후 구현 예정")}
        >
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
