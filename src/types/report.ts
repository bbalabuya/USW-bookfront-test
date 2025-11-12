export interface reportListType {
  reason: string;
  type: string;
  reporterName: string;
  reportedThingId: string;
  seller: string;
}

export interface ReportBook {
  postId: string;
  title: string;
  content: string;
  postImage: string; // 이미지 여러 개일 수도 있으면 배열로
  postPrice: number;
  likeCount: number;
  status: string;
  createdAt: string;

  seller?: {
    id: string;
    name: string;
    profileImage?: string;
  };
}
