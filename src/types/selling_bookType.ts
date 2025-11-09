export interface SellingBook {
  id: string; // UUID
  postTitle: string;
  status: string; // "판매완료", "판매중" 등
  price: string;
  createdAt: string;
  postImage: string;
  likeCount: number;
  content: string;
};