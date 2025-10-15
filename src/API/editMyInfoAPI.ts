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
  // 1️⃣ 이미지 파일이 있으면 → multipart/form-data로 전송
  if (profileFile) {
    const formData = new FormData();

    formData.append(
      "changeInfoRequest",
      new Blob([JSON.stringify(userInfo)], { type: "application/json" })
    );

    formData.append("profileImage", profileFile);

    return api.post("/api/user/information", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // 2️⃣ 이미지 파일이 없으면 → JSON으로 전송
  return api.post("/api/user/information", userInfo, {
    headers: { "Content-Type": "application/json" },
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
