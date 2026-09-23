import { useEffect, useState } from "react";
import { getCategories } from "../services/CategoryService";
import type { Category } from "../types/library";

type LibraryItemType = "BOOK" | "DVD" | "AUDIOBOOK" | "REFERENCE_BOOK";

function LibraryItemForm() {
  const [type, setType] = useState<LibraryItemType>("BOOK");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");

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

  return (
    <form>
      <h2>Skapa bibliotekspost</h2>

      <div>
        <label htmlFor="type">Typ: </label>

        <select
          id="type"
          value={type}
          onChange={(event) => setType(event.target.value as LibraryItemType)}
        >
          <option value="BOOK">Bok</option>
          <option value="DVD">DVD</option>
          <option value="AUDIOBOOK">Ljudbok</option>
          <option value="REFERENCE_BOOK">Referensbok</option>
        </select>
      </div>

      <div>
        <label htmlFor="title">Titel: </label>

        <input id="title" type="text" name="title" />
      </div>

      {(type === "BOOK" || type === "REFERENCE_BOOK") && (
        <>
          <div>
            <label htmlFor="author">Författare: </label>

            <input id="author" type="text" name="author" />
          </div>

          <div>
            <label htmlFor="nbrPages">Antal sidor: </label>

            <input id="nbrPages" type="number" name="nbrPages" />
          </div>
        </>
      )}

      {(type === "DVD" || type === "AUDIOBOOK") && (
        <div>
          <label htmlFor="runTimeMinutes">Speltid i minuter: </label>

          <input id="runTimeMinutes" type="number" name="runTimeMinutes" />
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

          <input id="isBorrowable" type="checkbox" defaultChecked />
        </div>
      )}

      {type === "REFERENCE_BOOK" && <p>Referensböcker kan inte lånas.</p>}

      <button type="submit">Skapa</button>
    </form>
  );
}

export default LibraryItemForm;
