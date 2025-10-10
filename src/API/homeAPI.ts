import api from "./index";

export const fetchPosts = async (params: {
  pageNumber?: number;
  grade?: number;
  semester?: number;
  status?: string;
  bookName?: string;
  className?: string;
  priceMin?: number;
  priceMax?: number;
}) => {
  try {
    const response = await api.get("/api/posts", {
      params: {
        pageNumber: params.pageNumber ?? 0,
        ...(params.grade ? { grade: params.grade } : {}),
        ...(params.semester ? { semester: params.semester } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.bookName ? { bookName: params.bookName } : {}),
        ...(params.className ? { className: params.className } : {}),
        ...(params.priceMin ? { priceMin: params.priceMin } : {}),
        ...(params.priceMax ? { priceMax: params.priceMax } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ [fetchPosts] 게시글 불러오기 실패:", error);
    throw error;
  }
};

// 로그인 확인
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
