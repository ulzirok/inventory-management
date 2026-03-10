export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
  };
}