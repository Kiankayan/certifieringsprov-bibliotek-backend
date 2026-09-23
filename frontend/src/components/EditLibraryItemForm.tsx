import { useState } from "react";
import { updateLibraryItem } from "../services/LibraryItemService";
import type { Category, LibraryItem } from "../types/library";
import { libraryItemSchema } from "../schemas/libraryItemSchema";

type LibraryItemType = "BOOK" | "DVD" | "AUDIOBOOK" | "REFERENCE_BOOK";

interface EditLibraryItemFormProps {
  item: LibraryItem;
  categories: Category[];
  onLibraryItemUpdated: () => Promise<void>;
  onCancel: () => void;
}

function EditLibraryItemForm({
  item,
  categories,
  onLibraryItemUpdated,
  onCancel,
}: EditLibraryItemFormProps) {
  const [type, setType] = useState<LibraryItemType>(item.type);
  const [categoryId, setCategoryId] = useState(item.categoryId);

  const [title, setTitle] = useState(item.title);
  const [author, setAuthor] = useState(item.author ?? "");
  const [nbrPages, setNbrPages] = useState(item.nbrPages?.toString() ?? "");
  const [runTimeMinutes, setRunTimeMinutes] = useState(
    item.runTimeMinutes?.toString() ?? "",
  );
  const [isBorrowable, setIsBorrowable] = useState(item.isBorrowable);

  function handleTypeChange(newType: LibraryItemType) {
    setType(newType);

    setAuthor("");
    setNbrPages("");
    setRunTimeMinutes("");

    if (newType === "REFERENCE_BOOK") {
      setIsBorrowable(false);
    } else {
      setIsBorrowable(true);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = {
      title: title.trim(),
      categoryId,
      isBorrowable,
      type,
      ...(type === "BOOK" || type === "REFERENCE_BOOK"
        ? {
            author: author.trim(),
            nbrPages: Number(nbrPages),
          }
        : {}),
      ...(type === "DVD" || type === "AUDIOBOOK"
        ? {
            runTimeMinutes: Number(runTimeMinutes),
          }
        : {}),
    };

    const result = libraryItemSchema.safeParse(data);

    if (!result.success) {
      window.alert(result.error.issues[0].message);
      return;
    }

    try {
      await updateLibraryItem(item.id, result.data);

      await onLibraryItemUpdated();
      onCancel();
    } catch (error) {
      console.error("Kunde inte uppdatera library item.", error);
      window.alert("Kunde inte uppdatera biblioteksposten.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Redigera bibliotekspost</h3>

      <div>
        <label htmlFor={`edit-type-${item.id}`}>Typ: </label>

        <select
          id={`edit-type-${item.id}`}
          value={type}
          onChange={(event) =>
            handleTypeChange(event.target.value as LibraryItemType)
          }
        >
          <option value="BOOK">Bok</option>
          <option value="DVD">DVD</option>
          <option value="AUDIOBOOK">Ljudbok</option>
          <option value="REFERENCE_BOOK">Referensbok</option>
        </select>
      </div>

      <div>
        <label htmlFor={`edit-title-${item.id}`}>Titel: </label>

        <input
          id={`edit-title-${item.id}`}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      {(type === "BOOK" || type === "REFERENCE_BOOK") && (
        <>
          <div>
            <label htmlFor={`edit-author-${item.id}`}>Författare: </label>

            <input
              id={`edit-author-${item.id}`}
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor={`edit-pages-${item.id}`}>Antal sidor: </label>

            <input
              id={`edit-pages-${item.id}`}
              type="number"
              value={nbrPages}
              onChange={(event) => setNbrPages(event.target.value)}
            />
          </div>
        </>
      )}

      {(type === "DVD" || type === "AUDIOBOOK") && (
        <div>
          <label htmlFor={`edit-runtime-${item.id}`}>Speltid i minuter: </label>

          <input
            id={`edit-runtime-${item.id}`}
            type="number"
            value={runTimeMinutes}
            onChange={(event) => setRunTimeMinutes(event.target.value)}
          />
        </div>
      )}

      <div>
        <label htmlFor={`edit-category-${item.id}`}>Kategori: </label>

        <select
          id={`edit-category-${item.id}`}
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Välj kategori</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {type !== "REFERENCE_BOOK" && (
        <div>
          <label htmlFor={`edit-borrowable-${item.id}`}>Kan lånas: </label>

          <input
            id={`edit-borrowable-${item.id}`}
            type="checkbox"
            checked={isBorrowable}
            onChange={(event) => setIsBorrowable(event.target.checked)}
          />
        </div>
      )}

      {type === "REFERENCE_BOOK" && <p>Referensböcker kan inte lånas.</p>}

      <button type="submit">Spara ändringar</button>

      <button type="button" onClick={onCancel}>
        Avbryt
      </button>
    </form>
  );
}

export default EditLibraryItemForm;
