import React, { useEffect, useState, useMemo } from "react";

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
  "Weekdieren"
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
      // filter naam
      if (query && !item.Gerecht.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      // filter allergenen
      for (const aller of ALLERGENS) {
        if (selected.has(aller) && item[aller] && item[aller].trim() !== "") {
          return false;
        }
      }
      return true;
    });
  }, [menu, selected, query]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>La Vista Allergenen Checker</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Zoek gerecht..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "5px", width: "300px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        {ALLERGENS.map((a) => (
          <label key={a} style={{ marginRight: "15px" }}>
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
      <ul>
        {visible.map((item, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <strong>{item.Gerecht}</strong>
            <br />
            Allergenen:{" "}
            {ALLERGENS.filter((a) => item[a] && item[a].trim() !== "").join(", ") ||
              "Geen bekende allergenen"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
