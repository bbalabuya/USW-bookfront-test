// src/components/Login.tsx (가정)
import api, { setAccessToken } from "./index";

export const login = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });

  // 응답 헤더에서 Authorization 꺼내기
  console.log(res);
  const accessToken = res.headers["authorization"];
  if (accessToken) {
    const tokenValue = accessToken.replace("Bearer ", "");

    // 1. localStorage에 저장 (앱 재시작/새로고침 시 사용)
    localStorage.setItem("accessToken", tokenValue);

    // 2. Axios 인터셉터가 사용할 전역 변수도 업데이트
    setAccessToken(tokenValue);

    console.log("Access Token 저장 및 설정 완료: " + accessToken);
  }

  return res.data;
};
