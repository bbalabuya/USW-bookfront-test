import api from "./index";
import { JoinRequest } from "../types/join";

export const sendEmailVerification = async (email: string) => {
  return api.post("/api/mail/send-verification", { email });
};

export const checkEmailVerification = async (
  email: string,
  authcode: string
) => {
  return api.post("/api/me/emails/verify", { email, authcode });
};

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
