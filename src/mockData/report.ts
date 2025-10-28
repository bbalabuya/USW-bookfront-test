// src/mockData/mockReportList.ts
import { reportListType } from "../types/report";

export const mockReportList: reportListType[] = [
  {
    resason: "부적절한 언어 사용",
    type: "chat",
    reporterName: "홍길동",
    reportedThingId: "comment_1024",
  },
  {
    resason: "허위 매물 게시",
    type: "post",
    reporterName: "이영희",
    reportedThingId: "post_553",
  },
  {
    resason: "도배성 메시지 전송",
    type: "chat",
    reporterName: "박준호",
    reportedThingId: "chat_331",
  },
  {
    resason: "타인 명의 도용",
    type: "post",
    reporterName: "김민지",
    reportedThingId: "user_204",
  },
];
