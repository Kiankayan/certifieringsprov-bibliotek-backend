import { useState } from "react";
import type { LibraryItem } from "../types/library";

interface LibraryItemListProps {
  libraryItems: LibraryItem[];
  sort: "category" | "type";
  setSort: (sort: "category" | "type") => void;
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
}: LibraryItemListProps) {
  const [showAbbreviations, setShowAbbreviations] = useState(false);

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
          <h2>
            {showAbbreviations ? getTitleAbbreviation(item.title) : item.title}
          </h2>

          <p>Typ: {item.type}</p>
          <p>Kategori: {item.category.name}</p>

          {item.isBorrowable ? (
            item.borrower ? (
              <p>Utlånad till: {item.borrower}</p>
            ) : (
              <p>Ej utlånad</p>
            )
          ) : (
            <p>Referensexemplar – kan inte lånas</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default LibraryItemList;
