export interface Item {
  id: string;
  inventoryId: number;
  customId: string;
  authorId: number;
  version: number;
  createdAt: string;
  string_1: string;
  string_2: string;
  integer_1: number;
  boolean_1: boolean;
  text_1: string;
  url_1: string;
  _count: Count;
}

export interface Count {
  likes: number;
  comments: number;
}