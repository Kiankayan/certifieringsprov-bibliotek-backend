import type { LibraryItem } from "../types/library";
import axios from "axios";

const API_BASEURL = "http://localhost:5001/api/library-items";

export async function borrowLibraryItem(id: string, borrower: string) {
  return axios.post<LibraryItem>(`${API_BASEURL}/${id}/borrow`, {
    borrower,
  });
}

export async function returnLibraryItem(id: string) {
  return axios.post<LibraryItem>(`${API_BASEURL}/${id}/return`);
}

export async function getLibraryItems(sort: "category" | "type" = "category") {
  return axios.get<LibraryItem[]>(API_BASEURL, {
    params: {
      sort,
    },
  });
}

export async function createLibraryItem(data: {
  title: string;
  categoryId: string;
  isBorrowable: boolean;
  type: "BOOK" | "DVD" | "AUDIOBOOK" | "REFERENCE_BOOK";
  author?: string;
  nbrPages?: number;
  runTimeMinutes?: number;
}) {
  return axios.post<LibraryItem>(API_BASEURL, data);
}
