// src/pages/admin/reportList.tsx
import React from "react";
import { useEffect,useState } from "react";
import { reportListType } from "../../types/report";
import { getReportList } from "../../API/adminAPI";
import { mockReportList } from "../../mockData/report";

export const ReportList = () => {
   const [reports, setReports] = useState<reportListType[]>([]);
  
    useEffect(() => {
      const callReportList = async () => {
        try {
          const data = await getReportList();
          console.log("✅ 신고 목록 불러오기 성공:", data);
          setReports(data);
        } catch (err) {
          console.error("🚨 신고 목록 불러오기 실패:", err);
          setReports(mockReportList) // 임시데이터
        }
      };
      callReportList();
    }, []);


  return (
    <div className="report-list">
      <h3>신고 목록</h3>
      {reports.length === 0 ? (
        <p>신고 내역이 없습니다.</p>
      ) : (
        <ul>
          {reports.map((report, index) => (
            <li key={index}>
              <strong>신고자:</strong> {report.reporterName} <br />
              <strong>신고 유형:</strong> {report.type} <br />
              <strong>신고 대상 ID:</strong> {report.reportedThingId} <br />
              <strong>사유:</strong> {report.resason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
