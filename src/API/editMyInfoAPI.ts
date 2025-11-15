// 📁 src/API/editMyInfoAPI.ts
import api from "./index";

// ✅ 내 정보 불러오기
export const getMyInfo = async () => {
  try {
    const response = await api.get("/api/user/information");
    console.log("유저 정보 불러오기 성공");
    return response.data.data;
  } catch (err) {
    console.error("유저 정보 불러오기 실패", err);
    throw err; // 에러를 호출자에게 다시 던져서 처리하도록 함
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

// ✅ 프로필 이미지 URL 적용 (프로필 정보를 해당 URL로 업데이트)
export const updateProfileImage = async (url: string) => {
  const res = await api.patch(
    "/api/user/profile-image-url",
    { profileImageUrl: url },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// ✅ 이미지 파일 업로드 (파일을 서버에 올리고, 임시/저장 URL 리턴)
// 컴포넌트에서 이 함수를 먼저 호출하여 URL을 받아야 합니다.
export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  // API 문서의 엔드포인트와 일치하도록 /api/files/image 를 사용하도록 가정하거나
  // 기존 코드에 맞춰 /api/upload/profile 을 사용합니다. (여기서는 기존 코드 사용)
  const res = await api.post("/api/upload/profile", formData, { 
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  // 응답 데이터 구조에 따라 URL을 정확히 추출해야 합니다.
  // API 문서에서 "url" 필드가 data 객체 안에 있다고 가정합니다.
  return res.data.data.url; 
};

// ✅ 전공 리스트 가져오기
export const getMajorList = async () => {
  const res = await api.get("/api/major/list");
  return res.data.data.map((m: { id: string; name: string }) => ({
    id: m.id,
    name: m.name,
  }));
};