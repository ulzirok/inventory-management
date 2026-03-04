export interface Search {
  id: number;
  title: string;
  author: Author;
  tags: Tag[];
  _count: Count;
}

export interface Author {
  name: string;
}

export interface Tag {
  name: string;
}

export interface Count {
  items: number;
}