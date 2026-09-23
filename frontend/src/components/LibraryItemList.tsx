import { useEffect, useState } from "react";
import {
  borrowLibraryItem,
  returnLibraryItem,
  deleteLibraryItem,
} from "../services/LibraryItemService";
import { getCategories } from "../services/CategoryService";
import type { Category, LibraryItem } from "../types/library";
import EditLibraryItemForm from "./EditLibraryItemForm";

interface LibraryItemListProps {
  libraryItems: LibraryItem[];
  sort: "category" | "type";
  setSort: (sort: "category" | "type") => void;
  onLibraryItemUpdated: () => Promise<void>;
}

function getTitleAbbreviation(title: string) {
  return title
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function LibraryItemList({
  libraryItems,
  sort,
  setSort,
  onLibraryItemUpdated,
}: LibraryItemListProps) {
  const [showAbbreviations, setShowAbbreviations] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Kunde inte hämta kategorier.", error);
      }
    }

    loadCategories();
  }, []);

  async function handleBorrow(itemId: string) {
    const borrower = window.prompt("Ange kundens namn:");

    if (!borrower || borrower.trim() === "") return;

    try {
      await borrowLibraryItem(itemId, borrower.trim());
      await onLibraryItemUpdated();
    } catch (error) {
      console.error("Kunde inte låna library item.", error);
      window.alert("Det gick inte att låna objektet.");
    }
  }

  async function handleReturn(itemId: string) {
    try {
      await returnLibraryItem(itemId);
      await onLibraryItemUpdated();
    } catch (error) {
      console.error("Kunde inte returnera library item.", error);
      window.alert("Det gick inte att returnera objektet.");
    }
  }

  async function handleDelete(itemId: string) {
    const confirmed = window.confirm(
      "Är du säker på att du vill ta bort biblioteksposten?",
    );

    if (!confirmed) return;

    try {
      await deleteLibraryItem(itemId);
      await onLibraryItemUpdated();
    } catch (error) {
      console.error("Kunde inte ta bort library item.", error);
      window.alert("Det gick inte att ta bort biblioteksposten.");
    }
  }

  return (
    <div>
      <div>
        <label htmlFor="sort">Sortera efter: </label>

        <select
          id="sort"
          value={sort}
          onChange={(event) =>
            setSort(event.target.value as "category" | "type")
          }
        >
          <option value="category">Kategori</option>
          <option value="type">Typ</option>
        </select>
      </div>

      <button onClick={() => setShowAbbreviations(!showAbbreviations)}>
        {showAbbreviations
          ? "Visa fullständiga titlar"
          : "Visa förkortade titlar"}
      </button>

      {libraryItems.map((item) => (
        <div key={item.id}>
          {editingItemId === item.id ? (
            <EditLibraryItemForm
              item={item}
              categories={categories}
              onLibraryItemUpdated={onLibraryItemUpdated}
              onCancel={() => setEditingItemId(null)}
            />
          ) : (
            <>
              <h2>
                {showAbbreviations
                  ? getTitleAbbreviation(item.title)
                  : item.title}
              </h2>

              <p>Typ: {item.type}</p>

              <p>Kategori: {item.category.name}</p>

              {item.isBorrowable ? (
                item.borrower ? (
                  <>
                    <p>Utlånad till: {item.borrower}</p>

                    <button onClick={() => handleReturn(item.id)}>
                      Returnera
                    </button>
                  </>
                ) : (
                  <>
                    <p>Ej utlånad</p>

                    <button onClick={() => handleBorrow(item.id)}>Låna</button>
                  </>
                )
              ) : (
                <p>Referensexemplar – kan inte lånas</p>
              )}

              <button type="button" onClick={() => setEditingItemId(item.id)}>
                Ändra
              </button>

              <button type="button" onClick={() => handleDelete(item.id)}>
                Ta bort
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default LibraryItemList;
