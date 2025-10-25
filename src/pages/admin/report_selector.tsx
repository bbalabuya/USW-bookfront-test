// src/pages/admin/reportList.tsx
import React from "react";
import { reportListType } from "../../types/report";

interface ReportListProps {
  reports: reportListType[];
}

export const ReportList: React.FC<ReportListProps> = ({ reports }) => {
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
