import api, { setAccessToken } from "./index";

export const login = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });

  // 응답 헤더에서 Authorization 꺼내기
  console.log("응답", res);
  const accessToken = res.headers["authorization"];
  console.log("정상적으로 토큰 받아옴");
  if (accessToken) {
    const tokenValue = accessToken.replace("Bearer ", "");
    localStorage.setItem("accessToken", tokenValue);
    console.log("accessToken 로컬스토리지에 저장 완료");
  }


  return res.data;
};
