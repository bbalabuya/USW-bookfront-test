// src/components/admin/report_selector.tsx
import React, { useEffect, useState } from "react";
import { reportListType } from "../../types/report";
import { getReportList } from "../../API/adminAPI";
import { mockReportList } from "../../mockData/report";

interface ReportListProps {
  onSelectType: (type: string, thingId: string) => void; // ✅ 콜백 타입 수정
}

export const ReportList = ({ onSelectType }: ReportListProps) => {
  const [reports, setReports] = useState<reportListType[]>([]);

  useEffect(() => {
    const callReportList = async () => {
      try {
        const data = await getReportList();
        console.log("✅ 신고 목록 불러오기 성공:", data);
        setReports(data);
      } catch (err) {
        console.error("🚨 신고 목록 불러오기 실패:", err);
        setReports(mockReportList); // 임시 데이터
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
            <li
              key={index}
              className="report-item"
              onClick={() => onSelectType(report.type, report.reportedThingId)} // ✅ type + ID 함께 전달
            >
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
