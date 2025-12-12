import s from "./style.module.css";

interface Choice {
  label: string;
  nextId: number;
}

interface Section {
  id: number;
  description: string;
  choices: Choice[];
}

interface DynamicChoicesProps {
  choice: Section;
  onClick: (nextId: number) => void;
}

export default function DynamicChoices({ choice, onClick }: DynamicChoicesProps) {
  return (
      <div  className={s.container}>
        {choice.choices.map((c, index) => (
            <button
                key={index}
                className={s.choiceButton}
                onClick={() => onClick(c.nextId)}
            >
              {c.label}
            </button>
        ))}
      </div>
  );
}