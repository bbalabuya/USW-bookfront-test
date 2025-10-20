import api from "./index";

/**
 * 🔹 게시글 목록 조회 (자동 인코딩)
 * @param params - 검색 및 필터 조건 (없으면 전체 조회)
 */
export const fetchPosts = async (params?: Record<string, any>) => {
  try {
    console.log("📡 [fetchPosts] 요청 파라미터 →", params);

    // ✅ Axios가 자동으로 쿼리스트링 인코딩 처리함
    const response = await api.get("/api/posts", { params });

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