import {likeBook} from "../types/likeType";

export const likeSampleData: likeBook[] = [
  {
    id: "1",
    postTitle: "운영체제 책 구매",
    sellerName: "김철수",
    postImage: "https://via.placeholder.com/200x280.png?text=Book+1",
    createdAt: "2025-06-30T09:00:00",
    price: 12000,
    status: "거래완료",
    likeCount: 5,
  },
  {
    id: "2",
    postTitle: "자료구조 책 구매",
    sellerName: "박영희",
    postImage: "https://via.placeholder.com/200x280.png?text=Book+2",
    createdAt: "2025-07-01T12:00:00",
    price: 15000,
    status: "판매중",
    likeCount: 8,
  },
];