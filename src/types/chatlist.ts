export interface ChatRoom {
  roomId: string;
  postId: string;
  name: string; // 사용자 닉네임
  userCount: number;
  lastMessage: string;
  lastMessageTime: string;
  img: string;
  postName: string;
};