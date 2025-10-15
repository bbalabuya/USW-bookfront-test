import api from "./index";
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/find_password";

// ✅ 1. 이메일 인증코드 요청
export const sendEmailVerification = async (email: string) => {
  try {
    console.log("📩 인증코드 요청 시작:", email);
    const res = await api.post(`/api/mail/email-verifications`, {
      email,
      purpose: "PASSWORD_RESET", // 🔥 비밀번호 재설정 목적
    });

    if (res.status === 202) {
      console.log("✅ 이메일 인증코드 발송 요청 성공");
      return true;
    } else {
      console.warn("⚠️ 이메일 인증코드 발송 요청 실패:", res.status);
      return false;
    }
  } catch (err) {
    console.error("❌ 이메일 인증코드 요청 실패:", err);
    return false;
  }
};

// ✅ 2. 이메일 인증코드 검증
export const checkEmailVerification = async (
  email: string,
  authCode: string
) => {
  try {
    const res = await api.get(
      `/api/mail/email-verifications?email=${email}&authCode=${authCode}&purpose=PASSWORD_RESET`
    );
    console.log("✅ 이메일 인증코드 검증 성공:", res.status);
    return true;
  } catch (err: any) {
    console.error("❌ 이메일 인증코드 검증 실패:", err);
    return false;
  }
};

// ✅ 3. 비밀번호 초기화
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    const res = await api.patch("/api/auth/password", data);
    return { status: res.status, message: res.data?.message };
  } catch (err: any) {
    console.error("❌ 비밀번호 초기화 실패:", err);
    throw err;
  }
};
