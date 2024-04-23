"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCollectionPodcast } from "../../../actions";
import { Title } from "@/components/title";
import { Text } from "@/components/text";
import { Accordion } from "@/components/accordion";

export default function Page() {
  const collectionModel = {
    name: "",
    image: "",
    number: 0,
    description: "",
    places: [],
    document: "",
  };

  const episodesModel = [
    {
      id: "",
      podcast_id: "",
      title: "",
      content: "",
      logo: "",
      media_url: "",
      player_url: "",
      permalink_url: "",
      publish_time: 0,
      status: "",
      type: "",
      duration: 0,
      season_number: 0,
      episode_number: 0,
      apple_episode_type: "",
      transcripts_url: null,
      content_explicit: "",
      object: "",
    },
  ];

  const charactersModel = [
    {
      name: "",
      image: "",
      description: [],
    },
  ];

  const [collection, setCollection] = useState(collectionModel);
  const [episodes, setEpisodes] = useState(episodesModel);
  const [characters, setCharacters] = useState(charactersModel);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const secondsToMinutes = (seconds: number) => {
    return new Date(seconds * 1000).getMinutes();
  };

  const getCharacters = (collectionId: string) => {
    fetch(`/api/characters?collection=${collectionId}`).then((res) =>
      res.json().then((data) => {
        setCharacters(data);
        const tempCharacters: {
          name: string;
          description: any;
          image: string;
        }[] = [];
        data.forEach((character: any) => {
          const tempCharacter = {
            name: character.name,
            description: JSON.parse(character.description[0]),
            image: character.image,
          };
          tempCharacters.push(tempCharacter);
        });
        setCharacters(tempCharacters);
      })
    );
  };

  const getCollection = () => {
    fetch(`/api/collection?id=${slug}`).then((res) =>
      res.json().then((data) => {
        const tempCollection = {
          name: data.name,
          image: data.image,
          number: data.number,
          description: data.description,
          places: JSON.parse(data.places[0]),
          document: data.document,
        };
        setCollection(tempCollection);

        fetchCollectionPodcast(data.number).then((episodesData) => {
          episodesData.forEach((episode: any, index: number) => {
            if (episode.status === "draft") {
              episodesData.splice(index, 1);
            }
          });
          setEpisodes(
            episodesData as {
              id: string;
              podcast_id: string;
              title: string;
              content: string;
              logo: string;
              media_url: string;
              player_url: string;
              permalink_url: string;
              publish_time: number;
              status: string;
              type: string;
              duration: number;
              season_number: number;
              episode_number: number;
              apple_episode_type: string;
              transcripts_url: null;
              content_explicit: string;
              object: string;
            }[]
          );
        });

        getCharacters(data.id);
        setLoading(false);
      })
    );
  };

  useEffect(() => {
    getCollection();
  }, []);
  return (
    <div>
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <img
            className="w-64 h-64"
            src="/loader/loader.gif"
            alt="Chargement..."
          />
        </div>
      ) : (
        <div className="p-4">
          <Title type="h1">{collection.name}</Title>
          <div className="mb-6">
            <Text>{collection.description}</Text>
          </div>
          <div className="mb-6">
            <Text>
              La série sera composée de 6 épisodes et chaque épisode sortira le
              lundi aux alentours de 7h30. Ne ratez donc aucun épisode !!
            </Text>
          </div>
          <div className="flex justify-center">
          <img className="w-full md:max-w-md" src={`/illustrations/${collection.image}`} />
          </div>
          <Accordion title="Épisodes" open={true}>
            {episodes.map((episode, index) => (
              <div key={index} className="mb-4 flex justify-center">
                <a
                  href={`/series/${slug}/episodes?id=${episode.episode_number}`}
                  className="flex items-center w-full bg-white border border-darkbg-200 rounded-lg shadow flex-row md:max-w-xl hover:bg-darkbg-100 dark:border-darkbg-700 dark:bg-darkbg-800 dark:hover:bg-darkbg-700"
                >
                  <img
                    className="object-cover h-full w-1/3 rounded-none rounded-s-lg"
                    src={episode.logo}
                    alt="Pochette épisode"
                  />
                  <div className="w-full flexflex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-l text-left font-bold tracking-tight text-darkbg-900 dark:text-white">
                      {episode.title}
                    </h5>
                    <div className="w-full flex justify-between">
                      <p className="text-darkbg-400">
                        Série {episode.season_number}, Épisode{" "}
                        {episode.episode_number}
                      </p>
                      <p className="text-right text-darkbg-400">
                        {secondsToMinutes(episode.duration)}min
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </Accordion>
          <Accordion title="Personnages" open={false}>
            {characters.map((character, index) => (
              <div key={index} className="mb-4 flex justify-center">
                <div className="flex items-center w-full bg-white border border-darkbg-200 rounded-lg shadow flex-row md:max-w-xl hover:bg-darkbg-100 dark:border-darkbg-700 dark:bg-darkbg-800 dark:hover:bg-darkbg-700">
                  <img
                    className="object-cover h-full w-1/3 rounded-none rounded-s-lg"
                    src={`/illustrations/${character.image}`}
                    alt="Pochette épisode"
                  />
                  <div className="w-full flexflex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-l text-left font-bold tracking-tight text-darkbg-900 dark:text-white">
                      {character.name}
                    </h5>
                    <div className="w-full">
                      <ul className="max-w-md space-y-1 text-darkbg-500 list-disc list-inside dark:text-darkbg-400">
                        {character.description.map((desc: any, index) => {
                          return desc ? <li key={index}>{desc}</li> : null;
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Accordion>
          <Accordion title="Lieux" open={false}>
            <ul className="max-w-md space-y-1 text-darkbg-500 list-disc list-inside dark:text-darkbg-400">
              {collection.places.map(
                (place, index) =>
                  place[1] && (
                    <li key={index}>
                      <a
                        className="text-primary underline hover:text-secondary"
                        href={place[1]}
                        target="_blank"
                      >
                        {place[0]}
                      </a>
                    </li>
                  )
              )}
            </ul>
          </Accordion>
          {collection.document && (
            <Accordion title="Document" open={false}>
              <a
                className="text-primary underline hover:text-secondary"
                href={`/documents/${collection.document}`}
                target="_blank"
              >
                Infos supplémentaires
              </a>
            </Accordion>
          
          )}
        </div>
      )}
    </div>
  );
}
