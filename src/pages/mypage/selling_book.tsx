import React, { useEffect, useState } from "react";
import Selecter from "./selecter";
import "./selling_book.css";
import axios from "axios";
import heartImg from "../../assets/hearts.png";
import { Link } from "react-router-dom";

const URL = (import.meta as any).env.VITE_DOMAIN_URL;

type SellingBook = {
    id: string; // UUID
    title: string;
    status: string; // "판매완료", "판매중" 등
    price : string;
    createdAt: string;
    postImage: string;
};

// 날짜 포맷 변환 함수 (2025-07-01 → 2025.07.01)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

const Selling_book = () => {
    const [sellingBook, setSellingBook] = useState<SellingBook[]>([]);

    useEffect(() => {
        // 실제 API 호출 (현재는 주석 처리)
        /*
        axios
            .get(`${URL}/api/me/posts/sell`)
            .then((res) => {
                if (Array.isArray(res.data?.data)) {
                    setSellingBook(res.data.data);
                } else {
                    console.warn("응답 형식이 배열이 아님:", res.data);
                    setSellingBook([]);
                }
            })
            .catch((err) => {
                console.error("판매 책 목록 조회 실패:", err);
                setSellingBook([]); 
            });
        */

        // 임시 예시 데이터 (UI 테스트용)
        const mockData: SellingBook[] = [
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

        setSellingBook(mockData);
    }, []);

    return (
        <div className="selling-whole-container">
            <div className="selling-left-container">
                <Selecter />
            </div>

            <div className="selling-right-container">
                <div className="sell-container">
                    {sellingBook.map((book) => (
                        <div className="sell-plate" key={book.id}>
                            <img
                                className="sell-picture"
                                src={book.postImage}
                                alt={book.title}
                            />
                            <div className="middle-set">
                                <div className="middle-upper-set">
                                    <div className="title-set">
                                        <div className="book-title">{book.title}</div>
                                        <div className="sell-book-status">{book.status}</div>
                                        <div className="book-price">{book.price}</div>
                                        <div className="upload-date">
                                            {formatDate(book.createdAt)}
                                    </div>
                                    </div>
                                    <div className="like-set">
                                        <img
                                            className="heart-img"
                                            src={heartImg}
                                            alt="하트 이미지"
                                        />
                                        <div className="book-heart">찜 개수</div>
                                    </div>
                                </div>
                                <div className="middle-down-set">
                                    <div className="book-explain">여기는 설명칸</div>
                                </div>
                            </div>
                            <div className="plate-button-set">
                                <Link to={`/single/${book.id}`} className="sell-button">게시글로 이동하기</Link>
                                <button className="sell-button">글 수정하기</button>
                                <button className="sell-button">글 삭제하기</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Selling_book;
