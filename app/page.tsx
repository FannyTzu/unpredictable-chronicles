"use client";
import {useEffect, useState} from "react";
import MainBlock from "./components/MainBlock/MainBlock";
import Player from "@/app/components/Player/Player";
import s from "./style.module.css";
import DynamicChoices from "@/app/components/DynamicChoices/DynamicChoices";
import {useRouter} from "next/navigation";

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

    const [checkingAuth, setCheckingAuth] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const loadPlayerData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.replace("/auth");
                    return;
                }

                document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;


                const res = await fetch("http://localhost:3001/players/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 404) {
                    router.replace("/newplayer");
                    return;
                }

                if (!res.ok) {
                    localStorage.removeItem("token");
                    document.cookie = "token=; path=/; max-age=0";
                    router.replace("/auth");
                    return;
                }

                const player = await res.json();
                setLoadPlayer(player);

                const pageRes = await fetch(
                    `http://localhost:3001/pages/${player.current_page_id ?? player.currentPageId}`
                );

                if (pageRes.ok) {
                    const page = await pageRes.json();
                    setCurrentSection(page);
                } else {
                    console.error("Impossible de charger la page du joueur", pageRes.status);
                }
            } catch (err) {
                console.error("Erreur lors de la vérification d'auth:", err);
                router.replace("/auth");
            } finally {
                setCheckingAuth(false);
            }
        };

        loadPlayerData();
    }, [router]);


    const applyChoice = async (nextPageId: number) => {
        if (!loadPlayer) return;

        const token = localStorage.getItem("token");


        const res = await fetch(
            `http://localhost:3001/players/${loadPlayer.id}/choice`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({nextPageId}),
            }
        );

        const data = await res.json();

        setLoadPlayer(data.player);
        setCurrentSection(data.page);
    };

    if (checkingAuth || !currentSection) return <p>Chargement...</p>;

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
