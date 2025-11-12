// src/API/adminAPI.ts
import api from "./index";

export const getReportList = async () => {
  const response = await api.get("/api/admin/reports");
  console.log("📡 신고목록 불러오기 성공:", response.data);
  return response.data.data; // 타입 단언 제거
};


export const deletePost = async (postId: string) => {
    console.log("postId:", postId);
  const response = await api.delete("/api/admin/posts", {
    data: { postId },
  });
  console.log("📡 관리자 게시글 삭제 성공:", response.data);
  return response.data;
};

export const userBan = async (sellerId) => {
  const response = await api.post("api/admin/ban", {
    userName: sellerId,
  });
  console.log("유저 밴 성공", response.data);
  return response.data;
};