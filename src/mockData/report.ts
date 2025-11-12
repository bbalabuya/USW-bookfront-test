// src/mockData/mockReportList.ts
import { reportListType } from "../types/report";

export const mockReportList: reportListType[] = [
  {
    reason: "부적절한 언어 사용",
    type: "chat",
    reporterName: "홍길동",
    reportedThingId: "comment_1024",
    seller: "hello",
  },
  {
    reason: "허위 매물 게시",
    type: "post",
    reporterName: "이영희",
    reportedThingId: "post_553",
    seller: "hello",
  },
  {
    reason: "도배성 메시지 전송",
    type: "chat",
    reporterName: "박준호",
    reportedThingId: "chat_331",
    seller: "hello",
  },
  {
    reason: "타인 명의 도용",
    type: "post",
    reporterName: "김민지",
    reportedThingId: "user_204",
    seller: "hello",
  },
];

import { AdminBook } from "../types/report";

export const mockAdminBook: AdminBook = {
  postId: "post123",
  title: "모던 자바스크립트 Deep Dive",
  content:
    "이 책은 자바스크립트의 기본 개념부터 최신 문법까지 자세히 설명한 명저입니다. ES6 이후 문법을 심도 있게 다루고 있어 프론트엔드 개발자에게 큰 도움이 됩니다.",
  postImage: "https://image.yes24.com/goods/92742567/XL",
  postPrice: 29000,
  likeCount: 42,
  status: "판매중",
  createdAt: "2025-11-10T14:20:00Z",
  seller: {
    id: "seller_001",
    name: "강재훈",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
  },
};