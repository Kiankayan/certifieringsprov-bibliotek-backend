import { useState } from "react";
import type { LibraryItem } from "../types/library";

interface LibraryItemListProps {
  libraryItems: LibraryItem[];
}

function getTitleAbbreviation(title: string) {
  return title
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function LibraryItemList({ libraryItems }: LibraryItemListProps) {
  const [showAbbreviations, setShowAbbreviations] = useState(false);

  return (
    <div>
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
