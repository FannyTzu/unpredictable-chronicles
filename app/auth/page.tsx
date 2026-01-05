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
    const [error, setError] = useState<string | null>(null);

    const passwordRules = [
        {label: "8 caractères minimum", test: (p: string) => p.length >= 8},
        {label: "Une majuscule", test: (p: string) => /[A-Z]/.test(p)},
        {label: "Une minuscule", test: (p: string) => /[a-z]/.test(p)},
        {label: "Un chiffre", test: (p: string) => /[0-9]/.test(p)},
        {label: "Un caractère spécial", test: (p: string) => /[^A-Za-z0-9]/.test(p)},
    ];

    const toggleMode = () => setIsLogin(!isLogin);

    const handleAuth = async () => {
        setError(null);

        if (!email || !password) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);
        const endpoint = isLogin ? "login" : "register";

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${endpoint}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data?.errors?.[0]?.message || data.message || "Erreur inconnue");
                return;
            }

            if (isLogin) {
                localStorage.setItem("token", data.token);
                document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
                router.push("/");
            } else {
                setIsLogin(true);
            }
        } catch (err) {
            setError("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };


    return (

        <div className={s.page}>
            <div className={s.container}>
                <h2 className={s.title}>
                    {isLogin ? "Connexion" : "Créer un compte"}
                </h2>

                <div className={s.form}>
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
                    {!isLogin && (
                        <ul className={s.passwordHints}>
                            {passwordRules.map(rule => (
                                <li
                                    key={rule.label}
                                    className={rule.test(password) ? s.valid : s.invalid}
                                >
                                    {rule.label}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button onClick={handleAuth} disabled={loading}>
                        {loading ? "En cours..." : isLogin ? "Se connecter" : "S'inscrire"}
                    </button>
                </div>

                <div className={s.toggle}>
                <span>
                    {isLogin ? "Pas encore inscrit ?" : "Vous avez déjà un compte ?"}
                </span>
                    <button onClick={toggleMode}>
                        {isLogin ? "Créer un compte" : "Se connecter"}
                    </button>
                </div>
            </div>
        </div>
    )
}