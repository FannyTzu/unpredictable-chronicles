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

interface ThirdChoiceProps {
  choice: Section;
  onClick: (nextId: number) => void;
}

export default function ThirdChoice({ choice, onClick }: ThirdChoiceProps) {
  if (!choice?.choices?.[2]) return null;

  return (
    <button
      className={s.choiceButton}
      onClick={() => onClick(choice.choices[2].nextId)}
    >
      {choice.choices[2].label}
    </button>
  );
}
