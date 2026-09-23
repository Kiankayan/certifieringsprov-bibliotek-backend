import { useEffect, useState } from "react";
import { createLibraryItem } from "../services/LibraryItemService";
import { getCategories } from "../services/CategoryService";
import type { Category } from "../types/library";

type LibraryItemType = "BOOK" | "DVD" | "AUDIOBOOK" | "REFERENCE_BOOK";

interface LibraryItemFormProps {
  onLibraryItemCreated: () => Promise<void>;
}

function LibraryItemForm({ onLibraryItemCreated }: LibraryItemFormProps) {
  const [type, setType] = useState<LibraryItemType>("BOOK");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [nbrPages, setNbrPages] = useState("");
  const [runTimeMinutes, setRunTimeMinutes] = useState("");
  const [isBorrowable, setIsBorrowable] = useState(true);

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

    try {
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

      await createLibraryItem(data);

      setTitle("");
      setAuthor("");
      setNbrPages("");
      setRunTimeMinutes("");
      setCategoryId("");
      setType("BOOK");
      setIsBorrowable(true);

      await onLibraryItemCreated();
    } catch (error) {
      console.error("Kunde inte skapa library item.", error);
      window.alert("Kunde inte skapa biblioteksposten.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Skapa bibliotekspost</h2>

      <div>
        <label htmlFor="type">Typ: </label>

        <select
          id="type"
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
        <label htmlFor="title">Titel: </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      {(type === "BOOK" || type === "REFERENCE_BOOK") && (
        <>
          <div>
            <label htmlFor="author">Författare: </label>

            <input
              id="author"
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="nbrPages">Antal sidor: </label>

            <input
              id="nbrPages"
              type="number"
              value={nbrPages}
              onChange={(event) => setNbrPages(event.target.value)}
            />
          </div>
        </>
      )}

      {(type === "DVD" || type === "AUDIOBOOK") && (
        <div>
          <label htmlFor="runTimeMinutes">Speltid i minuter: </label>

          <input
            id="runTimeMinutes"
            type="number"
            value={runTimeMinutes}
            onChange={(event) => setRunTimeMinutes(event.target.value)}
          />
        </div>
      )}

      <div>
        <label htmlFor="category">Kategori: </label>

        <select
          id="category"
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
          <label htmlFor="isBorrowable">Kan lånas: </label>

          <input
            id="isBorrowable"
            type="checkbox"
            checked={isBorrowable}
            onChange={(event) => setIsBorrowable(event.target.checked)}
          />
        </div>
      )}

      {type === "REFERENCE_BOOK" && <p>Referensböcker kan inte lånas.</p>}

      <button type="submit">Skapa</button>
    </form>
  );
}

export default LibraryItemForm;
