"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import s from "./style.module.css";

export default function AuthPage() {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const toggleMode = () => setIsLogin(!isLogin);

    const handleAuth = async () => {
        if (!email || !password) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);
        const endpoint = isLogin ? "login" : "register";

        try {
            const res = await fetch(`http://localhost:3001/auth/${endpoint}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Erreur lors de la requête");
                setLoading(false);
                return;
            }

            if (isLogin) {
                localStorage.setItem("token", data.token);
                alert("Connexion réussie !");
                router.push("/");
            } else {
                alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.container}>
            <h2>{isLogin ? "Connexion" : "Créer un compte"}</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleAuth} disabled={loading}>
                {loading ? "En cours..." : isLogin ? "Se connecter" : "S'inscrire"}
            </button>

            <div className={s.toggle}>
                {isLogin ? "Pas encore inscrit ?" : "Vous avez déjà un compte ?"}{" "}
                <button onClick={toggleMode}>
                    {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
            </div>
        </div>
    );
}
