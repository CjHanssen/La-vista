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
    <div className="app">
      <h1>La Vista Allergenen Checker</h1>

      <div className="search">
        <input
          placeholder="Zoek gerecht..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="allergens">
        {ALLERGENS.map((a) => (
          <label key={a} className="allergen">
            <input
              type="checkbox"
              checked={selected.has(a)}
              onChange={() => toggleAllerg(a)}
            />
            {a}
          </label>
        ))}
      </div>

      <h2>Gerechten ({visible.length})</h2>
      <ul className="dish-list">
        {visible.map((item, index) => (
          <li key={index} className="dish">
            <strong>{item.Gerecht}</strong>
            <div className="dish-allergens">
              <em>Allergenen:</em>{" "}
              {ALLERGENS.filter((a) => item[a] && item[a].trim() !== "").join(", ") ||
                "Geen bekende allergenen"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
