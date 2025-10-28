import React, { useEffect, useState } from "react";
import { Admin_header } from "./admin_header";
import { ReportList } from "./report_selector";
import { AdminChatViewer } from "./admin_chat";
import "./admin.css";
import { AdminPostViewer } from "./admin_post";
export const Admin = () => {
  const [selectedType, setSelectedType] = useState<string>("none");
  const [selectedThingId, setSelectedThingId] = useState<string | null>(null); // ✅ 통합 ID 변수

  useEffect(() => {
    console.log("🛠️ 선택된 신고 유형:", selectedType);
    console.log("🛠️ 선택된 대상 ID:", selectedThingId);
  }, [selectedType, selectedThingId]);

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
              <AdminPostViewer postId={selectedThingId} />
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
