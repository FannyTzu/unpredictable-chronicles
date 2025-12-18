import s from "./style.module.css";

interface Choice {
    label: string;
    available: boolean;
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

export default function DynamicChoices({choice, onClick}: DynamicChoicesProps) {
    return (
        <div className={s.container}>
            {choice?.choices?.map((c, index) => (
                <button
                    key={index}
                    className={`${s.choiceButton} ${
                        !c.available ? s.choiceDisabled : ""
                    }`}
                    disabled={!c.available}
                    onClick={() => onClick(c.nextId)}
                >
                    {!c.available ? "Choix indisponible" : c.label}
                </button>
            ))}
        </div>
    );
}