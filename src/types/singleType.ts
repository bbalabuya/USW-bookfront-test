export interface Book {
  id: string; // 게시글 고유 ID
  title: string; // 게시글 제목
  content: string; // 게시글 내용
  postPrice: number; // 가격
  postImage: string; // 이미지 URL
  postName: string; // 게시글 이름 (중복 필드지만 서버에서 내려주므로 포함)
  PostStatus: string; // 판매 상태 (예: 판매중, 거래완료 등)
  likeCount: number; // 좋아요 수
  courseName: string; // 과목명
  majorName: string; // 학과명
  professorName: string; // 교수명
  sellerId: string; // 판매자 ID
  sellerName: string; // 판매자 이름
  createdAt: string; // 작성일
  comments: any[]; // 댓글 배열 (현재는 빈 배열)
  seller: string;

  profileImage: string;
  name: string;
  staus: string;
}

// src/types/api.ts
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}
