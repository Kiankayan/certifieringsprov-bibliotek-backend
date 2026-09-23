import type { LibraryItem } from "../types/library";
import axios from "axios";

const API_BASEURL = "http://localhost:5001/api/library-items";

export async function getLibraryItems() {
  return axios.get<LibraryItem[]>(API_BASEURL);
}
