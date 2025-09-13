import api from "./index";

export const login = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });

  // 응답 헤더에서 Authorization 꺼내기
  console.log(res);
  const accessToken = res.headers["authorization"];
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken.replace("Bearer ", ""));
    console.log("Access Token 저장 완료" + accessToken);
  }

  return res.data;
};
