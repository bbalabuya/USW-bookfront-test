import { Book } from "../types/homeType";

export const sampleBooks: Book[] = [
  {
    id: 1,
    postImage: "https://via.placeholder.com/150",
    title: "운영체제 책 팝니다",
    postPrice: 25000,
    status: "판매중",
    createdAt: "2025-06-30T12:00:00",
    heart: 10,
  },
  {
    id: 2,
    postImage: "https://via.placeholder.com/150",
    title: "자료구조 책 판매합니다",
    postPrice: 18000,
    status: "거래완료",
    createdAt: "2025-07-01T09:30:00",
    heart: 10,
  },
  {
    id: 3,
    postImage: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg",
    title: "컴퓨터 네트워크 책 있어요",
    postPrice: 22000,
    status: "판매중",
    createdAt: "2025-07-20T15:10:00",
    heart: 3,
  },
];
