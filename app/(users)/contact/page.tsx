"use client";
import { useState } from "react";
import { Title } from "@/components/title";

/**
 * `ContactPage` component provides a form for users to submit contact messages. It manages form state,
 * submission status, and handles the post-submission logic. The form allows users to input their email,
 * select a category, set a subject (object), and write a message.
 *
 * @component
 * @example
 * return (
 *   <ContactPage />
 * )
 */
export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [object, setObject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /**
   * Handles the form submission event. Submits the contact form data to the server via POST request.
   * If the submission is successful, it clears the form and sets a submitted state to true.
   * If there is an error, it alerts the user with the error message.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form event triggered by submitting the form.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch(`/api/contact`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      setEmail("");
      setCategory("");
      setObject("");
      setMessage("");
      setSubmitted(true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <div>Votre message a été envoyé avec succès!</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-darkbg-800 dark:border-darkbg-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <Title type="h1">Contact</Title>
          <p className="text-base text-center text-darkbg-900 dark:text-white">
            Contactez-nous via ce formulaire de contact.
          </p>
          <h1 className="text-white font-bold">Contactez-nous</h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="text"
                placeholder="john.doe@mail.com"
                name="email"
                required
                value={email}
                className="bg-darkbg-50 border border-darkbg-300 text-darkbg-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
              >
                Sujet
              </label>
              <select
                name="category"
                required
                value={category}
                className="bg-darkbg-50 border border-darkbg-300 text-darkbg-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">--Choix du sujet--</option>
                <option value="COMMENT">Commentaire</option>
                <option value="QUESTION">Question</option>
                <option value="PARTNERSHIP">Partenariat (entreprise)</option>
                <option value="LOCATION">Proposition de lieu (auditeur)</option>
                <option value="OTHER">Autre (champ libre)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="object"
                className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
              >
                Objet
              </label>
              <input
                type="text"
                placeholder="Episode X..."
                name="object"
                required
                className="bg-darkbg-50 border border-darkbg-300 text-darkbg-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                value={object}
                onChange={(e) => setObject(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
              >
                Message
              </label>
              <textarea
                placeholder="Concernant l'épisode X..."
                name="message"
                required
                className="bg-darkbg-50 border border-darkbg-300 text-darkbg-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white bg-primary hover:bg-primarydark focus:outline-none focus:ring-0 font-medium rounded-full text-sm px-7 py-2.5 text-center me-2 mb-2"
                disabled={submitting}
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
