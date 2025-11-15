// 📁 src/API/userAPI.ts
import api from "./index";

// ✅ 내 정보 불러오기
export const getMyInfo = async () => {
  try {
    const response = await api.get("/api/user/information");
    console.log("유저 정보 불러오기 성공");
    return response.data.data;
  } catch (err) {
    console.error("유저 정보 불러오기 실패", err);
  }
};

// ✅ 회원 정보 수정 (name, majorId, grade, semester)
export const updateMyInfo = async (userInfo: {
  name: string;
  majorId: string;
  grade: number;
  semester: number;
}) => {
  const res = await api.patch("/api/user/information", userInfo, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
};

// ✅ 프로필 이미지 URL 적용
export const updateProfileImage = async (url: string) => {
  const res = await api.patch(
    "/api/user/profile-image-url",
    { profileImageUrl: url },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// ✅ 이미지 파일 업로드 (임시 URL 발급)
export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/api/upload/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data.url; // 업로드 후 URL 리턴
};

// ✅ 전공 리스트 가져오기
export const getMajorList = async () => {
  const res = await api.get("/api/major/list");
  return res.data.data.map((m: { id: string; name: string }) => ({
    id: m.id,
    name: m.name,
  }));
};
