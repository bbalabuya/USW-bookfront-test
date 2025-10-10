import api from "./index";

export const fetchPosts = async (params?: {
  page?: number;
  size?: number;
  sort?: string;
  grade?: number;
  status?: string;
  bookName?: string;
  className?: string;
}) => {
  try {
    const response = await api.get("/api/posts", {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 8,
        sort: params?.sort ?? "createdAt,desc",
        ...(params?.grade ? { grade: params.grade } : {}),
        ...(params?.status ? { status: params.status } : {}),
        ...(params?.bookName ? { bookName: params.bookName } : {}),
        ...(params?.className ? { className: params.className } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ [fetchPosts] 게시글 불러오기 실패:", error);
    throw error;
  }
};

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