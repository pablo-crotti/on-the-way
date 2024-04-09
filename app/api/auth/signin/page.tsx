"use client";
import { LoginButton } from "@/components/auth";
import AuthInput from "@/components/authInput";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const email = useRef("");
  const password = useRef("");
  const [error, setError] = useState(false);
  const [result, setResult] = useState<any>("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await signIn("credentials", {
      email: email.current,
      password: password.current,
      redirect: false,
    });
    if (response && response.error) {
      setError(true);
      setResult(response.error);
    } else if (response?.status === 200) {
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col h-full w-full pt-20 gap-12 items-center">
      <img src="/logo.svg" alt="WageWizard logo"></img>
      <h1 className="text-2xl font-bold text-white">Connexion</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center w-full gap-8"
      >
        <AuthInput
          type="text"
          name="email"
          placeholder="Adresse e-mail"
          onChange={(e) => (email.current = e.target.value)}
          error={false}
          icon="alternate_email"
          autocomplete="email"
        />
        <AuthInput
          type="password"
          name="password"
          placeholder="Mot de passe"
          onChange={(e) => (password.current = e.target.value)}
          error={false}
          icon="key_vertical"
          autocomplete="current-password"
        />
        {error ? <p className="text-red">{result}</p> : null}
        <LoginButton />
      </form>
    </div>
  );
}
