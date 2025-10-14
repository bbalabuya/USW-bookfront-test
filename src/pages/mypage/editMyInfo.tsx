import React, { useEffect, useRef, useState } from "react";
import "./editMyInfo.css";
import { useNavigate } from "react-router-dom";
import { getMyInfo, updateMyInfo, getMajorList } from "../../API/editMyInfoAPI";

const EditMyInfo = () => {
  const navigate = useNavigate();

  // ✅ 사용자 정보 상태
  const [profileImage, setProfileImage] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [year, setYear] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [major, setMajor] = useState<string>("");

  // ✅ 전공 목록 상태
  const [majorList, setMajorList] = useState<{ id: string; name: string }[]>(
    []
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ 1️⃣ 전공 목록 먼저, 그 다음 사용자 정보
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ 전공 목록 먼저 불러오기
        const majors = await getMajorList();
        setMajorList(majors);
        console.log("저장된 전공 목록:", major);

        // 2️⃣ 사용자 정보 불러오기
        const myInfo = await getMyInfo();

        // 3️⃣ input/select에 기본값 세팅
        setProfileImage(myInfo.img || "");
        setNickname(myInfo.name || "");
        setYear(myInfo.year || 1);
        setSemester(myInfo.semester || 1);
        setMajor(myInfo.major || "");
      } catch (err) {
        console.error("데이터 불러오기 오류:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ 2️⃣ 이미지 선택
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  // ✅ 3️⃣ 저장하기
  const handleSave = async () => {
    try {
      const userInfo = { name: nickname, year, semester, major };
      await updateMyInfo(userInfo, profileFile, profileImage);
      alert("정보가 저장되었습니다!");
      // navigate("/somepath");
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // ✅ 4️⃣ 파일 선택창 열기
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // ✅ 로딩 중 처리 (데이터 도착 전엔 빈칸 방지)
  if (!majorList.length || !nickname) {
    return <div className="loading">정보를 불러오는 중입니다...</div>;
  }

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
            {majorList.map((m) => (
              <option key={m.id} value={m.name}>
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
