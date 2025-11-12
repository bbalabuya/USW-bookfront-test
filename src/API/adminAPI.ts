// src/API/adminAPI.ts
import api from "./index";

export const getReportList = async () => {
  const response = await api.get("/api/admin/reports");
  console.log("📡 신고목록 불러오기 성공:", response.data);
  return response.data.data; // 타입 단언 제거
};
