"use client";

import React from "react";
import { Title } from "@/components/title";
import PrimaryButton from "@/components/primarybutton";
import { useState } from "react";

export default function NewCollectionPage() {
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState([0]);
  const [characterInfos, setCharacterInfos] = useState<any>([[""]]);
  const [places, setPlaces] = useState<any>([["", ""]]);
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

  const newCharacter = () => {
    setCharacter([...character, 0]);
    setCharacterInfos([...characterInfos, [""]]);
  };

  const handelCharacterInfos = (index: number) => {
    const value = (
      document.getElementById(
        `characterDescription${index}`
      ) as HTMLInputElement
    ).value;
    if (value === "") return;

    const newInfos = [...characterInfos];
    newInfos[index].push(value);
    setCharacterInfos(newInfos);
    (
      document.getElementById(
        `characterDescription${index}`
      ) as HTMLInputElement
    ).value = "";
  };

  const removeCharacter = (index: number) => {
    if (character.length === 1) {
      return;
    }
    const newInfos = characterInfos;
    newInfos.splice(index, 1);
    setCharacterInfos(newInfos);
    setCharacter(character.filter((_, i) => i !== index));
  };

  const deleteInfo = (index: number, i: number) => {
    const newInfos = [...characterInfos];
    newInfos[index].splice(i, 1);
    setCharacterInfos(newInfos);
  };

  const newPlace = () => {
    const newPlaces = [...places];

    const placeName = (document.getElementById("placeName") as HTMLInputElement)
      .value;

    const placeUrl = (document.getElementById("placesUrl") as HTMLInputElement)
      .value;

    newPlaces.push([placeName, placeUrl]);
    setPlaces(newPlaces);

    (document.getElementById("placeName") as HTMLInputElement).value = "";
    (document.getElementById("placesUrl") as HTMLInputElement).value = "";
  };

  const deletePlace = (index: number): void => {
    const newPlaces = [...places];
    newPlaces.splice(index, 1);
    setPlaces(newPlaces);
  };
  const handelSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true)

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
    formData.append("description", event.target.description.value);
    formData.append("illustration", illustration);
    formData.append("imgName", imgName);
    formData.append("places", JSON.stringify(places));

    console.log(event.target.document.files[0]);

    if (event.target.document.files[0]) {
      const document = event.target.document.files[0];
      formData.append("document", document);
      formData.append(
        "documentName",
        `${generateRandomString(10)}.${document.name.split(".").pop()}`
      );
    }

    let i = 0;
    character.forEach((_, index) => {
      const characterName = event.target[`characterName${index}`].value;
      const characterIllustration =
        event.target[`characterIllustration${index}`].files[0];
      const characterDescription = characterInfos[index];
      formData.append(`characterName${index}`, characterName);
      formData.append(`characterIllustration${index}`, characterIllustration);
      formData.append(
        `characterIllustrationName${index}`,
        `${generateRandomString(10)}.${characterIllustration.name
          .split(".")
          .pop()}`
      );
      formData.append(
        `characterDescription${index}`,
        JSON.stringify(characterDescription)
      );
      i++;
    });

    formData.append("indexSum", i.toString());

    fetch("/api/collection", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Le fichier a été téléchargé avec succès !");
          event.target.title.value = "";
          event.target.description.value = "";
          event.target.illustration.value = "";
          event.target.document.value = "";
          event.target.placeName.value = "";
          event.target.placesUrl.value = "";
          event.target.characterName0.value = "";
          event.target.characterIllustration0.value = "";
          event.target.characterDescription0.value = "";

          setCharacter([0]);
          setCharacterInfos([[""]]);
          setPlaces([["", ""]]);

          
          setLoading(false)
        } else {
          console.error(response)
          console.error("Erreur lors du téléchargement du fichier.");
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error("Une erreur s'est produite :", error);
        setLoading(false)
      });
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
        <div className="w-full h-full flex-col justify-center align-center p-4">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

          <Title type="h1">Nouvelle série</Title>
          <div className="flex justify-center">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-darkbg-800 dark:border-darkbg-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handelSubmit}
                >
                  <div>
                    <label
                      htmlFor="title"
                      className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
                    >
                      Nom de la série *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="bg-darkbg-50 border border-darkbg-300 text-darkbg-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                      placeholder="Nom de la série"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
                    >
                      Description de la série *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="block p-2.5 w-full text-sm text-darkbg-900 bg-darkbg-50 rounded-lg border border-darkbg-300 focus:ring-primary focus:border-primary dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                      placeholder="Découvret l'histoire insolite de..."
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="illustration"
                      className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
                    >
                      Illustration *
                    </label>
                    <input
                      className="block w-full text-sm text-darkbg-900 border border-darkbg-300 rounded-lg cursor-pointer bg-darkbg-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                      id="illustration"
                      type="file"
                      required
                    />
                  </div>

                  {character.map((_, index) => (
                    <div key={index} className="pt-8">
                      <div className="flex justify-between">
                        <Title type="h2">Personnage {index + 1}</Title>
                        {character.length > 1 && (
                          <button
                            type="button"
                            className="bg-red-700 rounded-md p-2 inline-flex items-center justify-center text-white hover:bg-red-500 focus:outline-none "
                            onClick={() => removeCharacter(index)}
                          >
                            <span className="sr-only">Delete</span>
                            <svg
                              className="h-6 w-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor={`characterName${index}`}
                          className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
                        >
                          Nom du personnage {index + 1} *
                        </label>
                        <input
                          type="text"
                          name={`characterName${index}`}
                          id={`characterName${index}`}
                          className="bg-darkbg-50 border border-darkbg-300 text-darkbg-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                          placeholder="Nom du personnage"
                          required
                        />
                      </div>
                      <div className="mt-6">
                        <label
                          htmlFor={`characterIllustration${index}`}
                          className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
                        >
                          Illustration personnage {index + 1} *
                        </label>
                        <input
                          className="block w-full text-sm text-darkbg-900 border border-darkbg-300 rounded-lg cursor-pointer bg-darkbg-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                          id={`characterIllustration${index}`}
                          type="file"
                          required
                        />
                      </div>
                      <div className="mt-6">
                        <label
                          htmlFor={`characterDescription${index}`}
                          className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
                        >
                          Description du personnage {index + 1}{" "}
                          {characterInfos[index].length === 1 ? "*" : ""}
                        </label>
                        <div className="flex gap-4">
                          <input
                            className="block w-full text-sm text-darkbg-900 border border-darkbg-300 rounded-lg cursor-pointer bg-darkbg-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                            id={`characterDescription${index}`}
                            name={`characterDescription${index}`}
                            type="text"
                            placeholder="Trait de personnalité"
                            required={characterInfos[index].length === 1}
                          />
                          <button
                            type="button"
                            onClick={() => handelCharacterInfos(index)}
                            className="text-white bg-darkbg-600 hover:bg-darkbg-700  focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                              />
                            </svg>

                            <span className="sr-only">Icon description</span>
                          </button>
                        </div>
                      </div>
                      <ul className="mt-6 max-w-md space-y-1 text-darkbg-500 list-disc list-inside dark:text-darkbg-400">
                        {characterInfos[index].map((value: any, i: number) =>
                          value == "" ? (
                            <span></span>
                          ) : (
                            <li key={index}>
                              {value}{" "}
                              <button
                                onClick={() => deleteInfo(index, i)}
                                className="text-red-700 ml-2 hover:text-red-600"
                              >
                                Retirer
                              </button>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <button
                      className="text-white bg-darkbg-600 hover:bg-darkbg-700 focus:outline-none focus:ring-0 font-medium rounded-full text-sm px-7 py-2.5 text-center me-2 mb-2"
                      type="button"
                      onClick={() => {
                        newCharacter();
                      }}
                    >
                      Nouveau personnage
                    </button>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="placeName"
                      className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
                    >
                      Lieux de l'épisode
                    </label>
                    <div className="flex gap-4">
                      <input
                        className="block w-full text-sm text-darkbg-900 border border-darkbg-300 rounded-lg cursor-pointer bg-darkbg-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                        id="placeName"
                        name="placeName"
                        type="text"
                        placeholder="Nom du lieu"
                      />
                      <input
                        className="block w-full text-sm text-darkbg-900 border border-darkbg-300 rounded-lg cursor-pointer bg-darkbg-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                        id="placesUrl"
                        name="placesUrl"
                        type="text"
                        placeholder="URL du lieu"
                      />
                      <button
                        type="button"
                        onClick={() => newPlace()}
                        className="text-white bg-darkbg-600 hover:bg-darkbg-700  focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>

                        <span className="sr-only">Icon description</span>
                      </button>
                    </div>
                  </div>

                  <ul className="mt-6 max-w-md space-y-1 text-darkbg-500 list-disc list-inside dark:text-darkbg-400">
                    {places.map((value: any, i: number) =>
                      value[0] == "" ? (
                        <span></span>
                      ) : (
                        <li key={i}>
                          {value[0]} :{" "}
                          <span className="text-blue-500">{value[1]}</span>{" "}
                          <button
                            onClick={() => deletePlace(i)}
                            className="text-red-700 ml-2 hover:text-red-600"
                          >
                            Retirer
                          </button>
                        </li>
                      )
                    )}
                  </ul>

                  <div>
                    <label
                      htmlFor="document"
                      className="block mb-2 text-sm font-medium text-darkbg-900 dark:text-white"
                    >
                      Document supplémentaire
                    </label>
                    <input
                      className="block w-full text-sm text-darkbg-900 border border-darkbg-300 rounded-lg cursor-pointer bg-darkbg-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                      id="document"
                      type="file"
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
      )}
    </>
  );
}
