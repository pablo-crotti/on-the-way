"use client";

import PrimaryButton from "@/components/primarybutton";
import { useEffect, useState } from "react";
import {
  fetchPresignedAmazonUrl,
  storeOnAmazon,
  publishPodcast,
  fetchCollectionPodcast,
} from "@/app/actions";

export default function NewEpisodePage() {
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handelSubmit = async (event: any) => {
    event.preventDefault();

    const imageExtension = event.target.illustration.files[0].name
      .split(".")
      .pop();
    const imageTitle = `${event.target.title.value
      .replaceAll(" ", "")
      .replaceAll(":", "")
      .replaceAll("'", "")
      .toLowerCase()}_${generateId()}.${imageExtension}`;

    const audioFileExtension = event.target.audio.files[0].name
      .split(".")
      .pop();
    const audioFileTitle = `${event.target.title.value
      .replaceAll(" ", "")
      .replaceAll(":", "")
      .replaceAll("'", "")
      .toLowerCase()}_${generateId()}.${audioFileExtension}`;

    console.log(event.target.illustration.files[0]);
    console.log(event.target.audio.files[0]);

    const image = {
      filename: imageTitle,
      filesize: event.target.illustration.files[0].size,
      content_type: event.target.illustration.files[0].type,
    };

    const audioFile = {
      filename: audioFileTitle,
      filesize: event.target.audio.files[0].size,
      content_type: event.target.audio.files[0].type,
    };

    const imageUrlData = await fetchPresignedAmazonUrl(image);
    const audioUrlData = await fetchPresignedAmazonUrl(audioFile);

    if (!imageUrlData || !audioUrlData) {
      console.error("Failed to get presigned URLs");
      return;
    }

    const imageWithPresignedUrl = {
      ...image,
      presigned_url: imageUrlData[0],
      file_key: imageUrlData[1],
    };
    const audioFileWithPresignedUrl = {
      ...audioFile,
      presigned_url: audioUrlData[0],
      file_key: audioUrlData[1],
    };

    const imageFormData = new FormData();
    imageFormData.append("file", event.target.illustration.files[0]);

    const audioFileFormData = new FormData();
    audioFileFormData.append("file", event.target.audio.files[0]);

    await storeOnAmazon(imageFormData, imageUrlData[0]);
    await storeOnAmazon(audioFileFormData, audioUrlData[0]);

    event.preventDefault();

    let status = "";
    switch (event.target.publish.checked) {
      case true:
        status = "publish";
        break;
      case false:
        status = "draft";
        break;
    }

    const collectionNumber = event.target.collection.value as number;

    fetchCollectionPodcast(+collectionNumber).then((episodesData) => {
      const episodeNumber = episodesData.length + 1;

      const episode = {
        title: event.target.title.value,
        content: event.target.description.value,
        status: status,
        type: "public",
        logo_key: imageWithPresignedUrl.file_key,
        media_key: audioFileWithPresignedUrl.file_key,
        season_number: event.target.collection.value,
        episode_number: episodeNumber,
      };

      const simpleEpisode = Object.assign({}, episode);

      publishPodcast(simpleEpisode);
    });
  };

  const [collections, setCollections] = useState({});

  const getCollections = () => {
    fetch(`/api/collection?all=true}`).then((res) =>
      res.json().then((data) => {
        setCollections(data);
      })
    );
  };
  useEffect(() => {
    getCollections();
  }, []);
  return (
    <div className="w-full h-full flex-col justify-center align-center p-4">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

      <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-darkbg-900 md:text-2xl dark:text-white  mb-10">
        Publier un épisode
      </h1>
      <div className="flex justify-center">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-darkbg-800 dark:border-darkbg-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form className="space-y-4 md:space-y-6" onSubmit={handelSubmit}>
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Titre du podcast *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                  placeholder="Episode 1: Introduction"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description du podcast *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                  placeholder="Découvret l'histoire insolite de..."
                  required
                ></textarea>
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
              <div>
                <label
                  htmlFor="audio"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Épisode *
                </label>
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                  id="audio"
                  type="file"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="collection"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Choisir une saison *
                </label>
                <select
                  id="collection"
                  name="collection"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                >
                  {collections &&
                    Array.isArray(collections) &&
                    collections.map((collection: any) => (
                      <option key={collection.id} value={collection.number}>
                        Série no. {collection.number} | {collection.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="inline-flex items-center mb-5 cursor-pointer">
                  <input
                    name="publish"
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer dark:bg-darkbg-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-darkbg-600 peer-checked:bg-primary"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Toggle me
                  </span>
                </label>
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
