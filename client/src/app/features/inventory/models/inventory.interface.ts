export interface Inventory {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  idFormat: string;
  categoryId: number;
  authorId: number;
  isPublic: boolean;
  version: number;
  updatedAt: string;
  category: Category;
  tags: Tag[];
  str1_label: string;
  str2_label: string;
  int1_label: string;
  bool1_label: string;
  txt1_label: string;
  url1_label: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}