import React, { useState } from "react";
import { Admin_header } from "./admin_header";
import { ReportList } from "./report_selector";
import "./admin.css";

export const Admin = () => {
  const [selectedType, setSelectedType] = useState<string>("none");

  // 🔹 ReportList에서 클릭 시 호출되는 콜백
  const handleSelectType = (type: string) => {
    setSelectedType(type);
  };

  // 해야 할 일 클릭하면 하기부터 불러와서 적용시키기 까지
  return (
    <div className="admin-whole-container">
      {/* 🔹 상단 헤더 */}
      <Admin_header />

      {/* 🔹 본문 */}
      <div className="admin-middle-container">
        <div className="admin-selector">
          {/* ReportList에 콜백 전달 */}
          <ReportList onSelectType={handleSelectType} />
        </div>

        <div className="admin-right-container">
          {selectedType === "chat" && (
            <>
              <h2>채팅 신고 내역</h2>
              <p>채팅 신고 관련 세부 정보를 표시합니다.</p>
            </>
          )}
          {selectedType === "post" && (
            <>
              <h2>게시글 신고 내역</h2>
              <p>게시글 신고 관련 세부 정보를 표시합니다.</p>
            </>
          )}
          {selectedType === "none" && (
            <>
              <p>접수된 신고를 클릭하세요</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
