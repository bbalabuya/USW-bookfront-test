import { SellingBook } from "../types/selling_bookType";

export const selling_bookExample: SellingBook[] = [
            {
                id: "1",
                title: "자료구조 책 팝니다",
                status: "판매완료",
                price : "20,000원",
                createdAt: "2025-07-01T12:34:56",
                postImage: "https://via.placeholder.com/150"
            },
            {
                id: "2",
                title: "운영체제 책 판매",
                status: "판매중",
                  price : "20,000원",
                createdAt: "2025-07-05T10:12:00",
                postImage: "https://via.placeholder.com/150"
            },
            {
                id: "3",
                title: "네트워크 기초",
                status: "판매중",
                  price : "20,000원",
                createdAt: "2025-07-08T15:45:00",
                postImage: "https://via.placeholder.com/150"
            }
        ];