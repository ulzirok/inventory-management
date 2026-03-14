import { Inventory, InventoryFieldKey } from "./inventory.interface";

export interface Item {
  id: string;
  inventoryId: number;
  inventory: Inventory
  customId: string;
  authorId: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  string_1: string;
  string_2: string;
  string_3: string;
  integer_1: number;
  integer_2: number;
  integer_3: number;
  boolean_1: boolean;
  boolean_2: boolean;
  boolean_3: boolean;
  text_1: string;
  text_2: string;
  text_3: string;
  url_1: string;
  url_2: string;
  url_3: string;
  _count: Count;
  isLiked: boolean;
}

export interface Count {
  likes: number;
  comments: number;
}

export interface ItemDto {
  version: number;

  string_1?: string | null;
  string_2?: string | null;
  string_3?: string | null;

  integer_1?: number | null;
  integer_2?: number | null;
  integer_3?: number | null;

  text_1?: string | null;
  text_2?: string | null;
  text_3?: string | null;

  boolean_1?: boolean | null;
  boolean_2?: boolean | null;
  boolean_3?: boolean | null;

  url_1?: string | null;
  url_2?: string | null;
  url_3?: string | null;
}

export type ItemFieldKey = keyof Omit<ItemDto, 'version'>;

export const FIELD_MAPPING: Record<InventoryFieldKey, ItemFieldKey> = {
  str1_label: 'string_1',
  str2_label: 'string_2',
  str3_label: 'string_3',

  int1_label: 'integer_1',
  int2_label: 'integer_2',
  int3_label: 'integer_3',

  txt1_label: 'text_1',
  txt2_label: 'text_2',
  txt3_label: 'text_3',

  bool1_label: 'boolean_1',
  bool2_label: 'boolean_2',
  bool3_label: 'boolean_3',

  url1_label: 'url_1',
  url2_label: 'url_2',
  url3_label: 'url_3',
} as const;

export interface ItemCreateData {
  inventory: Inventory | null;
  activeFields: {
    label: string;
    columnDef: string;
    type: FieldType;
  }[];
  item?: Item;
}

export type FieldType = 'string' | 'number' | 'boolean' | 'text';