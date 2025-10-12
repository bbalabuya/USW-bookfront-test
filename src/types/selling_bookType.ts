export interface SellingBook {
    id: string; // UUID
    title: string;
    status: string; // "판매완료", "판매중" 등
    price : string;
    createdAt: string;
    postImage: string;
};