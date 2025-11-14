export interface ChatRoom {
  roomId: string;
  postId: string;
  name: string; // 사용자 닉네임
  userCount: number;
  lastMessage: string;
  lastTimestamp: string;
  img: string;
  postName: string;
};