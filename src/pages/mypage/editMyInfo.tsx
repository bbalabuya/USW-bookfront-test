import React, { useEffect, useRef, useState } from "react";
import "./editMyInfo.css";
import { useNavigate } from "react-router-dom";
import {
  getMyInfo,
  updateMyInfo,
  uploadProfileImage,
  updateProfileImage,
  getMajorList,
} from "../../API/editMyInfoAPI";

const EditMyInfo = () => {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");

  const [nickname, setNickname] = useState<string>("");
  const [grade, setGrade] = useState<string>("1");
  const [semester, setSemester] = useState<string>("1");
  const [majorId, setMajorId] = useState<string>("");

  const [majorList, setMajorList] = useState<{ id: string; name: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 초기 데이터 로드
  useEffect(() => {
    const load = async () => {
      const majors = await getMajorList();
      setMajorList(majors);

      const my = await getMyInfo();
      setNickname(my.name || "");
      setGrade(my.grade?.toString() || "1");
      setSemester(my.semester?.toString() || "1");
      setProfileImage(my.img || "");

      const matched = majors.find((m) => m.name === my.major);
      setMajorId(matched?.id || "");
    };

    load();
  }, []);

  // 이미지 업로드 미리보기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      // ⭐ 1️⃣ 프로필 이미지 먼저 업로드 → URL 받기
      if (profileFile) {
        const url = await uploadProfileImage(profileFile);
        await updateProfileImage(url);
      }

      // ⭐ 2️⃣ 유저 정보 수정 요청
      await updateMyInfo({
        name: nickname,
        grade: Number(grade),
        semester: Number(semester),
        majorId: majorId,
      });

      alert("정보가 수정되었습니다!");
      navigate("/mypage");
    } catch (err) {
      console.error(err);
      alert("저장 실패");
    }
  };

  return (
    <div className="edit-whole-container">
      <div className="edit-profile-set">
        <img
          className="edit-img"
          src={profilePreview || profileImage}
          alt="프로필"
        />

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button className="edit-profile-button" onClick={() => fileInputRef.current?.click()}>
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
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">4학년</option>
          </select>
        </div>

        <div className="each-set">
          <div className="edit-title">학기</div>
          <select
            className="edit-select-option"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="1">1학기</option>
            <option value="2">2학기</option>
          </select>
        </div>
      </div>

      <div className="edit-select-setting">
        <div className="each-set">
          <div className="edit-title">전공</div>
          <select
            className="edit-major"
            value={majorId}
            onChange={(e) => setMajorId(e.target.value)}
          >
            {majorList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
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
