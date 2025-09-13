import api, { setAccessToken } from "./index";

export const login = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });

  // 응답 헤더에서 Authorization 꺼내기
  const accessToken = res.headers["authorization"];
  if (accessToken) {
    const tokenValue = accessToken.replace("Bearer ", "");
    localStorage.setItem("accessToken", tokenValue); // 앱 재시작/새로고침 시 사용
    setAccessToken(tokenValue); // Axios 인터셉터에서 사용
  }

  return res.data;
};
