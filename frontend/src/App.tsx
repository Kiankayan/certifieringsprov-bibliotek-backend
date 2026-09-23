import { useEffect, useState } from "react";
import { getLibraryItems } from "./services/LibraryItemService";
import type { LibraryItem } from "./types/library";

function App() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);

  useEffect(() => {
    async function loadLibraryItems() {
      try {
        const response = await getLibraryItems();
        setLibraryItems(response.data);
      } catch (error) {
        console.error("Kunde inte hämta library items.", error);
      }
    }

    loadLibraryItems();
  }, []);

  return (
    <div>
      <h1>Bibliotekssystem</h1>

      {libraryItems.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>Typ: {item.type}</p>
          <p>Kategori: {item.category.name}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
