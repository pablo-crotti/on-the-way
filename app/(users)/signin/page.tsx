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
  const [loading, setLoading] = useState(false);

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const target = e.target as HTMLFormElement;
    const response = await signIn("credentials", {
      email: target.email.value,
      password: target.password.value,
      redirect: false,
    });
    if (response && response.error) {
      setLoading(false);
      setError(true);
      setResult(response.error);
    } else if (response?.status === 200) {
      router.replace("/admin");
      router.refresh();
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <img
            className="w-64 h-64"
            src="/loader/loader.gif"
            alt="Chargement..."
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Connexion
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handelSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    onChange={(e) => (email.current = e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => (password.current = e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Valider
                </button>
                {error && (
                  <div className="text-red-500 text-center">{result}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
