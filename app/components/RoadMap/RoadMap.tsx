import s from "./style.module.css";

interface RoadMapProps {
  lifePoint: number;
  weapons: string[];
  money: number;
  stuff: string[];
}

export default function RoadMap({
  lifePoint,
  weapons,
  money,
  stuff,
}: RoadMapProps) {
  interface Character {
    name: string;
    lifePoint: number;
    weapons: string[];
    ammunition: string[];
    money: number;
  }
  const hero: Character = {
    name: "Gabriel",
    lifePoint: 40,
    weapons: [],
    ammunition: [],
    money: 0,
  };

  return (
    <main className={s.main}>
      <h2>Mon aventure</h2>
      <div>{hero.name}</div>
      <div>Endurance : {hero.lifePoint + lifePoint}</div>
      <div>Armes : {[...weapons].join(", ")}</div>
      <div>Munitions : {hero.ammunition}</div>
      <div>Pièces : {hero.money + money}</div>
      <div>Accessoires : {[...stuff].join(", ")}</div>
    </main>
  );
}
