import axios from "axios";
import type { Category } from "../types/library";

const API_BASEURL = "http://localhost:5001/api/categories";

export async function getCategories() {
  return axios.get<Category[]>(API_BASEURL);
}
