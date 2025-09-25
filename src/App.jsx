import React, { useEffect, useState, useMemo } from "react";
import "./App.css";

const ALLERGENS = [
  "Glutenbevattende granen",
  "Schaaldieren",
  "Eieren",
  "Vis",
  "Pinda's",
  "Soja",
  "Melk (incl. lactose)",
  "Noten",
  "Selderij",
  "Mosterd",
  "Sesamzaad",
  "Zwaveldioxide en sulfieten",
  "Lupine",
  "Weekdieren",
];

function App() {
  const [menu, setMenu] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/menu.json")
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((e) => console.error("Kon JSON niet laden:", e));
  }, []);

  const toggleAllerg = (aller) => {
    const next = new Set(selected);
    if (next.has(aller)) next.delete(aller);
    else next.add(aller);
    setSelected(next);
  };

  const visible = useMemo(() => {
    return menu.filter((item) => {
      if (query && !item.Gerecht.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      for (const aller of ALLERGENS) {
        if (selected.has(aller) && item[aller] && item[aller].trim() !== "") {
          return false;
        }
      }
      return true;
    });
  }, [menu, selected, query]);

  return (
    <div className="menu-app">
      <header className="menu-header">
        <h1>La Vista Menu</h1>
        <p className="subtitle">Bekijk gerechten & allergenen</p>
      </header>

      <div className="search-section">
        <input
          type="text"
          placeholder="Zoek gerecht..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="allergens-section">
        {ALLERGENS.map((a) => (
          <label key={a} className="allergen-label">
            <input
              type="checkbox"
              checked={selected.has(a)}
              onChange={() => toggleAllerg(a)}
            />
            <span className="allergen-text">{a}</span>
          </label>
        ))}
      </div>

      <h2 className="dish-count">Gerechten ({visible.length})</h2>
      <div className="dish-container">
        {visible.map((item, idx) => {
          const allergList = ALLERGENS.filter(
            (a) => item[a] && item[a].trim() !== ""
          );
          return (
            <div key={idx} className="dish-card">
              <div className="dish-name">{item.Gerecht}</div>
              <div className="dish-allergens">
                {allergList.length > 0
                  ? allergList.join(", ")
                  : "Geen allergenen bekend"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
