import { UUID } from "crypto";

export interface JoinRequest {
  studentId: string;
  email: string;
  password: string;
  name: string;
  majorId: string; // 학과 이름에서 학과별 부여되는 ID로 변경
  grade: string;
  semester: string;
}
