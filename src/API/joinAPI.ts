import api from "./index";
import { JoinRequest } from "../types/join";


//처음 이메일 인증코드 요청
export const sendEmailVerification = async (email: string) => {
  return api.post("/api/mail/send-verification", { email });
};

//이메일 인증코드 검증
export const checkEmailVerification = async (
  email: string,
  authcode: string
) => {
  return api.post("/api/me/emails/verify", { email, authcode });
};

// 마지막 회원가입 버튼 누르면 가입
export const join = async (userInfo: JoinRequest, profileFile?: File) => {
  const formData = new FormData();
  formData.append(
    "requestDto",
    new Blob([JSON.stringify(userInfo)], { type: "application/json" })
  );

  if (profileFile) {
    formData.append("profileImage", profileFile);
  }

  return api.post("/api/me/join", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
