import api from "./index";

/**
 * 🔹 게시글 목록 조회
 * @param params - 검색 및 필터 조건 (없으면 전체 조회)
 */
export const fetchPosts = async (params?: Record<string, any>) => {
  try {
    // 기본 경로
    let url = "/api/posts";

    // ✅ params가 존재하면 수동으로 쿼리스트링 생성 (인코딩 안 함)
    if (params && Object.keys(params).length > 0) {
      const query = Object.entries(params)
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      url += `?${query}`;
    }

    // ✅ 실제 요청 경로 콘솔 출력 (디버깅용)
    console.log("📡 [fetchPosts] 요청 URL →", url);

    // ✅ 완성된 URL로 직접 요청
    const response = await api.get(url);

    console.log("✅ [fetchPosts] 게시물 호출 결과:", response.data);
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