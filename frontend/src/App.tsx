import { useCallback, useEffect, useState } from "react";
import { getLibraryItems } from "./services/LibraryItemService";
import { getCategories } from "./services/CategoryService";
import type { Category, LibraryItem } from "./types/library";
import LibraryItemList from "./components/LibraryItemList";
import LibraryItemForm from "./components/LibraryItemForm";
import CategoryManager from "./components/CategoryManager";
import "./App.css";

function App() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sort, setSort] = useState<"category" | "type">("category");

  const loadLibraryItems = useCallback(async () => {
    try {
      const response = await getLibraryItems(sort);
      setLibraryItems(response.data);
    } catch (error) {
      console.error("Kunde inte hämta library items.", error);
    }
  }, [sort]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Kunde inte hämta kategorier.", error);
    }
  }, []);

  const handleCategoriesChanged = async () => {
    await loadCategories();
    await loadLibraryItems();
  };

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadLibraryItems();
  }, [loadLibraryItems]);

  const borrowedItems = libraryItems.filter(
    (item) => item.borrower !== null,
  ).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="container header-content">
          <div className="brand">
            <span className="brand-icon">📚</span>

            <div>
              <p className="brand-name">Bibliotekssystem</p>
              <p className="brand-subtitle">Library Management</p>
            </div>
          </div>

          <div className="header-badge">Bibliotek</div>
        </div>
      </header>

      <main className="container main-content">
        <section className="hero-section">
          <div>
            <p className="eyebrow">DITT DIGITALA BIBLIOTEK</p>

            <h1>Välkommen till biblioteket 👋</h1>

            <p className="hero-text">
              Hantera böcker, DVD:er, ljudböcker och referensböcker på ett
              enkelt sätt.
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <div>
              <p className="stat-label">Biblioteksposter</p>
              <p className="stat-value">{libraryItems.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🏷️</span>
            <div>
              <p className="stat-label">Kategorier</p>
              <p className="stat-value">{categories.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📖</span>
            <div>
              <p className="stat-label">Utlånade</p>
              <p className="stat-value">{borrowedItems}</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ADMINISTRATION</p>
              <h2>Kategorier</h2>
            </div>
          </div>

          <div className="content-card">
            <CategoryManager
              categories={categories}
              onCategoriesChanged={handleCategoriesChanged}
            />
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NYTT MATERIAL</p>
              <h2>Skapa bibliotekspost</h2>
            </div>
          </div>

          <div className="content-card">
            <LibraryItemForm
              categories={categories}
              onLibraryItemCreated={loadLibraryItems}
            />
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BIBLIOTEK</p>
              <h2>Bibliotekets material</h2>
            </div>
          </div>

          <div className="library-content">
            <LibraryItemList
              libraryItems={libraryItems}
              sort={sort}
              setSort={setSort}
              onLibraryItemUpdated={loadLibraryItems}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
