import React, { useEffect, useState } from "react";
import "./upload.css";
import imgUpload from "../../assets/imgUpload.png";
import { useNavigate } from "react-router-dom";
import {getMajorList} from "../../API/uploadAPI";

const API_URL = import.meta.env.VITE_DOMAIN_URL;

const Upload = () => {
  const [postName, setPostName] = useState("");
  const [title, setTitle] = useState("");
  const [postPrice, setPostPrice] = useState("");
  const [content, setContent] = useState("");
  const [professor, setProfessor] = useState("");
  const [courseName, setCourseName] = useState("");
  const [grade, setGrade] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [postImage, setPostImage] = useState<File[]>([]);
  const [majorList, setMajorList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [majorId, setMajorId] = useState("");

  const navigate = useNavigate();

  /** 📸 이미지 업로드 */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setPostImage((prev) => [...prev, ...files].slice(0, 4)); // 최대 4장
  };

  /** ❌ 이미지 삭제 */
  const handleDeleteImage = (index: number) => {
    setPostImage((prev) => prev.filter((_, i) => i !== index));
  };

  /** 🧾 게시글 업로드 */
  /** 🧾 게시글 업로드 */
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // 공통 데이터
      const baseData = {
        postName,
        title,
        postPrice,
        content,
        professor,
        courseName,
        grade,
        semester,
        majorId,
      };

      // ✅ 이미지가 있는 경우 (multipart/form-data)
      if (postImage.length > 0) {
        const formData = new FormData();

        // 최대 3장까지만 첨부
        postImage.slice(0, 3).forEach((file) => {
          formData.append("postImage", file);
        });

        // 나머지 텍스트 데이터 추가
        Object.entries(baseData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });

        const res = await fetch(`${API_URL}/api/posts`, {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: formData,
        });

        if (!res.ok) throw new Error("업로드 실패 (이미지 포함)");
        alert("📸 이미지 포함 게시글이 성공적으로 업로드되었습니다.");
      }
      // ✅ 이미지가 없는 경우 (application/json)
      else {
        const res = await fetch(`${API_URL}/api/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(baseData),
        });

        if (!res.ok) throw new Error("업로드 실패 (이미지 없음)");
        alert("📝 이미지 없이 게시글이 성공적으로 업로드되었습니다.");
      }

      navigate("/");
    } catch (err) {
      alert("업로드 중 오류가 발생했습니다.");
      console.error("❌ [handleSubmit] 업로드 실패:", err);
    }
  };

  /** 🎓 전공 목록 불러오기 */
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const list = await getMajorList(); // ✅ 배열 그대로 받음
        setMajorList(list);
        if (list.length > 0) setMajorId(list[0].id);
      } catch (err) {
        console.error("전공 리스트 불러오기 실패:", err);
      }
    };
    fetchMajors();
  }, []);

  return (
    <div className="upload-whole-container">
      {/* 왼쪽: 이미지 업로드 */}
      <div className="upload-left-container">
        <div className="img-upload-set">
          {Array.from({ length: 4 }).map((_, index) => {
            if (index === 0) {
              return (
                <label key={index} className="img-slot">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <img src={imgUpload} alt="카메라" className="upload-icon" />
                </label>
              );
            }
            const file = postImage[index - 1];
            return (
              <div
                key={index}
                className={`img-slot ${file ? "has-image" : "empty"}`}
              >
                {file ? (
                  <div className="img-wrapper">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`업로드 이미지 ${index}`}
                      className="uploaded-img"
                    />
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteImage(index - 1)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="empty-slot"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 오른쪽: 입력 폼 */}
      <div className="upload-right-container">
        {/* 게시글 제목 */}
        <div className="enter-title-set">
          <div className="enter-title">게시글 제목</div>
          <input
            className="enter-box"
            placeholder="게시글의 제목을 입력해주세요"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
          />
        </div>

        {/* 책 제목 */}
        <div className="enter-title-set">
          <div className="enter-title">책 제목</div>
          <input
            className="enter-box"
            placeholder="판매하려는 책 이름을 넣어주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 책의 상태 */}
        <div className="enter-title-set">
          <div className="enter-title">책의 상태</div>
          <input
            className="enter-info-box"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="course-professor-container">
          {/* 교수명 */}
          <div className="enter-title-set">
            <div className="enter-title">교수명</div>
            <input
              className="enter-professor"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
            />
          </div>

          {/* 강의명 */}
          <div className="enter-title-set">
            <div className="enter-title">강의명</div>
            <input
              className="enter-box"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>
        </div>

        {/* 학년 / 학기 */}
        <div className="enter-title-set">
          <div className="enter-title">학년 / 학기</div>
          <div className="upload-select-set">
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>
                  {y}학년
                </option>
              ))}
            </select>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              {[1, 2].map((s) => (
                <option key={s} value={s}>
                  {s}학기
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 전공 선택 */}
        <div className="enter-title-set">
          <div className="enter-title">전공</div>
          <select
            className="enter-box"
            value={majorId}
            onChange={(e) => setMajorId(e.target.value)}
          >
            {majorList.map((major) => (
              <option key={major.id} value={major.id}>
                {major.name}
              </option>
            ))}
          </select>
        </div>

        {/* 가격 */}
        <div className="enter-title-set">
          <div className="enter-title">가격</div>
          <input
            placeholder="가격을 입력해주세요"
            className="enter-box"
            value={postPrice}
            onChange={(e) => setPostPrice(e.target.value)}
          />
        </div>

        <button className="save-upload-button" onClick={handleSubmit}>
          업로드하기
        </button>
      </div>
    </div>
  );
};

export default Upload;



