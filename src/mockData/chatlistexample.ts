import { ChatRoom } from "../types/chatlist";

export const sampleChatList: ChatRoom[] = [
    {
      roomId: "room-001",
      postId: "post-001",
      name: "홍길동",
      userCount: 2,
      lastMessage: "네, 내일 거래 가능해요!",
      lastMessageTime: "2025-08-14T09:30:00",
      img: "https://via.placeholder.com/50", // 임시 프로필 이미지
      name2: "중고 노트북 판매"
    },
    {
      roomId: "room-002",
      postId: "post-002",
      name: "김영희",
      userCount: 3,
      lastMessage: "감사합니다!",
      lastMessageTime: "2025-08-13T15:45:00",
      img: "https://via.placeholder.com/50",
      name2: "아이폰 15 미개봉"
    },
    {
      roomId: "room-003",
      postId: "post-003",
      name: "이철수",
      userCount: 2,
      lastMessage: "혹시 가격 네고 가능할까요?",
      lastMessageTime: "2025-08-12T20:10:00",
      img: "https://via.placeholder.com/50",
      name2: "게이밍 마우스 팝니다"
    }
  ];