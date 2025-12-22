'use client'

import React from 'react';
import {useRouter} from "next/navigation";
import s from "./style.module.css";

function Logout() {

    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");


        document.cookie = "token=; path=/; max-age=0";


        router.push("/auth");
    }

    return (

        <button className={s.logoutButton} onClick={handleLogout}> Se déconnecter</button>

    );
}

export default Logout;