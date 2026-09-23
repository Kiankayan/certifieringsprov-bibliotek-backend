import { useEffect, useState } from "react";
import { getLibraryItems } from "./services/LibraryItemService";
import type { LibraryItem } from "./types/library";
import LibraryItemList from "./components/LibraryItemList";

function App() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [sort, setSort] = useState<"category" | "type">("category");

  useEffect(() => {
    async function loadLibraryItems() {
      try {
        const response = await getLibraryItems(sort);
        setLibraryItems(response.data);
      } catch (error) {
        console.error("Kunde inte hämta library items.", error);
      }
    }

    loadLibraryItems();
  }, [sort]);

  return (
    <div>
      <h1>Bibliotekssystem</h1>

      <LibraryItemList
        libraryItems={libraryItems}
        sort={sort}
        setSort={setSort}
      />
    </div>
  );
}

export default App;
