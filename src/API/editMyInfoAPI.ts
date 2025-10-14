// 📁 src/API/userAPI.ts
import api from "./index";

// ✅ 내 정보 불러오기
export const getMyInfo = async () => {
  try {
    const response = await api.get("/api/user/infomation");
    console.log("유저 정보 불러오기 성공");
    return response.data.data;
  } catch (err) {
    console.error("유저 정보 불러오기 실패", err);
  }
};

// ✅ 내 정보 수정 (프로필 이미지 + 정보)
export const updateMyInfo = async (
  userInfo: any,
  profileFile: File | null,
  profileImage: string
) => {
  const formData = new FormData();

  // JSON을 Blob으로 변환하여 추가
  formData.append(
    "changeInfoRequest",
    new Blob([JSON.stringify(userInfo)], { type: "application/json" })
  );

  // 프로필 이미지 파일이 있으면 새 파일, 없으면 기존 URL
  if (profileFile) {
    formData.append("profileImage", profileFile);
  } else {
    formData.append("profileImage", profileImage);
  }

  return api.post("/api/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✅ 전공 리스트 가져오기
export const getMajorList = async () => {
  const res = await api.get("/api/major/list");
  return res.data.data.map((m: { id: string; name: string }) => ({
    id: m.id,
    name: m.name,
  }));
};
