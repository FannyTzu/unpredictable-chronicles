"use client";
import {useEffect, useState} from "react";
import MainBlock from "./components/MainBlock/MainBlock";
import Player from "@/app/components/Player/Player";
import s from "./style.module.css";
import DynamicChoices from "@/app/components/DynamicChoices/DynamicChoices";
import {useRouter} from "next/navigation";
import {Settings} from "lucide-react";
import DeathScreen from "@/app/components/Death/DeathScreen";
import CombatDisplay from "@/app/components/Combat/CombatDisplay";

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


    const [combatState, setCombatState] = useState<{
        remainingEnemies: number;
        enemyType: string;
    } | null>(null);
    const [lastRoll, setLastRoll] = useState<number>();
    const [lastKills, setLastKills] = useState<number>();
    const [combatVictory, setCombatVictory] = useState<{
        nextPageId: number;
        roll: number;
        kills: number;
    } | null>(null);

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

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/me`, {
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
                    `${process.env.NEXT_PUBLIC_API_URL}/pages/${player.current_page_id ?? player.currentPageId}`
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
            `${process.env.NEXT_PUBLIC_API_URL}/players/${loadPlayer.id}/choice`,
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

        if (data.status === "COMBAT_STARTED") {
            setCombatState({
                remainingEnemies: data.combat.remainingEnemies,
                enemyType: data.combat.enemyType
            });
        }
    };

    const handleRollDice = async () => {
        if (!loadPlayer || !combatState) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/${loadPlayer.id}/roll-dice`, {
                method: "POST",
                headers: {Authorization: `Bearer ${token}`},
            });

            if (!res.ok) {
                console.error("Erreur lors du lancer de dé");
                return;
            }

            const data = await res.json();

            setLastRoll(data.roll);
            setLastKills(data.kills);

            if (data.status === "COMBAT_CONTINUE") {
                setCombatState(prev => prev ? {
                    ...prev,
                    remainingEnemies: data.remainingEnemies
                } : null);
                setLoadPlayer(prev => prev ? {...prev, endurance: data.endurance} : null);

            } else if (data.status === "COMBAT_WON") {
                console.log("🎉 Combat gagné!");
                setCombatState(null);


                setCombatVictory({
                    nextPageId: data.nextPageId,
                    roll: data.roll,
                    kills: data.kills
                });
                setLastRoll(data.roll);
                setLastKills(data.kills);


                setLoadPlayer(prev => prev ? {...prev, endurance: data.endurance} : null);

            } else if (data.status === "DEAD") {
                setCombatState(null);
                setDeathTextId(data.deathTextId);
                setIsDead(true);
            }
        } catch (error) {
            console.error("Erreur réseau lors du combat:", error);
        }
    };

    const handleContinueAfterVictory = async () => {
        if (!combatVictory) return;

        await applyChoice(combatVictory.nextPageId);

        setCombatVictory(null);
        setLastRoll(undefined);
        setLastKills(undefined);
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
                    <div className={s.read}><MainBlock description={currentSection}/></div>

                    <div className={s.choice}>
                        {!combatState && <DynamicChoices choice={currentSection} onClick={applyChoice}/>}

                        {combatState && (
                            <>
                                <CombatDisplay combatState={combatState} endurance={loadPlayer?.endurance ?? 0}
                                               lastRoll={lastRoll} lastKills={lastKills}/>
                                <button className={s.combatButton} onClick={handleRollDice}> 🎲 Lancer le dé</button>
                            </>
                        )}

                        {combatVictory && (
                            <div className={s.victoryContainer}>
                                <h2>🎉 Victoire !</h2>
                                <p>Vous avez éliminé tous vos ennemis !</p>
                                <div className={s.combatStats}>
                                    <p>🎲 Dernier lancer : <strong>{lastRoll}</strong></p>
                                </div>
                                <button className={s.button} onClick={handleContinueAfterVictory}>
                                    Continuer l&apos;aventure →
                                </button>
                            </div>
                        )}

                        {pendingDeath && !isDead && (
                            <button className={s.continueButton} onClick={() => {
                                setDeathTextId(pendingDeath);
                                setIsDead(true);
                                setPendingDeath(null);
                            }}>
                                Continuer
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
