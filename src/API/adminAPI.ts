import api from "./index";
import { reportListType } from "../types/report";

export const getReportList = async (): Promise<reportListType[]> => {
  const response = await api.get("/api/admin/reports");
  const data = (response.data as any).data;
  console.log("📡 신고목록 불러오기 성공:", data);
  return data as reportListType[];
};
