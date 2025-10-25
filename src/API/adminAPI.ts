import api from "./index";
import { reportListType } from "../types/report";

export const getReportList = async() =>{
    const response = await api.get("/api/admin/reports");
    return response.data as reportListType[];
}