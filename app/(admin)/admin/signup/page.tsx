"use client";

/**
 * SignUpPage component handles user registration. It includes a form where users can enter
 * their registration details. Upon form submission, it sends these details to a server-side API.
 *
 * @component
 * @example
 * return (
 *   <SignUpPage />
 * )
 */
export default function SignUpPage() {
  /**
   * Handles the form submission event. Prevents the default form submission behavior.
   * It creates FormData from the form, sends it to the server-side signup API, and handles the response.
   * Alerts the user with the response text or an error message if the request fails.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form event triggered by submitting the form.
   */
  const handelSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    try {
      const response = await fetch(`/api/auth/signup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const responseData = await response.text();
      alert(responseData);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-darkbg-700 dark:border-darkbg-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-darkbg-900 md:text-2xl dark:text-white">
            Créer un nouvel utilisateur
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handelSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="bg-gray-50 border border-gray-300 text-darkbg-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-400 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
              >
                Confirmer email
              </label>
              <input
                id="confirm-email"
                type="email"
                name="confirmEmail"
                className="bg-gray-50 border border-gray-300 text-darkbg-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-400 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                placeholder="name@company.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Valider
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
