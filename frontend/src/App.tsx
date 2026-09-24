import { useCallback, useEffect, useState } from "react";
import { getLibraryItems } from "./services/LibraryItemService";
import { getCategories } from "./services/CategoryService";
import type { Category, LibraryItem } from "./types/library";
import LibraryItemList from "./components/LibraryItemList";
import LibraryItemForm from "./components/LibraryItemForm";
import CategoryManager from "./components/CategoryManager";

function App() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sort, setSort] = useState<"category" | "type">("category");

  const loadLibraryItems = useCallback(async () => {
    try {
      const response = await getLibraryItems(sort);
      setLibraryItems(response.data);
    } catch (error) {
      console.error("Kunde inte hämta library items.", error);
    }
  }, [sort]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Kunde inte hämta kategorier.", error);
    }
  }, []);

  const handleCategoriesChanged = async () => {
    await loadCategories();
    await loadLibraryItems();
  };

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadLibraryItems();
  }, [loadLibraryItems]);

  return (
    <div>
      <h1>Bibliotekssystem</h1>

      <CategoryManager
        categories={categories}
        onCategoriesChanged={handleCategoriesChanged}
      />

      <LibraryItemForm
        categories={categories}
        onLibraryItemCreated={loadLibraryItems}
      />

      <LibraryItemList
        libraryItems={libraryItems}
        sort={sort}
        setSort={setSort}
        onLibraryItemUpdated={loadLibraryItems}
      />
    </div>
  );
}

export default App;
