export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: number;
  readAt: number | null;
}
