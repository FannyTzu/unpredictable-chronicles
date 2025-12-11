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

interface FirstChoiceProps {
  choice: Section;
  onClick: (nextId: number) => void;
}

export default function FirstChoice({ choice, onClick }: FirstChoiceProps) {
  return (
    <button
      className={s.choiceButton}
      onClick={() => onClick(choice.choices[0].nextId)}
    >
      {choice.choices[0].label}
    </button>
  );
}
