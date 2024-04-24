"use client";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fetchPodcast,
  updatePodcast,
  storeOnAmazon,
  fetchPresignedAmazonUrl,
} from "../../../../actions";
import PrimaryButton from "@/components/primarybutton";

/**
 * `Page` component serves as an episode management page where users can update podcast episode details.
 * It handles file uploads for episode illustrations and audio, and updates episode metadata such as title and content.
 * The component fetches initial episode data based on the URL slug and allows for updating it.
 *
 * @component
 * @example
 * return (
 *   <Page />
 * )
 */
export default function Page() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  /**
   * Generates a random identifier to be used in file names to ensure uniqueness.
   *
   * @returns {string} A unique random identifier.
   */
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  /**
   * Handles form submission for updating episode details. It processes any new media files uploaded,
   * fetches presigned URLs for them, uploads the files to Amazon S3, and updates the episode's metadata.
   * It handles different scenarios based on the files provided.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form event triggered by submitting the update form.
   */
  const handelSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    if (event.target.illustration.files[0] && event.target.audio.files[0]) {
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

      const updatedEpisode = {
        id,
        title: title,
        content: content,
        status: status,
        type: type,
        logo_key: imageWithPresignedUrl.file_key,
        media_key: audioFileWithPresignedUrl.file_key,
      };

      updatePodcast(updatedEpisode).then(() => {
        setLoading(false);
      });
    } else if (event.target.illustration.files[0]) {
      const imageExtension = event.target.illustration.files[0].name
        .split(".")
        .pop();
      const imageTitle = `${event.target.title.value
        .replaceAll(" ", "")
        .replaceAll(":", "")
        .replaceAll("'", "")
        .toLowerCase()}_${generateId()}.${imageExtension}`;

      const image = {
        filename: imageTitle,
        filesize: event.target.illustration.files[0].size,
        content_type: event.target.illustration.files[0].type,
      };

      const imageUrlData = await fetchPresignedAmazonUrl(image);

      if (!imageUrlData) {
        console.error("Failed to get presigned URLs");
        return;
      }

      const imageWithPresignedUrl = {
        ...image,
        presigned_url: imageUrlData[0],
        file_key: imageUrlData[1],
      };
      const imageFormData = new FormData();
      imageFormData.append("file", event.target.illustration.files[0]);

      await storeOnAmazon(imageFormData, imageUrlData[0]);

      const updatedEpisode = {
        id,
        title: title,
        content: content,
        status: status,
        type: type,
        logo_key: imageWithPresignedUrl.file_key,
      };

      updatePodcast(updatedEpisode).then(() => {
        setLoading(false);
      });
    } else if (event.target.audio.files[0]) {
      const audioFileExtension = event.target.audio.files[0].name
        .split(".")
        .pop();
      const audioFileTitle = `${event.target.title.value
        .replaceAll(" ", "")
        .replaceAll(":", "")
        .replaceAll("'", "")
        .toLowerCase()}_${generateId()}.${audioFileExtension}`;

      const audioFile = {
        filename: audioFileTitle,
        filesize: event.target.audio.files[0].size,
        content_type: event.target.audio.files[0].type,
      };

      const audioUrlData = await fetchPresignedAmazonUrl(audioFile);

      if (!audioUrlData) {
        console.error("Failed to get presigned URLs");
        return;
      }

      const audioFileWithPresignedUrl = {
        ...audioFile,
        presigned_url: audioUrlData[0],
        file_key: audioUrlData[1],
      };

      const audioFileFormData = new FormData();
      audioFileFormData.append("file", event.target.audio.files[0]);

      await storeOnAmazon(audioFileFormData, audioUrlData[0]);

      const updatedEpisode = {
        id,
        title: title,
        content: content,
        status: status,
        type: type,
        media_key: audioFileWithPresignedUrl.file_key,
      };

      updatePodcast(updatedEpisode).then(() => {
        setLoading(false);
      });
    } else {
      const updatedEpisode = {
        id,
        title: title,
        content: content,
        status: status,
        type: type,
      };

      updatePodcast(updatedEpisode).then(() => {
        setLoading(false);
      });
    }
  };

  // Effect to fetch and set initial episode data based on the slug.
  useEffect(() => {
    if (!slug) {
      redirect("/admin/episodes");
    }
    fetchPodcast(slug ?? "").then((data) => {
      setId(data.episode.id);
      setTitle(data.episode.title);
      setContent(data.episode.content);
      setStatus(data.episode.status);
      setType(data.episode.type);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="w-full h-full flex-col justify-center align-center p-4">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
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
          <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-darkbg-900 md:text-2xl dark:text-white  mb-10">
            Mettre à jour l'épisode{" "}
            <span className="text-primary">{title}</span>
          </h1>
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
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Titre du podcast *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
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
                      Ajouter une nouvelle illustration
                    </label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                      id="illustration"
                      type="file"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="audio"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Ajouter un nouveau fichier audio
                    </label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-darkbg-400 focus:outline-none dark:bg-darkbg-700 dark:border-darkbg-600 dark:placeholder-darkbg-400"
                      id="audio"
                      type="file"
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center mb-5 cursor-pointer">
                      <input
                        name="publish"
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={status === "publish"}
                        onChange={() =>
                          setStatus(status === "publish" ? "draft" : "publish")
                        }
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer dark:bg-darkbg-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-darkbg-600 peer-checked:bg-primary"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Épisode publié
                      </span>
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <PrimaryButton type="submit">Mettre à jour</PrimaryButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
