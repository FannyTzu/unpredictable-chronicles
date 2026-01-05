"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function NewPlayerPage() {
    const router = useRouter();
    const [namePlayer, setNamePlayer] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePlayer = async () => {
        if (!namePlayer) {
            alert("Veuillez choisir un nom");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vous devez être connecté");
            router.push("/auth");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("https://unpredictable-backend.onrender.com/players", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({name: namePlayer}),
            });

            if (!res.ok) {
                throw new Error("Erreur création player");
            }

            const player = await res.json();

            console.log("Player créé :", player);

            router.push('/');

        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Créer votre personnage</h1>

            <input
                type="text"
                placeholder="Choisissez votre nom"
                value={namePlayer}
                onChange={(e) => setNamePlayer(e.target.value)}
            />

            <button onClick={handlePlayer} disabled={loading}>
                {loading ? "Création..." : "Lancer la partie"}
            </button>
        </div>
    );
}
