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
  str1_label?: string | null;
  str2_label?: string | null;
  str3_label?: string | null;
  int1_label?: string | null;
  int2_label?: string | null;
  int3_label?: string | null;
  txt1_label?: string | null;
  txt2_label?: string | null;
  txt3_label?: string | null;
  bool1_label?: string | null;
  bool2_label?: string | null;
  bool3_label?: string | null;
  url1_label?: string | null;
  url2_label?: string | null;
  url3_label?: string | null;
  author: Author;
  category: Category;
  tags: Tag[];
  _count: Count;
}

export interface Author {
  name: string;
  email: string;
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

export interface InventoryFieldsDto {
  version: number;

  str1_label?: string | null;
  str2_label?: string | null;
  str3_label?: string | null;

  int1_label?: string | null;
  int2_label?: string | null;
  int3_label?: string | null;

  txt1_label?: string | null;
  txt2_label?: string | null;
  txt3_label?: string | null;

  bool1_label?: string | null;
  bool2_label?: string | null;
  bool3_label?: string | null;

  url1_label?: string | null;
  url2_label?: string | null;
  url3_label?: string | null;
}

export type InventoryFieldKey = keyof Omit<InventoryFieldsDto, 'version'>;

export const FIELD_KEYS: InventoryFieldKey[] = [
  'str1_label', 'str2_label', 'str3_label',
  'int1_label', 'int2_label', 'int3_label',
  'txt1_label', 'txt2_label', 'txt3_label',
  'bool1_label', 'bool2_label', 'bool3_label',
  'url1_label', 'url2_label', 'url3_label'
] as const;
