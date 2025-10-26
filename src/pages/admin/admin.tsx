import React from "react";
import { Admin_header } from "./admin_header";
import { ReportList } from "./report_selector";
import "./admin.css"

export const Admin = () => {
  return (
    <div className="admin-whole-container">
      {/* 🔹 상단 헤더 */}
      <Admin_header />

      {/* 🔹 본문 (좌측 사이드바 + 우측 콘텐츠 영역) */}
      <div className="admin-middle-container">
        <div className="admin-selector">
          <ReportList />
        </div>
        <div className="admin-right-container">
          <h2>관리자 메인 콘텐츠</h2>
          <p>여기에 선택된 항목의 세부 내용이 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
};
