"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Modal from "@/app/components/Modal/Modal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://unpredictable-backend.onrender.com';

export default function NewPlayerPage() {
    const router = useRouter();
    const [namePlayer, setNamePlayer] = useState("");
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    const handlePlayer = async () => {
        if (!namePlayer) {
            setModalMessage("Veuillez choisir un nom");
            setShowModal(true);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
           setModalMessage("Vous devez être connecté");
           setShowModal(true);
            router.push("/auth");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/players`, {
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
            {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
        </div>
    );
}
