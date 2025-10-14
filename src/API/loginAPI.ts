import api, { setAccessToken } from "./index";

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/api/auth/login", { email, password });

    console.log("✅ [login] 로그인 응답:", res);

    // 🔹 Authorization 헤더에서 토큰 추출
    const accessTokenHeader =
      res.headers["authorization"] || res.headers["Authorization"];

    if (!accessTokenHeader) {
      console.error("❌ [login] Authorization 헤더 없음");
      throw new Error("토큰이 응답에 포함되지 않았습니다.");
    }

    // 🔹 Bearer 제거
    const tokenValue = accessTokenHeader.replace("Bearer ", "");

    // 🔹 localStorage & 메모리 저장
    localStorage.setItem("accessToken", tokenValue);
    setAccessToken(tokenValue); // ✅ 이게 중요합니다!

    console.log("🎉 [login] accessToken 저장 완료:", tokenValue);

    return res.data;
  } catch (err) {
    console.error("💥 [login] 로그인 실패:", err);
    throw err;
  }
};
