"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCollectionPodcast } from "../../../../actions";
import { Title } from "@/components/title";
import { Text } from "@/components/text";
import { Foot } from "@/components/foot";
import { AudioPlayer } from "@/components/audioplayer/AudioPlayer";

export default function Page() {
  const collectionModel = {
    id: "",
    name: "",
    image: "",
    number: 0,
    createdAt: "",
    updatedAt: "",
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

  const [collection, setCollection] = useState(collectionModel);
  const [episodes, setEpisodes] = useState(episodesModel);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  const pathnameSlug = usePathname();
  const searchParams = useSearchParams().get("id");

  const regexSlug = /\/series\/([a-zA-Z0-9]+)/;
  const filterSlug = pathnameSlug.match(regexSlug);
  const slug = filterSlug ? filterSlug[1] : "";

  const constDeleteDscHTML = (str: string) => {
    return str.replace(/<[^>]*>/g, "");
  };

  const getCollection = () => {
    fetch(`/api/collection?id=${slug}`).then((res) =>
      res.json().then((data) => {
        setCollection(data);
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
      })
    );
  };

  function handleLoaded() {
    if (firstLoad) {
      setFirstLoad(false);
      if (searchParams) {
        setIndex(Number(searchParams) - 1);
      }
    }
    setLoading(false);
  }

  const getDate = (date: number) => {
    const newDate = new Date(date * 1000);
    return newDate.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

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
          <div className="flex justify-center">
            <img
              className="mb-2 w-full max-w-screen-sm"
              src={episodes[index].logo}
              alt="Image de l'épisode"
            />
          </div>
          <h1 className="text-xl mb-4 font-bold max-w-2xl m-auto text-left leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white ">
            Épisode {episodes[index].title}
          </h1>
          <div className="flex justify-between items-center max-w-2xl m-auto">
            <div className="flex justify-start gap-1 items-center">
              <img
                className="mb-2 w-10"
                src={episodes[index].logo}
                alt="Image de l'épisode"
              />
              <p className="text-left text-xs font-bold text-gray-900 dark:text-white">
                {collection.name}
              </p>
            </div>
            <p className="text-left text-xs text-gray-900 dark:text-white">{getDate(episodes[index].publish_time)}</p>
          </div>

          <div className="flex justify-center ">
            {index == 0 ? (
              <button disabled className="text-secondary">
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIndex(index - 1);
                  setLoading(true);
                }}
                className="text-primary"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </button>
            )}
            {episodes &&
              episodes.map((episode, i) => (
                <button
                  className="flex items-center p-0"
                  key={i}
                  onClick={() => {
                    setIndex(i);
                    setLoading(true);
                  }}
                >
                  {i == index ? (
                    <Foot active={true} />
                  ) : (
                    <Foot active={false} />
                  )}
                </button>
              ))}
            {index == episodes.length - 1 ? (
              <button disabled className="text-secondary">
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIndex(index + 1);
                  setLoading(true);
                }}
                className="text-primary"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </button>
            )}
          </div>

          <h2 className="text-xl max-w-xl m-auto mb-4 font-bold text-left leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white ">Résumé</h2>
          <p className="text-left max-w-xl m-auto text-xs text-gray-900 dark:text-white mb-4">{episodes[index].content}</p>
        </div>
      )}
      <div className={loading ? "invisible" : ""}>
        <AudioPlayer
          episodeSource={episodes[index].media_url}
          onAudioLoaded={handleLoaded}
        />
      </div>
    </div>
  );
}
