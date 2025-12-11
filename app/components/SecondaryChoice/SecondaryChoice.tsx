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

interface SecondaryChoiceProps {
  choice: Section;
  onClick: (nextId: number) => void;
}

export default function SecondaryChoice({
  choice,
  onClick,
}: SecondaryChoiceProps) {
  if (!choice?.choices?.[1]) return null;

  return (
    <button
      className={s.choiceButton}
      onClick={() => onClick(choice.choices[1].nextId)}
    >
      {choice.choices[1].label}
    </button>
  );
}
