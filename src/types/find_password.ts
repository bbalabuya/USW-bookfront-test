// 이메일 인증코드 발송 요청
export interface SendCodeRequest {
  email: string;
}

// 이메일 인증코드 발송 응답
export interface SendCodeResponse {
  status: number;
  message?: string;
}

// 인증코드 확인 요청
export interface VerifyCodeRequest {
  email: string;
  code: string;
}

// 인증코드 확인 응답
export interface VerifyCodeResponse {
  status: number;
  verified: boolean;
  message?: string;
}

// 비밀번호 초기화 요청
export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

// 비밀번호 초기화 응답
export interface ResetPasswordResponse {
  status: number;
  message?: string;
}
