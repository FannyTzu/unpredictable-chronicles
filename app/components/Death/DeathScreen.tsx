"use client"
import React from 'react';
import s from "./style.module.css";
import {useRouter} from "next/navigation";
import {deathTexts} from "@/app/components/Death/deathTexts";

interface DeathProps {
    deathTextId: string;
    stats: Stats;
    playerId: number;
}

interface Stats {
    totalChoices?: number;
    combats?: number
}

function DeathScreen({deathTextId, stats, playerId}: DeathProps) {

    const router = useRouter();

    const deathTextMessage = (deathTexts as Record<string, string>)[deathTextId];


    const handleResetGame = async () => {
        if (!playerId) {
            console.warn("playerId manquant");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(
                `http://localhost:3001/players/${playerId}/reset`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || "Erreur lors de la suppression");
                return;
            }

            //todo: renvoyer vers page d accueil qand ecran dispo
            router.replace("/settings");

        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    }

    return (
        <div className={s.page}>
            <div className={s.container}>

                <div className={s.titleDeath}>{deathTextMessage ?? "Vous êtes mort..."}</div>

                {/*todo: contenu des stats, à voir ce qui utile...*/}
                <div className={s.containerStat}>
                    <h3>Mes Statistiques de jeu </h3>
                    <div>Nombre de choix avant la mort : {stats.totalChoices}</div>
                    <div>Nombre de combat mené : {stats.combats}</div>
                </div>
                
                <button className={s.button} onClick={handleResetGame}> Recommencer l&apos;histoire</button>

            </div>

        </div>
    );
}

export default DeathScreen;