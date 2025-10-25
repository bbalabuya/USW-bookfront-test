import React, { useEffect, useState } from "react";
import { Admin_header } from "./admin_header";
import { ReportList } from "./reportList";
import { getReportList } from "../../API/adminAPI";
import { reportListType } from "../../types/report";

export const Admin = () => {
  const [reports, setReports] = useState<reportListType[]>([]);

  useEffect(() => {
    const callReportList = async () => {
      try {
        const data = await getReportList();
        setReports(data);
      } catch (err) {
        console.error("🚨 신고 목록 불러오기 실패:", err);
      }
    };
    callReportList();
  }, []);

  return (
    <div className="admin-container">
      <Admin_header />
      <div className="admin-content-container">
        <h2>관리자 전용 페이지</h2>
        <ReportList  />
      </div>
    </div>
  );
};
