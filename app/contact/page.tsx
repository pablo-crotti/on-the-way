"use client"

import { useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [object, setObject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/contact`, {
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
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="text-white font-bold">Contactez-nous</h1>
      <form className="flex flex-col w-3/5 gap-2" onSubmit={handleSubmit}>
        <label htmlFor="email" className="text-white">
          Email
        </label>
        <input
          type="text"
          placeholder="john.doe@mail.com"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="category" className="text-white">
          Sujet
        </label>
        <select
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">--Choix du sujet--</option>
          <option value="COMMENT">Commentaire</option>
          <option value="QUESTION">Question</option>
          <option value="PARTNERSHIP">Partenariat (entreprise)</option>
          <option value="LOCATION">Proposition de lieu (auditeur)</option>
          <option value="OTHER">Autre (champ libre)</option>
        </select>
        <label htmlFor="object" className="text-white">
          Objet
        </label>
        <input
          type="text"
          placeholder="Episode X..."
          name="object"
          required
          value={object}
          onChange={(e) => setObject(e.target.value)}
        />
        <label htmlFor="message" className="text-white">
          Message
        </label>
        <input
          type="text"
          placeholder="Concernant l'épisode X..."
          name="message"
          required
          className="mb-8"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="bg-white" disabled={submitting}>
          Envoyer
        </button>
      </form>
    </div>
  );
}
