"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Suspense } from "react";

/**
 * `SignUpConfirmPage` wraps the `SignUpConfirmContent` component within a Suspense fallback.
 * This component handles the user signup confirmation process. If the necessary token is not
 * found in the URL parameters, the user is redirected to the signin page.
 *
 * @component
 * @example
 * return (
 *   <SignUpConfirmPage />
 * )
 */
export default function SignUpConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpConfirmContent />
    </Suspense>
  );
}

/**
 * `SignUpConfirmContent` component uses the token from URL search parameters to fetch user data
 * and confirm their registration. If the token is valid, it completes the registration process;
 * otherwise, it redirects to the signin page. It handles both the initial fetching of user data
 * based on the token and the final submission of the confirmation.
 *
 * @component
 */
function SignUpConfirmContent() {
  const router = useRouter();
  const token = useSearchParams().get("token");

  // Redirects to signin if the token is missing or invalid
  if (!token) {
    router.replace("/signin");
  }

  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Fetches user data using the provided token
  const request = fetch(`/api/auth/register?token=${token}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.id) router.replace("/signin");
      if (!data.email) router.replace("/signin");
      setUserId(data.id);
      setUserEmail(data.email);
    });

  /**
   * Handles the form submission for user registration confirmation.
   * Submits user data and redirects based on the response from the server.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form event triggered by submitting the form.
   */
  const handelSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    formData.append("id", userId);

    try {
      const response = await fetch("/api/auth/register", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 404) {
          router.replace("/signin");
        }
        throw new Error(response.statusText);
      } else {
        router.replace("/admin");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Créez votre mot de passe
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
                type="email"
                name="email"
                id="email"
                placeholder="name@company.com"
                required
                disabled
                defaultValue={userEmail}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                placeholder="••••••••"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirm-password"
                placeholder="••••••••"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              S'enregistrer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
