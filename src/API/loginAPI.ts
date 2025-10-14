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
    // ❌ 삭제: localStorage.setItem("accessToken", tokenValue); // 중복 호출 방지

    // ✅ setAccessToken만 호출하도록 통일 (index.ts에 정의된 함수 사용)
    setAccessToken(tokenValue);

    console.log(
      "🎉 [login] accessToken 저장 완료 (setAccessToken 호출):",
      tokenValue
    );

    // 💡 저장 확인을 위한 임시 콘솔 로그 추가 (테스트 후 삭제 가능)
    console.log(
      "🔍 [login] 저장 직후 확인:",
      localStorage.getItem("accessToken")
    );

    return res.data;
  } catch (err) {
    console.error("💥 [login] 로그인 실패:", err);
    throw err;
  }
};