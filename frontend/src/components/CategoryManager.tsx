import { useState } from "react";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../services/CategoryService";
import type { Category } from "../types/library";

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChanged: () => Promise<void>;
}

function CategoryManager({
  categories,
  onCategoriesChanged,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");

  async function handleCreateCategory() {
    const name = newCategoryName.trim();

    if (!name) {
      window.alert("Kategorinamn krävs.");
      return;
    }

    try {
      await createCategory(name);
      setNewCategoryName("");
      await onCategoriesChanged();
    } catch (error) {
      console.error("Kunde inte skapa kategori.", error);
      window.alert("Kunde inte skapa kategorin.");
    }
  }

  function startEditing(category: Category) {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  }

  function cancelEditing() {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  }

  async function handleUpdateCategory() {
    if (!editingCategoryId) return;

    const name = editingCategoryName.trim();

    if (!name) {
      window.alert("Kategorinamn krävs.");
      return;
    }

    try {
      await updateCategory(editingCategoryId, name);
      cancelEditing();
      await onCategoriesChanged();
    } catch (error) {
      console.error("Kunde inte uppdatera kategori.", error);
      window.alert("Kunde inte uppdatera kategorin.");
    }
  }

  async function handleDeleteCategory(id: string) {
    const confirmed = window.confirm(
      "Är du säker på att du vill ta bort kategorin?",
    );

    if (!confirmed) return;

    try {
      await deleteCategory(id);
      await onCategoriesChanged();
    } catch (error) {
      console.error("Kunde inte ta bort kategori.", error);
      window.alert(
        "Kategorin kunde inte tas bort. Kontrollera att den inte används av någon bibliotekspost.",
      );
    }
  }

  return (
    <section className="category-manager">
      <div className="category-create">
        <input
          type="text"
          value={newCategoryName}
          placeholder="Ny kategori"
          onChange={(event) => setNewCategoryName(event.target.value)}
        />

        <button type="button" onClick={handleCreateCategory}>
          Skapa kategori
        </button>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <div className="category-row" key={category.id}>
            {editingCategoryId === category.id ? (
              <div className="category-edit">
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(event) =>
                    setEditingCategoryName(event.target.value)
                  }
                />

                <div className="category-actions">
                  <button type="button" onClick={handleUpdateCategory}>
                    Spara
                  </button>

                  <button type="button" onClick={cancelEditing}>
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="category-name">{category.name}</span>

                <div className="category-actions">
                  <button type="button" onClick={() => startEditing(category)}>
                    Ändra
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Ta bort
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryManager;
