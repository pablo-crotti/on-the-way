"use client";
import { fetchPodcasts, updatePodcast } from "../../../actions";
import { useState, useEffect } from "react";

export default function EpisodesPage() {
  const [loading, setLoading] = useState(true);
  const [episodes, setEpisodes] = useState<
    {
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
  >([]);

  const [collections, setCollections] = useState<
    {
      id: string;
      name: string;
      image: string;
      number: number;
    }[]
  >([]);

  const getCollectionName = (number: number) => {
    const collection = collections.find(
      (collection) => collection.number === number
    );
    return collection?.name || "";
  };

  const changeEpisodeStatus =
    (episode: {
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
    }) =>
    async (event: any) => {
      setLoading(true);
      switch (event.target.checked) {
        case true:
          episode.status = "publish";
          break;
        case false:
          episode.status = "draft";
          break;
      }

      await updatePodcast(episode);
      fetchPodcasts().then((episodesData) => {
        setEpisodes(episodesData);
        setLoading(false);
      });
    };

  useEffect(() => {
    fetchPodcasts().then((episodesData) => {
      setEpisodes(episodesData);
      setLoading(false);
    });

    fetch("/api/collection?all=true", {}).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setCollections(data);
        });
      }
    });
  }, []);

  return (
    <div className="container mx-auto min-h-screen">
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <img
            className="w-64 h-64"
            src="/loader/loader.gif"
            alt="Chargement..."
          />
        </div>
      ) : (
        <>
          <h1 className="text-xl mb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white ">
            Liste des épisodes
          </h1>
          <div className="grid grid-cols-1 gap-4">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row  dark:border-gray-700 dark:bg-gray-800"
              >
                <img
                  className="object-cover w-full rounded-t-lg h-full  md:min-w-48 md:max-w-48 md:rounded-none md:rounded-s-lg"
                  src={episode.logo}
                  alt={episode.title}
                />
                <div className="w-full flex flex-col justify-between p-4 leading-normal">
                  <span className="bg-secondary mb-4 w-max text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                    {getCollectionName(episode.season_number)}
                  </span>

                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {episode.title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {episode.content}
                  </p>
                  <div className="w-full flex justify-between items-start mt-4">
                    <div>
                      <label className="inline-flex items-center mb-5 cursor-pointer">
                        <input
                          name="publish"
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                          checked={episode.status === "publish"}
                          onChange={changeEpisodeStatus(episode)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer dark:bg-darkbg-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-darkbg-600 peer-checked:bg-primary"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Épisode publié
                        </span>
                      </label>
                    </div>
                    <a
                      href={`/admin/episodes/${episode.id}`}
                      className="flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white hover:cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
