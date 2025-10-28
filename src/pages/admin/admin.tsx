import React, { useState } from "react";
import { Admin_header } from "./admin_header";
import { ReportList } from "./report_selector";
import { AdminChatViewer } from "./admin_chat";
import "./admin.css"


export const Admin = () => {
  const [selectedType, setSelectedType] = useState<string>("none");
  const [selectedThingId, setSelectedThingId] = useState<string | null>(null); // ✅ 통합 ID 변수

  // ✅ ReportList에서 클릭 시 호출되는 콜백
  const handleSelectType = (type: string, thingId: string) => {
    setSelectedType(type);
    setSelectedThingId(thingId);
  };

  return (
    <div className="admin-whole-container">
      <Admin_header />

      <div className="admin-middle-container">
        <div className="admin-selector">
          {/* ✅ thingId까지 전달 */}
          <ReportList onSelectType={handleSelectType} />
        </div>

        <div className="admin-right-container">
          {selectedType === "chat" && selectedThingId && (
            <AdminChatViewer roomId={selectedThingId} />
          )}

          {selectedType === "post" && selectedThingId && (
            <>
              <h2>게시글 신고 내역</h2>
              <p>게시글 ID: {selectedThingId}</p>
              <p>게시글 신고 관련 세부 정보를 표시합니다.</p>
            </>
          )}

          {selectedType === "none" && (
            <p>왼쪽에서 신고 내역을 클릭하면 상세 내용을 볼 수 있습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};
