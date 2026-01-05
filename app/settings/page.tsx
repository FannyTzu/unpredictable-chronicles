'use client'
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import Logout from "@/app/components/Logout/Logout";
import s from './style.module.css'
import {RotateCcw, Trash2, UserRoundX, Pencil, Save, Undo2} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unpredictable-backend.onrender.com';

type Player = {
    id: number;
    name: string;
};

function SettingsPage() {

    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState("");

    const router = useRouter();

    const handleBackHome = () => {
        router.replace('/')
    }

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.replace("/auth");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/players/me`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (!res.ok) {
                    localStorage.removeItem("token");
                    router.replace("/auth");
                    return;
                }

                const data = await res.json();
                setPlayer(data);
            } catch (err) {
                console.error("Erreur lors de la vérification d'auth:", err);
                router.replace("/auth");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [router]);

    const handleUpdateName = async () => {
        if (!player || !newName.trim()) return;


        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(
                `${API_URL}/players/${player.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({name: newName}),
                }
            );

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || "Erreur mise à jour");
                return;
            }

            const data = await res.json();
            setPlayer(data);
            setNewName(data.name);
            setEditing(false);
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    };

    const handleResetGame = async () => {
        if (!player) return;

        if (!confirm("Êtes-vous sûr de vouloir recommencer votre partie ? Cette action est irréversible.")) {
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(
                `${API_URL}/players/${player.id}/reset`,
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

            router.replace("/");

        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    }

    const handleDeletePlayer = async () => {
        if (!player) return;

        // prevoir de créér modal pour toutes les alertes
        if (!confirm("Êtes-vous sûr de vouloir supprimer votre partie ? Cette action est irréversible.")) {
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(
                `${API_URL}/players/${player.id}`,
                {
                    method: "DELETE",
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

            localStorage.removeItem("token");
            router.replace("/auth");

        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    };

    const handleDeleteUser = async () => {
        if (!player) return;

        if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? " +
            "Cette action est irréversible et supprimera votre partie et votre compte.")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/auth/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la suppression du compte');
            }

            alert('Votre compte a été supprimé avec succès');

            localStorage.removeItem('token');

            router.replace("/auth");

        } catch (error) {
            console.error('Erreur suppression compte:', error);
            alert('Erreur lors de la suppression du compte : ');
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (!player) return <p>Utilisateur non connecté</p>;

    return (
        <div className={s.page}>
            <div className={s.container}>
                <h2 className={s.title}>Paramètres</h2>

                <div className={s.playerBlock}>
                    {editing ? (
                        <>
                            <input

                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <button className={s.editButton} onClick={handleUpdateName}><Save size={16}/></button>
                            <button className={s.editButton} onClick={() => setEditing(false)}><Undo2 size={16}/>
                            </button>
                        </>
                    ) : (
                        <>
                            <span className={s.playerName}>{player.name}</span>
                            <button className={s.editButton}
                                    onClick={() => {
                                        setNewName(player.name);
                                        setEditing(true);
                                    }}
                            ><Pencil/>
                            </button>
                        </>
                    )}
                </div>

                <div className={s.playerBlock}><span className={s.playerName}>Supprimer ma partie </span>
                    <button className={s.editButton} onClick={handleDeletePlayer}><Trash2/></button>
                </div>

                <div className={s.playerBlock}><span className={s.playerName}>Recommencer ma partie</span>
                    <button className={s.editButton} onClick={handleResetGame}><RotateCcw/></button>
                </div>
                <div className={s.playerBlock}><span className={s.playerName}>Supprimer mon compte</span>
                    <button className={s.editButton} onClick={handleDeleteUser}><UserRoundX/></button>
                </div>
                <div className={s.actions}>
                    <button className={s.editButton} onClick={handleBackHome}>Retour dans l&apos;aventure</button>
                    <Logout/>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;