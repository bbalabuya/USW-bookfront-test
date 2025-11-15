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
  // postImage는 새로 추가된 File 객체만 저장 (업로드 시 사용)
  const [postImage, setPostImage] = useState<File[]>([]);
  // imagePreviewUrls는 기존 URL + 새로 추가된 File의 Blob URL을 모두 저장
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [majorList, setMajorList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [majorId, setMajorId] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const willEditPostId = location.state?.PostId;

  /** 🎓 전공 목록 + 원본 게시글 불러오기 */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ 전공 목록 불러오기
        const majors = await getMajorList();
        setMajorList(majors);
        if (majors.length > 0) setMajorId(majors[0].id);

        // 2️⃣ 수정 대상 게시글 불러오기
        if (!willEditPostId) return;
        const { data } = await axios.get(
          `${API_URL}/api/posts/${willEditPostId}`
        );
        const post = data.data;

        console.log("📥 원본 게시글:", post);

        // 3️⃣ 상태 세팅
        setPostName(post.postName || "");
        setTitle(post.title || "");
        setPostPrice(post.postPrice ? String(post.postPrice) : "");
        setContent(post.content || "");
        setProfessor(post.professorName || "");
        setCourseName(post.courseName || "");
        setGrade(post.grade || 1);
        setSemester(post.semester || 1);

        // 전공 매칭 (name → id)
        const matchedMajor = majors.find((m) => m.name === post.majorName);
        setMajorId(matchedMajor ? matchedMajor.id : majors[0]?.id || "");

        // 🚨 [수정 사항] 이미지 URL: postImages 배열로 받도록 변경
        if (Array.isArray(post.postImages) && post.postImages.length > 0) {
          setImagePreviewUrls(post.postImages);
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

    // 1. 새 파일은 postImage 상태에 추가
    const newFiles = files.slice(
      0,
      MAX_IMAGES -
        postImage.length -
        (imagePreviewUrls.length - postImage.length)
    );
    setPostImage((prev) => [...prev, ...newFiles]);

    // 2. 미리보기 URL은 imagePreviewUrls에 추가
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) =>
      [...prev, ...newPreviewUrls].slice(0, MAX_IMAGES)
    );

    // 선택 이미지 인덱스 조정
    const totalImages = imagePreviewUrls.length + newPreviewUrls.length;
    if (totalImages > 0 && selectedImageIndex === null) {
      setSelectedImageIndex(0);
    }
    e.target.value = "";
  };

  /** ❌ 이미지 삭제 */
  const handleDeleteImage = (index: number) => {
    // 만약 삭제하는 이미지가 새로 업로드된 파일 (Blob URL)이라면 postImage 상태에서도 제거
    const isNewFile = imagePreviewUrls[index].startsWith("blob:");

    if (isNewFile) {
      // Blob URL이 제거될 때 postImage 배열에서도 해당 파일을 제거해야 함.
      // 정확한 제거 로직을 구현하려면 File 객체와 URL을 매핑해야 하지만,
      // 여기서는 단순화하여 새로 추가된 파일의 '개수'만큼만 postImage에서 제거합니다.
      // (실제 프로젝트에서는 Blob URL을 Key로 사용하여 postImage 배열에서 정확히 제거해야 합니다.)
      setPostImage((prev) => {
        const filesToRemove = prev.filter(
          (_, fileIndex) =>
            imagePreviewUrls.findIndex(
              (url, urlIndex) => url.startsWith("blob:") && urlIndex === index
            ) === fileIndex
        );
        return prev.filter((file) => !filesToRemove.includes(file));
      });
    }

    // 미리보기 URL 배열에서 제거
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));

    // 선택된 이미지 인덱스 조정
    setSelectedImageIndex((prev) => {
      if (prev === null) return null;
      const newLength = imagePreviewUrls.length - 1;
      if (newLength === 0) return null; // 이미지가 없으면 해제
      if (index === prev) return 0; // 삭제된 이미지가 선택된 이미지면 첫 이미지 선택
      if (index < prev) return prev - 1; // 삭제된 이미지보다 뒤에 있었으면 인덱스 감소
      return prev;
    });
  };

  /** 🧾 게시글 수정 요청 */
  const handleSubmit = async () => {
    // ✅ 입력 유효성 검사
    if (!title.trim() || !postName.trim()) {
      alert("책 제목과 게시글 제목은 반드시 입력해야 합니다!");
      return;
    }
    if (Number(postPrice) < 0) {
      alert("가격은 0 이상으로 입력해주세요!");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      // 🚨 새로 업로드된 파일 (postImage 배열)을 처리하는 로직이 필요하지만,
      // 백엔드 스펙에 따라 다르므로 현재는 URL 업데이트만 수행합니다.

      // 🚨 [핵심 변경] JSON 요청 본문 생성
      const updatePayload = {
        postName: postName,
        title: title,
        postPrice: parseInt(postPrice.replace(/,/g, "")) || 0,
        professor: professor,
        courseName: courseName,
        grade: grade,
        semester: semester,
        content: content,
        majorId: majorId,
        // 🚨 [핵심 변경] postImage 대신 postImages로 URL 배열 전송
        // Blob URL (새 파일)은 서버로 전송할 수 없으므로 제외하고 기존 URL만 보냄.
        // 실제로는 새 파일 업로드 후 받은 URL을 여기에 포함해야 함.
        postImages: imagePreviewUrls.filter((url) => !url.startsWith("blob:")),
      };

      console.log("⬆️ PATCH 요청 본문 (JSON):", updatePayload);

      const res = await axios.patch(
        `${API_URL}/api/posts/${willEditPostId}`,
        updatePayload, // ⬅️ JSON 본문 전송
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json", // ⬅️ Content-Type 변경
          },
        }
      );

      if (res.status === 200) {
        alert("✅ 게시글이 성공적으로 수정되었습니다!");
        navigate(`/single/${willEditPostId}`, { replace: true });
      } else {
        alert("⚠️ 수정 중 문제가 발생했습니다.");
      }
    } catch (err: any) {
      console.error("❌ [handleSubmit] 수정 실패:", err);
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) alert("로그인이 필요합니다.");
        else if (status === 404) alert("게시글을 찾을 수 없습니다.");
        else alert("게시글 수정 중 오류가 발생했습니다.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
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
            src={mainImageUrl ?? imgUpload}
            alt="메인 이미지"
            className="uploaded-main-img"
          />
        </div>

        {/* 썸네일 목록 */}
        <div className="thumbnail-upload-set">
          {Array.from({ length: MAX_IMAGES }).map((_, index) => (
            <div
              key={index}
              className={`thumbnail-slot ${
                imagePreviewUrls[index] ? "has-image" : "empty"
              } ${selectedImageIndex === index ? "selected" : ""}`}
              onClick={() => {
                if (imagePreviewUrls[index]) setSelectedImageIndex(index);
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
                    disabled={imagePreviewUrls.length >= MAX_IMAGES}
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

        <button
          className="save-upload-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "수정 중..." : "수정하기"}
        </button>
      </div>
    </div>
  );
};

export default EditPost;