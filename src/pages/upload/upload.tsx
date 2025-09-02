import React, { useState } from "react";
import "./upload.css";
import imgUpload from "../../assets/imgUpload.png"; // 카메라 아이콘
import { useNavigate } from "react-router-dom";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

const Upload = () => {
  const [year, setYear] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [professor, setProfessor] = useState("");
  const [courseName, setCourseName] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages].slice(0, 3)); // 최대 3장
  };

  // 이미지 삭제
  const handleDeleteImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // 타입스크립트 버전에 맞게 수정 필요
  const handleSubmit = async () => {
    const payload = {
      title,
      postPrice: Number(price),
      content: description,
      professor,
      courseName,
      grade: year,
      semester,
      postImage: images[0] || "", // 서버에서 여러 장 업로드 가능하면 수정
      majorId: "UUID",
    };

    try {
      const res = await fetch(`${URL}/api/posts`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("업로드 실패");
      alert("게시글이 성공적으로 업로드되었습니다.");
      navigate("/");
    } catch (err) {
      alert("업로드 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <div className="upload-whole-container">
      {/* 이미지 업로드 */}
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
          const imgSrc = images[index - 1];
          return (
            <div
              key={index}
              className={`img-slot ${imgSrc ? "has-image" : "empty"}`}
            >
              {imgSrc ? (
                <div className="img-wrapper">
                  <img
                    src={imgSrc}
                    alt={`업로드 이미지 ${index}`}
                    className="uploaded-img"
                  />
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteImage(index - 1)}
                  >
                    
                  </button>
                </div>
              ) : (
                <div className="empty-slot"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* 입력 폼 */}
      <div className="enter-title-set">
        <div className="enter-title">제목</div>
        <input
          className="enter-box"
          placeholder="판매하려는 책 이름을 넣어주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="enter-title-set">
        <div className="enter-title">책의 상태를 설명해주세요</div>
        <input
          className="enter-info-box"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="enter-title-set">
        <div className="enter-title">이 책을 사용한 교수님은 누구신가요?</div>
        <input
          className="enter-professor"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
        />
      </div>

      <div className="enter-title-set">
        <div className="enter-title">이 책을 사용한 강의 이름을 적어주세요</div>
        <input
          className="enter-box"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>

      <div className="enter-title-set">
        <div className="enter-title">몇 학기 강의였나요?</div>
        <div className="upload-select-set">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
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
            {[1, 2, 3, 4].map((s) => (
              <option key={s} value={s}>
                {s}학기
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="enter-title-set">
        <div className="enter-title">가격</div>
        <input
          placeholder="가격을 입력해주세요"
          className="enter-box"
          style={{ width: "200px" }}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <button className="save-upload-button" onClick={handleSubmit}>
        업로드하기
      </button>
    </div>
  );
};

export default Upload;
