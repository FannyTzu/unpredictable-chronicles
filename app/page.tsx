"use client";
import {useEffect, useState} from "react";
import MainBlock from "./components/MainBlock/MainBlock";
import Player from "@/app/components/Player/Player";
import s from "./style.module.css";
import DynamicChoices from "@/app/components/DynamicChoices/DynamicChoices";

interface Item {
    weapons?: string;
    money?: number;
    stuff?: string[];
    power?: number;
}

interface Section {
    id: number;
    description: string;
    choices: { label: string; nextId: number; available: boolean }[];
    impact?: { endurance?: number; money?: number }[];
    items?: Item[];
}

interface PlayerType {
    name: string;
    endurance: number;
    money: number;
    weapons: string[];
    stuff: string[];
    currentPageId: number;
    id: number;
}

export default function Home() {
    const [currentSection, setCurrentSection] = useState<Section | null>(null);

    const [loadPlayer, setLoadPlayer] = useState<PlayerType | null>(null);

    useEffect(() => {
        async function loadPlayer() {
            const res = await fetch("http://localhost:3001/players/3");
            const data = await res.json();
            setLoadPlayer(data as PlayerType);
            console.log(data);
        }

        loadPlayer();

    }, []);

    useEffect(() => {
        const loadPlayer = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`http://localhost:3001/players/3`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                console.error("Erreur récupération player");
                return;
            }

            const data = await res.json();
            setLoadPlayer(data);
        };

        loadPlayer();
    }, []);


    const applyChoice = async (nextPageId: number) => {
        if (!loadPlayer) return;

        const res = await fetch(
            `http://localhost:3001/players/${loadPlayer.id}/choice`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({nextPageId}),
            }
        );

        const data = await res.json();

        setLoadPlayer(data.player);
        setCurrentSection(data.page);
    };

    if (!currentSection) return <p>Chargement...</p>;

    return (
        <div>
            <h1>Les chroniques imprévisibles</h1>
            <main className={s.adventure}>
                {loadPlayer ? <Player player={loadPlayer}/> : null}

                <div className={s.container}>
                    <div className={s.read}>
                        <MainBlock description={currentSection}/>
                    </div>
                    <div className={s.choice}>
                        <DynamicChoices choice={currentSection}
                                        onClick={applyChoice}/>
                    </div>
                </div>
            </main>
        </div>
    );
}
