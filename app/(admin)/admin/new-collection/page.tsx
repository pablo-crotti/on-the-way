"use client";

import React from "react";
import { Title } from "@/components/title";
import PrimaryButton from "@/components/primarybutton";
import { useState } from "react";

export default function NewCollectionPage() {
  const generateRandomString = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handelSubmit = (event: any) => {
    event.preventDefault();

    const title = event.target.title.value;
    const illustration = event.target.illustration.files[0];
    const imgName = `${generateRandomString(10)}.${illustration.name
      .split(".")
      .pop()}`;

    if (!title || !illustration) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("illustration", illustration);
    formData.append("imgName", imgName);

    fetch("/api/collection", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Le fichier a été téléchargé avec succès !");
        } else {
          console.error("Erreur lors du téléchargement du fichier.");
        }
      })
      .catch((error) => {
        console.error("Une erreur s'est produite :", error);
      });
  };
  return (
    <div className="w-full h-full flex-col justify-center align-center p-4">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

      <Title type="h1">Nouvelle série</Title>
      <div className="flex justify-center">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-darkbg-800 dark:border-darkbg-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form className="space-y-4 md:space-y-6" onSubmit={handelSubmit}>
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nom de la série *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                  placeholder="Nom de la série"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="illustration"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Illustration *
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                  id="illustration"
                  type="file"
                  required
                />
              </div>

              <div className="flex justify-end">
                <PrimaryButton type="submit">Publier</PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
