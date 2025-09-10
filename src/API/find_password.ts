import api from "./index";
import {
  SendCodeRequest,
  SendCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/find_password";

// 1. 이메일 인증코드 발송
export const sendVerificationCode = async (
  data: SendCodeRequest
): Promise<SendCodeResponse> => {
  const res = await api.post("/api/mail/send-verification", data);
  return { status: res.status, message: res.data?.message };
};

// 2. 인증코드 확인
export const verifyEmailCode = async (
  data: VerifyCodeRequest
): Promise<VerifyCodeResponse> => {
  const res = await api.post("/api/emails/verify", data);
  return {
    status: res.status,
    verified: res.data?.verified ?? false,
    message: res.data?.message,
  };
};

// 3. 비밀번호 초기화
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const res = await api.post("/api/me/auth/reset-password", data);
  return { status: res.status, message: res.data?.message };
};
