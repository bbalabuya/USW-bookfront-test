import React, { useEffect, useState } from "react";
import "./upload.css";
import imgUpload from "../../assets/imgUpload.png";
import { useNavigate, useLocation } from "react-router-dom";
import { getMajorList } from "../../API/uploadAPI";
import axios from "axios";

const API_URL = import.meta.env.VITE_DOMAIN_URL;
const MAX_IMAGES = 5;

const EditPost = () => {
  const [postName, setPostName] = useState("");
  const [title, setTitle] = useState("");
  const [postPrice, setPostPrice] = useState("");
  const [content, setContent] = useState("");
  const [professor, setProfessor] = useState("");
  const [courseName, setCourseName] = useState("");
  const [grade, setGrade] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [postImage, setPostImage] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]); // 원본 이미지 URL 미리보기
  const [majorList, setMajorList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [majorId, setMajorId] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const navigate = useNavigate();
  const location = useLocation();
  const willEditPostId = location.state?.PostId;

  /** 🎓 전공 목록 + 게시글 원본 불러오기 */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ 전공 목록 먼저 불러오기
        const majors = await getMajorList();
        setMajorList(majors);
        if (majors.length > 0) setMajorId(majors[0].id);

        // 2️⃣ 원본 게시글 불러오기
        if (!willEditPostId) return;
        const { data } = await axios.get(
          `${API_URL}/api/posts/${willEditPostId}`
        );
        const post = data.data;

        console.log("📥 원본 게시글:", post);

        // 3️⃣ 원본 게시글 데이터 상태로 저장
        setPostName(post.postName || "");
        setTitle(post.title || "");
        setPostPrice(post.postPrice ? String(post.postPrice) : "");
        setContent(post.content || "");
        setProfessor(post.professor || "");
        setCourseName(post.courseName || "");
        setGrade(post.grade || 1);
        setSemester(post.semester || 1);
        setMajorId(post.majorId || majors[0]?.id || "");

        // 4️⃣ 기존 이미지 URL (서버 경로) 저장
        if (post.postImageUrls && Array.isArray(post.postImageUrls)) {
          setImagePreviewUrls(post.postImageUrls);
          setSelectedImageIndex(0);
        }
      } catch (err) {
        console.error("❌ 원본 게시글 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [willEditPostId]);

  /** 📸 이미지 업로드 */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImages = [...postImage, ...files].slice(0, MAX_IMAGES);
    setPostImage(newImages);
    const newPreviewUrls = [
      ...imagePreviewUrls,
      ...files.map((file) => URL.createObjectURL(file)),
    ].slice(0, MAX_IMAGES);
    setImagePreviewUrls(newPreviewUrls);

    if (
      newPreviewUrls.length > 0 &&
      (selectedImageIndex === null ||
        newPreviewUrls[selectedImageIndex] === undefined)
    ) {
      setSelectedImageIndex(0);
    }
    e.target.value = "";
  };

  /** ❌ 이미지 삭제 */
  const handleDeleteImage = (index: number) => {
    setPostImage((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    if (selectedImageIndex === index) {
      setSelectedImageIndex(0);
    }
  };

  /** 🧾 게시글 수정 요청 */
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();

      formData.append("postName", postName);
      formData.append("title", title);
      const priceInt = parseInt(postPrice.replace(/,/g, ""));
      formData.append("postPrice", String(isNaN(priceInt) ? 0 : priceInt));
      formData.append("professor", professor);
      formData.append("courseName", courseName);
      formData.append("grade", String(grade));
      formData.append("semester", String(semester));
      formData.append("content", content);
      formData.append("majorId", majorId);

      postImage.forEach((file) => {
        formData.append("postImage", file);
      });

      const res = await fetch(`${API_URL}/api/posts/${willEditPostId}`, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`수정 실패: ${res.status} - ${errorText}`);
      }

      alert("✅ 게시글이 성공적으로 수정되었습니다!");
      navigate(`/single/${willEditPostId}`);
    } catch (err) {
      console.error("❌ [handleSubmit] 수정 실패:", err);
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  /** 미리보기 이미지 */
  const mainImageUrl =
    selectedImageIndex !== null && imagePreviewUrls[selectedImageIndex]
      ? imagePreviewUrls[selectedImageIndex]
      : imgUpload;

  return (
    <div className="upload-whole-container">
      {/* 왼쪽: 이미지 업로드 영역 */}
      <div className="upload-left-container">
        <div className="main-image-display">
          <img
            src={mainImageUrl}
            alt="메인 이미지"
            className="uploaded-main-img"
          />
        </div>

        {/* 썸네일 */}
        <div className="thumbnail-upload-set">
          {Array.from({ length: MAX_IMAGES }).map((_, index) => (
            <div
              key={index}
              className={`thumbnail-slot ${
                imagePreviewUrls[index] ? "has-image" : "empty"
              } ${selectedImageIndex === index ? "selected" : ""}`}
              onClick={() => {
                if (imagePreviewUrls[index]) {
                  setSelectedImageIndex(index);
                }
              }}
            >
              {imagePreviewUrls[index] ? (
                <div className="thumbnail-wrapper">
                  <img
                    src={imagePreviewUrls[index]}
                    alt={`업로드 이미지 ${index + 1}`}
                    className="uploaded-thumbnail-img"
                  />
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(index);
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="empty-thumbnail-label">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                    disabled={postImage.length >= MAX_IMAGES}
                  />
                  <img
                    src={imgUpload}
                    alt="카메라"
                    className="upload-thumbnail-icon"
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: 입력 폼 */}
      <div className="upload-right-container">
        <div className="enter-title-set">
          <div className="enter-title">게시글 제목</div>
          <input
            className="enter-box"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="enter-title-set">
          <div className="enter-title">책 제목</div>
          <input
            className="enter-box"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
          />
        </div>

        <div className="enter-title-set">
          <div className="enter-title">책의 상태</div>
          <textarea
            className="enter-info-box"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="course-professor-container">
          <div className="enter-title-set">
            <div className="enter-title">교수명</div>
            <input
              className="enter-professor"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
            />
          </div>

          <div className="enter-title-set">
            <div className="enter-title">강의명</div>
            <input
              className="enter-box"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>
        </div>

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

        <div className="enter-title-set">
          <div className="enter-title">가격</div>
          <input
            placeholder="가격을 입력해주세요 (숫자만)"
            className="enter-box"
            type="number"
            value={postPrice}
            onChange={(e) => setPostPrice(e.target.value)}
          />
        </div>

        <button className="save-upload-button" onClick={handleSubmit}>
          수정하기
        </button>
      </div>
    </div>
  );
};

export default EditPost;
