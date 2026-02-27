export interface Inventory {
  id: number;
  title: string;
  description: string;
  imageUrl: any;
  idFormat: string;
  categoryId: number;
  authorId: number;
  isPublic: boolean;
  version: number;
  updatedAt: string;
  str1_label: any;
  str2_label: any;
  str3_label: any;
  int1_label: any;
  int2_label: any;
  int3_label: any;
  txt1_label: any;
  txt2_label: any;
  txt3_label: any;
  bool1_label: any;
  bool2_label: any;
  bool3_label: any;
  url1_label: any;
  url2_label: any;
  url3_label: any;
  author: Author;
  category: Category;
  tags: Tag[];
  _count: Count;
}

export interface Author {
  name: any;
  email: any;
}

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}
export interface Count {
  items: number;
}
