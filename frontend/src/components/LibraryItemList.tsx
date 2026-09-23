import type { LibraryItem } from "../types/library";

interface LibraryItemListProps {
  libraryItems: LibraryItem[];
}

function LibraryItemList({ libraryItems }: LibraryItemListProps) {
  return (
    <div>
      {libraryItems.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>

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
