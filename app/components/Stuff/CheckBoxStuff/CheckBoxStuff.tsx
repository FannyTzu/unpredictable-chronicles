import { useState } from "react";

interface CheckboxStuffProps {
  money: number;
}

export default function CheckboxStuff({ money }: CheckboxStuffProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const items = ["Gants caoutchouc", "piles", "Scie à métaux", "Tournevis"];

  const handleChange = (item: string) => {
    if (selectedItems.includes(item)) {
      const updated = selectedItems.filter((i) => i !== item);
      setSelectedItems(updated);

      return;
    }

    if (money <= 0) {
      alert("Vous n'avez plus assez d'argent !");
      return;
    }

    const updated = [...selectedItems, item];
    setSelectedItems(updated);
  };

  return (
    <div>
      <h4>Chaque objet coûte une pièce :</h4>

      {items.map((item) => {
        const isSelected = selectedItems.includes(item);
        const disabled = !isSelected && money <= 0;

        return (
          <label
            key={item}
            style={{ display: "block", opacity: disabled ? 0.4 : 1 }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleChange(item)}
              disabled={disabled}
            />
            {item}
          </label>
        );
      })}

      <p>Équipement sélectionné : {selectedItems.join(", ") || "aucun"}</p>
      <p>Il vous reste {money} pièces</p>
    </div>
  );
}
