import api from "./index";

// 🔹 게시글 목록 조회 (params 있으면 쿼리 포함, 없으면 기본 요청)
export const fetchPosts = async (params?: Record<string, any>) => {
  try {
    const config = params
      ? {
          params,
          // ⚙️ key=value 형태로 인코딩 없이 직렬화
          paramsSerializer: (params: Record<string, any>) =>
            Object.entries(params)
              .map(([key, value]) => `${key}=${value}`)
              .join("&"),
        }
      : {}; // params 없으면 빈 설정으로

    const response = await api.get("/api/posts", config);
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