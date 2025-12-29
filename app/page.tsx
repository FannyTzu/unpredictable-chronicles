"use client";
import {useEffect, useState} from "react";
import MainBlock from "./components/MainBlock/MainBlock";
import Player from "@/app/components/Player/Player";
import s from "./style.module.css";
import DynamicChoices from "@/app/components/DynamicChoices/DynamicChoices";
import {useRouter} from "next/navigation";
import {Settings} from "lucide-react";
import DeathScreen from "@/app/components/Death/DeathScreen";

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
    autoEffect?: { type: string; reason?: string; deathTextId?: string };
}

interface PlayerType {
    name: string;
    endurance: number;
    money: number;
    weapons: string[];
    stuff: string[];
    currentPageId: number;
    id: number;
    stats?: { totalChoices?: number; combats?: number };
}

export default function Home() {
    const [currentSection, setCurrentSection] = useState<Section | null>(null);
    const [loadPlayer, setLoadPlayer] = useState<PlayerType | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [pendingDeath, setPendingDeath] = useState<string | null>(null);
    const [isDead, setIsDead] = useState(false);
    const [deathTextId, setDeathTextId] = useState<string | null>(null);

    const router = useRouter();

    const handleSettings = () => {
        router.replace('/settings');
    }

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
                    headers: {Authorization: `Bearer ${token}`},
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

                    if (page.autoEffect?.type === "DEATH") {
                        setPendingDeath(page.autoEffect.deathTextId || null);
                    }
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

        if (data.status === "DEAD" && !data.page?.autoEffect) {
            setDeathTextId(data.deathTextId || null);
            setIsDead(true);
            return;
        }

        setLoadPlayer(data.player);
        setCurrentSection(data.page);

        if (data.page?.autoEffect?.type === "DEATH") {
            setPendingDeath(data.page.autoEffect.deathTextId || null);
        } else {
            setPendingDeath(null);
        }
    };

    if (checkingAuth || !currentSection) return <p>Chargement...</p>;

    if (isDead && deathTextId && loadPlayer) {
        return (
            <DeathScreen
                deathTextId={deathTextId}
                stats={loadPlayer.stats ?? {totalChoices: 0, combats: 0}}
                playerId={loadPlayer.id}
            />
        );
    }

    return (
        <div>
            <div className={s.header}>
                <h1>Les chroniques imprévisibles</h1>
                <button onClick={handleSettings} className={s.settingsButton}><Settings size={24}/></button>
            </div>

            <main className={s.adventure}>
                {loadPlayer && <Player player={loadPlayer}/>}

                <div className={s.container}>
                    <div className={s.read}>
                        <MainBlock description={currentSection}/>
                    </div>

                    <div className={s.choice}>
                        <DynamicChoices choice={currentSection} onClick={applyChoice}/>

                        {pendingDeath && !isDead && (
                            <button
                                className={s.button}
                                onClick={() => {
                                    setDeathTextId(pendingDeath);
                                    setIsDead(true);
                                    setPendingDeath(null);
                                }}
                            >
                                Continuer
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
