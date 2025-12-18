import s from "./style.module.css";

interface Player {
    name: string;
    endurance: number;
    money: number;
    weapons: string[];
    stuff: string[];
}

export default function Player({player}: { player: Player }) {
    return (
        <aside className={s.container}>
            <h2>{player.name}</h2>
            <div>Endurance : {player.endurance}</div>
            <div>Argent : {player.money}</div>
            <div>Armes : {player.weapons?.join(", ")}</div>
            <div>Objets : {player.stuff?.join(", ")}</div>
        </aside>
    );
}