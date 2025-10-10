import api from "./index";

// 🔹 게시글 목록 조회 (인코딩 없이 순수 URL 쿼리 형태로 요청)
export const fetchPosts = async (params: any) => {
  try {
    const response = await api.get("/api/posts", {
      params,
      // ⚙️ 인코딩 없이 key=value 형태로 직접 직렬화
      paramsSerializer: (params) => {
        return Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");
      },
    });

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