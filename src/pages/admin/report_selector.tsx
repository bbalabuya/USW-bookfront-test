// src/components/admin/report_selector.tsx
import React, { useEffect, useState } from "react";
import { getReportList } from "../../API/adminAPI";
import { mockReportList } from "../../mockData/report";
import "./report_selector.css";

export const ReportList = ({ onSelectType }) => {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const callReportList = async () => {
      try {
        const res = await getReportList();
        setReports(res);
      } catch (err) {
        console.error("🚨 신고 목록 불러오기 실패:", err);
        setReports(mockReportList);
      }
    };
    callReportList();
  }, []);

  return (
    <div className="report-list">
      <h3 style={{ padding: "0 10px" }}>신고 목록</h3>
      {reports.length === 0 ? (
        <p>신고 내역이 없습니다.</p>
      ) : (
        <div className="report-items">
          {reports.map((report, index) => (
            <div
              key={index}
              className="report-item"
              onClick={() => {
                console.log("🖱️ 클릭한 신고 항목:", report);
                onSelectType(report.type, report.reportedThingId);
              }}
            >
              <strong>신고자:</strong> {report.reporterName} <br />
              <strong>신고 유형:</strong> {report.type} <br />
              <strong>신고 대상 ID:</strong> {report.reportedThingId} <br />
              <strong>사유:</strong> {report.reason}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
