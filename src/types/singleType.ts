export interface Book {
    bookId: number;
    title: string;
    postPrice: number;
    status: string;
    content: string;
    professor: string;
    courseName: string;
    grade: number;
    semester: number;
    postImage: string;
    likeCount: number;
    seller?: {
      sellerId: number;
      name: string;
      profileImage: string;
    };
    createdAt: string;
  }