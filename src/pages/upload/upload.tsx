import React, { useState } from "react";
import "./upload.css";
import imgUpload from "../../assets/imgUpload.png"; // 카메라 아이콘
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_DOMAIN_URL;

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
    console.log("📷 업로드된 파일:", files);

    const newImages = files.map((file) => window.URL.createObjectURL(file));
    console.log("🖼️ 미리보기용 URL:", newImages);

    setImages((prev) => {
      const updated = [...prev, ...newImages].slice(0, 3); // 최대 3장
      console.log("✅ 현재 이미지 상태:", updated);
      return updated;
    });
  };

  // 이미지 삭제
  const handleDeleteImage = (index: number) => {
    console.log(`🗑️ 이미지 ${index} 삭제 시도`);
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      console.log("✅ 삭제 후 이미지 상태:", updated);
      return updated;
    });
  };

  // 게시글 업로드
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

    console.log("📦 업로드 요청 payload:", payload);

    try {
      const token = localStorage.getItem("accessToken"); // 저장된 토큰 가져오기
      console.log("🔑 로컬스토리지 accessToken:", token);

      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // Bearer 토큰 추가
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 요청 URL:", `${API_URL}/api/posts`);
      console.log("📨 요청 헤더:", {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      });

      if (!res.ok) {
        console.error("❌ 업로드 실패, 상태 코드:", res.status);
        throw new Error("업로드 실패");
      }

      const result = await res.json();
      console.log("✅ 업로드 성공, 서버 응답:", result);

      alert("게시글이 성공적으로 업로드되었습니다.");
      navigate("/");
    } catch (err) {
      alert("업로드 중 오류가 발생했습니다.");
      console.error("❌ 업로드 중 에러:", err);
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
                  ></button>
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
          onChange={(e) => {
            console.log("✏️ 제목 입력:", e.target.value);
            setTitle(e.target.value);
          }}
        />
      </div>

      <div className="enter-title-set">
        <div className="enter-title">책의 상태를 설명해주세요</div>
        <input
          className="enter-info-box"
          value={description}
          onChange={(e) => {
            console.log("✏️ 설명 입력:", e.target.value);
            setDescription(e.target.value);
          }}
        />
      </div>

      <div className="enter-title-set">
        <div className="enter-title">이 책을 사용한 교수님은 누구신가요?</div>
        <input
          className="enter-professor"
          value={professor}
          onChange={(e) => {
            console.log("✏️ 교수명 입력:", e.target.value);
            setProfessor(e.target.value);
          }}
        />
      </div>

      <div className="enter-title-set">
        <div className="enter-title">이 책을 사용한 강의 이름을 적어주세요</div>
        <input
          className="enter-box"
          value={courseName}
          onChange={(e) => {
            console.log("✏️ 강의명 입력:", e.target.value);
            setCourseName(e.target.value);
          }}
        />
      </div>

      <div className="enter-title-set">
        <div className="enter-title">몇 학기 강의였나요?</div>
        <div className="upload-select-set">
          <select
            value={year}
            onChange={(e) => {
              console.log("📚 학년 선택:", e.target.value);
              setYear(Number(e.target.value));
            }}
          >
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>
                {y}학년
              </option>
            ))}
          </select>
          <select
            value={semester}
            onChange={(e) => {
              console.log("📚 학기 선택:", e.target.value);
              setSemester(Number(e.target.value));
            }}
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
          onChange={(e) => {
            console.log("💰 가격 입력:", e.target.value);
            setPrice(e.target.value);
          }}
        />
      </div>

      <button
        className="save-upload-button"
        onClick={() => {
          console.log("📤 업로드 버튼 클릭");
          handleSubmit();
        }}
      >
        업로드하기
      </button>
    </div>
  );
};

export default Upload;
