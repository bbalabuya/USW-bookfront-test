// 📁 src/components/EditMyInfo/EditMyInfo.tsx

import React, { useEffect, useRef, useState } from "react";
import "./editMyInfo.css";
import { useNavigate } from "react-router-dom";
import {
  getMyInfo,
  updateMyInfo,
  updateProfileImage,
  uploadProfileImage, // ⭐ 추가: 이미지 파일 업로드 함수 import
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
      try {
        const majors = await getMajorList();
        setMajorList(majors);

        const my = await getMyInfo();
        setNickname(my.name || "");
        setGrade(my.grade?.toString() || "1");
        setSemester(my.semester?.toString() || "1");
        setProfileImage(my.img || "");
        setProfilePreview(my.img || ""); // 기존 이미지를 미리보기로 설정

        const matched = majors.find((m) => m.name === my.major);
        setMajorId(matched?.id || "");
      } catch (e) {
        console.error("초기 데이터 로드 실패", e);
      }
    };

    load();
  }, []);

  // 이미지 업로드 미리보기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file)); // ⭐ 로컬 파일로 미리보기
    }
  };

  const handleSave = async () => {
    try {
      // ⭐ 이미지 변경이 있는 경우에만 처리합니다.
      if (profileFile) {
        // 1️⃣ 이미지 파일 업로드 및 URL 획득
        // uploadProfileImage 함수를 호출하여 서버에 파일을 올리고 URL을 받습니다.
        const newImageUrl = await uploadProfileImage(profileFile);
        
        // 2️⃣ 획득한 URL을 프로필 정보에 반영
        // updateProfileImage 함수를 호출하여 DB의 profileImageUrl을 업데이트합니다.
        await updateProfileImage(newImageUrl);
      }

      // 3️⃣ 유저 정보 수정 요청 (이미지 변경 유무와 상관없이 항상 실행)
      await updateMyInfo({
        name: nickname,
        grade: Number(grade),
        semester: Number(semester),
        majorId: majorId,
      });

      alert("정보가 수정되었습니다!");
      navigate("/");
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
          // profilePreview가 있으면 로컬 미리보기, 없으면 기존 profileImage 사용
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

        <button
          className="edit-profile-button"
          onClick={() => fileInputRef.current?.click()}
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