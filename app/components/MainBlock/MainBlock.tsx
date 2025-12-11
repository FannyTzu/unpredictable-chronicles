import CheckboxStuff from "../Stuff/CheckBoxStuff/CheckBoxStuff";

interface Description {
  id: number;
  description: string;
}

interface MainBlockProps {
  description: Description;
  money: number;
}

export default function MainBlock({ description, money }: MainBlockProps) {
  return (
    <>
      <div>{description.description}</div>
      <div>{description.id === 329 && <CheckboxStuff money={money} />}</div>
    </>
  );
}
