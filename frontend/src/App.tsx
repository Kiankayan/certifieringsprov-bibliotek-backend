import { useCallback, useEffect, useState } from "react";
import { getLibraryItems } from "./services/LibraryItemService";
import type { LibraryItem } from "./types/library";
import LibraryItemList from "./components/LibraryItemList";
import LibraryItemForm from "./components/LibraryItemForm";
import CategoryManager from "./components/CategoryManager";

function App() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [sort, setSort] = useState<"category" | "type">("category");

  const loadLibraryItems = useCallback(async () => {
    try {
      const response = await getLibraryItems(sort);
      setLibraryItems(response.data);
    } catch (error) {
      console.error("Kunde inte hämta library items.", error);
    }
  }, [sort]);

  useEffect(() => {
    loadLibraryItems();
  }, [loadLibraryItems]);

  return (
    <div>
      <h1>Bibliotekssystem</h1>

      <CategoryManager />

      <LibraryItemForm onLibraryItemCreated={loadLibraryItems} />

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
