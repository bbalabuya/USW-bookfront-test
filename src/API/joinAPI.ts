// API/joinAPI.ts
import api from "./index";
import { JoinRequest } from "../types/join";


// 전공 리스트 가져오기
export const getMajorList = async () => {
  const res = await api.get("/api/major/list");
  // data 배열에서 name과 id를 그대로 반환
  return res.data.data.map((m: { id: string; name: string }) => ({
    id: m.id,
    name: m.name,
  }));
};


// 이메일 인증코드 요청
export const sendEmailVerification = async (
  email: string,
  profileFile?: File
) => {
  return api.post("/api/mail/send-verification", { email });
};

// 이메일 인증코드 검증
export const checkEmailVerification = async (
  email: string,
  authCode: string
) => {
  return api.post("/api/mail/verify", { email, authCode });
};

// 회원가입 (이미지 업로드 처리 없이 JSON 전송)
export const join = async (userInfo: JoinRequest) => {
  return api.post("/api/auth/signup", userInfo, {
    headers: { "Content-Type": "application/json" },
  });
};

/* 
// ✅ 나중에 서버에서 이미지 업로드 구현이 되면 이 코드로 교체
export const join = async (userInfo: JoinRequest, profileFile?: File) => {
  const formData = new FormData();
  formData.append(
    "requestDto",
    new Blob([JSON.stringify(userInfo)], { type: "application/json" })
  );

  if (profileFile) {
    formData.append("profileImage", profileFile);
  }

  return api.post("/api/auth/signup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
*/

// 전공 리스트 가져오기
// (서버 준비 안 되어 있음)
/*
export const getMajorList = async () => {
  const res = await api.get("/api/major/list");
  // data 배열에서 name만 뽑아서 반환
  return res.data.data.map((m: { name: string }) => m.name);
}; 
*/
