import { UUID } from "crypto";

export interface JoinRequest {
  email: string;
  password: string;
  name: string;
  studentId: string;
  majorId: string; // 학과 이름에서 학과별 부여되는 ID로 변경
  grade: number;
  semester: number;
  profileImage: File | null;
}
