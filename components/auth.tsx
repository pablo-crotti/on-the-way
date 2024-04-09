"use client";

import { signOut } from "next-auth/react";

export const LoginButton = () => {
    return <button className="w-1/2 p-3 bg-white text-xl text-gray font-bold rounded-lg hover:bg-white/50 hover:text-white" type="submit">Connexion</button>;
};

export const LogoutButton = () => {
    return <button className="w-1/2 p-3 bg-white text-xl text-gray font-bold rounded-lg hover:bg-white/50 hover:text-white" onClick={() => signOut()}>Déconnexion</button>;
};