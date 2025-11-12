import api from "./index";
import { reportListType } from "../types/report";

export const getReportList = async() =>{
    const response = await api.get("/api/admin/reports");
    console.log("신고목록 불러오기 성공", response.data);
    return response.data.data as reportListType[];
}