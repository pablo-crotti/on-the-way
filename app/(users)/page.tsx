"use client";

import { useState, useEffect } from "react";
import { Title } from "@/components/title";
import { Text } from "@/components/text";
import { fetchPodcasts } from "../actions";

export default function Home() {
  const collectionModel = {
    id: "",
    name: "",
    image: "",
    number: 0,
    createdAt: "",
    updatedAt: "",
  };
  const [lastCollection, setLastCollection] = useState(collectionModel);

  const getLastCollection = () => {
    fetch("/api/collection").then((res) =>
      res.json().then((data) => setLastCollection(data))
    );
  };


  useEffect(() => {
    getLastCollection();
  }, []);

  // console.log(lastCollection)

  return (
    <>
      <div>
        <Title type="h1">PODCAST</Title>
        <img src="/logo/on-the-way.png" alt="podcast" />
      </div>

      <div className="mb-8 flex justify-center">
        <a
          href={`/series/${lastCollection.id}`}
          className="flex items-center bg-white border border-gray-200 rounded-lg shadow flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <img
            className="object-cover h-auto w-1/3 rounded-none rounded-s-lg"
            src={`/illustrations/${lastCollection.image}`}
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-l text-left font-bold tracking-tight text-gray-900 dark:text-white">
              {lastCollection.name}
            </h5>
            <div>
              
            </div>
          </div>
        </a>
      </div>
      <div className="mb-8">
        <Title type="h2">À propos</Title>
        <Text>
          Vous vous trouvez sur le site dédié au podcast On The Way qui a pour
          objectif de vous faire découvrir la ville d'Yverdon-les-Bains. Venez
          donc découvrir les lieux de la ville, son histoire, ses événements et
          plus encore à travers une histoire fictive de 5 épisodes
        </Text>
      </div>

      <div className="mb-8">
        <Title type="h2">Publication</Title>
        <Text>
          Le podcast sera composé de 8 épisodes pour la première saison et
          chaque épisode sortira le lundi aux alentours de 7h30. Ne ratez donc
          aucun épisode !!
        </Text>
      </div>
    </>
  );
}
