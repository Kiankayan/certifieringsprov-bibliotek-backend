export type LibraryItemType = "BOOK" | "DVD" | "AUDIOBOOK" | "REFERENCE_BOOK";

export interface Category {
  id: string;
  name: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string | null;
  nbrPages: number | null;
  runTimeMinutes: number | null;
  type: LibraryItemType;
  isBorrowable: boolean;
  borrower: string | null;
  borrowDate: string | null;
  categoryId: string;
  category: Category;
}
