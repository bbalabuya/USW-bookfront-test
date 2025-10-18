import api from "./index";

// 🔹 게시글 목록 조회 (params 있으면 쿼리 포함, 없으면 기본 요청)
export const fetchPosts = async (params?: Record<string, any>) => {
  try {
    let url = "/api/posts";

    if (params) {
      // 직접 key=value 조합 (인코딩 안 함)
      const query = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      url += `?${query}`;
    }

    console.log("요청 URL :", url); // ✅ 실제 요청 경로 확인용
    const response = await api.get(url); // params 말고 완성된 URL로 요청
    console.log("게시물 호출 결과 :", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [fetchPosts] 게시글 불러오기 실패:", error);
    throw error;
  }
};




/*
// 로그인 상태 확인
export const loginCheck = async () => {
  try {
    const response = await api.get("/api/auth/reissue", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ [loginCheck] 로그인 상태 확인 실패:", error);
    throw error;
  }
};
*/