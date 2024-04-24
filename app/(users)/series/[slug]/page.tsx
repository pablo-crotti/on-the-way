"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCollectionPodcast } from "../../../actions";
import { Title } from "@/components/title";
import { Text } from "@/components/text";
import { Accordion } from "@/components/accordion";

/**
 * `Page` component fetches and displays details about a specific podcast collection,
 * its episodes, and associated characters from an API based on the URL slug.
 * It processes and displays these details using the `Accordion` component and other presentation components.
 *
 * @component
 * @example
 * return (
 *   <Page />
 * )
 */
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

  /**
   * Converts seconds into minutes.
   *
   * @param {number} seconds - The number of seconds to convert.
   * @returns {number} The equivalent minutes.
   */
  const secondsToMinutes = (seconds: number) => {
    return new Date(seconds * 1000).getMinutes();
  };

  /**
   * Fetches character data for a given collection from the API.
   *
   * @param {string} collectionId - The ID of the collection for which to fetch character data.
   */
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

  /**
   * Fetches collection and episodes data from the server and sets up the state.
   * It filters out episodes that are still drafts and initializes characters fetching.
   */
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

  // Fetches data on component mount.
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
          <div className="mb-6 max-w-2xl m-auto">
            <Text>{collection.description}</Text>
          </div>
          <div className="mb-6 max-w-2xl m-auto">
            <Text>
              La série sera composée de 6 épisodes et chaque épisode sortira le
              lundi aux alentours de 7h30. Ne ratez donc aucun épisode !!
            </Text>
          </div>
          <div className="flex justify-center">
            <img className="w-full md:max-w-md" src={`${collection.image}`} />
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
                    src={`${character.image}`}
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
                href={`${collection.document}`}
                target="_blank"
              >
                Infos supplémentaires
              </a>
            </Accordion>
          )}
        </div>
      )}
      <div className="bg-[#B5D4C034] my-7 py-8">
        <Title type="h1">Où nous écouter</Title>
        <div className="flex justify-center">
          <svg
            width="361"
            height="65"
            viewBox="0 0 361 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <a
              href="https://open.spotify.com/show/5KltPDMmojkE2Xmb3PX6y4"
              target="_blank"
            >
              <path
                d="M28.3471 0.251278C16.3525 1.80183 6.14667 9.95439 1.92317 21.3388C0.507865 25.105 0.0261404 28.0193 0 32.5626C0 39.5382 1.68417 45.0978 5.60893 51.0011C7.21468 53.4073 11.0872 57.3901 13.5182 59.1014C17.1255 61.6383 21.883 63.6447 26.719 64.6609C28.8027 65.113 35.8568 65.113 38.0488 64.6609C44.9162 63.2972 50.6596 60.3044 55.335 55.6789C62.3368 48.7332 65.862 38.9516 64.8201 29.3307C63.9911 21.7124 60.7609 14.9236 55.4432 9.58076C48.3331 2.49678 38.2094 -1.00411 28.3471 0.251278ZM38.2094 16.5003C45.4502 17.8641 51.7799 20.6962 57.232 25.0265C58.9684 26.4164 59.4502 27.6718 58.834 29.1439C58.3261 30.3731 57.3403 31.0382 56.0034 31.012C55.1221 30.9859 54.5321 30.6646 52.4483 29.114C48.363 26.0166 43.5532 23.8757 37.8883 22.6204C35.6962 22.1421 34.3594 22.0338 29.7923 22.0338C23.5112 22.0076 20.6806 22.4335 15.1762 24.2531C12.663 25.0788 11.89 25.2395 11.1133 25.0527C9.78015 24.7612 8.95113 23.6628 8.95113 22.1944C8.95113 20.3487 9.993 19.4931 13.6526 18.3199C16.7782 17.3036 20.8412 16.4219 24.1796 15.9922C27.4135 15.6186 34.8411 15.8876 38.2094 16.5003ZM35.1361 27.9147C39.8899 28.7404 44.4607 30.6123 48.7364 33.4705C52.101 35.716 52.635 36.3026 52.635 37.7747C52.635 39.1384 51.8359 40.1809 50.6073 40.4461C49.6962 40.6591 48.897 40.2593 45.9282 38.2006C43.2059 36.3026 39.4903 34.569 36.2825 33.7134C33.9075 33.0446 33.2391 32.9923 28.7243 32.9923C23.3805 32.9923 21.054 33.3659 17.3683 34.8342C14.3733 36.0373 12.5585 35.4769 12.2373 33.2052C12.0245 31.5725 12.9058 30.6907 15.8447 29.6221C22.0175 27.3766 28.7504 26.79 35.1361 27.9147ZM34.7627 40.689C38.7173 41.5147 42.5375 43.2782 45.8498 45.8189C46.705 46.4615 47.4257 47.2611 47.534 47.6347C47.7468 48.4903 47.3211 49.5589 46.6527 49.9064C45.6892 50.4407 44.8864 50.2015 43.2843 48.9985C41.04 47.2873 37.2983 45.4976 34.6021 44.8549C30.3263 43.8424 24.0751 44.2945 20.3594 45.8974C18.7313 46.5923 18.2757 46.5923 17.3944 45.8974C16.8604 45.4714 16.6998 45.1239 16.6998 44.2945C16.6998 43.3866 16.8343 43.1736 17.5811 42.7178C18.7836 41.9444 22.2826 40.902 25.1169 40.4461C27.8953 39.994 31.9843 40.0987 34.7627 40.689Z"
                fill="#1C8D70"
              />
            </a>
            <a
              href="https://podcasts.apple.com/us/podcast/on-the-way/id1740082304"
              target="_blank"
            >
              <path
                d="M128.643 0.0815068C128.27 0.137455 127.068 0.323949 125.974 0.484333C123.648 0.831212 119.217 2.21873 117.134 3.25936C107.839 7.92544 101.135 16.8622 99.3987 26.8434C98.8089 30.148 98.891 35.672 99.5293 38.9021C102.254 52.2401 112.565 62.2996 125.892 64.6196C128.804 65.1268 134.332 65.1268 137.244 64.6196C150.549 62.2996 161.259 51.5202 163.663 38.074C164.17 35.2468 164.088 28.8687 163.528 26.2018C160.699 13.1025 150.575 3.06914 137.673 0.58877C135.456 0.163564 129.927 -0.157205 128.643 0.0815068ZM134.788 11.6889C142.321 12.8899 148.783 18.0371 151.616 25.109C155.704 35.2729 151.295 46.9586 141.601 51.7589C138.502 53.2807 138.528 53.2807 138.528 51.6247V50.211L140.611 49.1443C143.363 47.7307 146.834 44.3178 148.197 41.6734C150.306 37.5929 150.896 32.7627 149.772 28.4435C147.637 20.1184 140.104 14.2476 131.581 14.2476C123.01 14.2476 115.798 19.6932 113.233 28.0705C112.886 29.2417 112.752 30.5509 112.752 33.0051C112.752 35.9666 112.834 36.6045 113.528 38.6857C115.077 43.4376 118.814 47.6524 123.141 49.5732L124.373 50.1066V51.5463C124.373 52.3483 124.291 53.0122 124.186 53.0122C124.078 53.0122 122.902 52.4788 121.565 51.841C115.902 49.0399 111.979 44.2097 110.456 38.074C109.653 34.8999 109.814 29.5886 110.829 26.4667C111.923 23.1583 113.659 20.4131 116.466 17.6641C118.549 15.5829 119.296 15.0495 121.726 13.8224C126.052 11.6889 130.379 10.969 134.788 11.6889ZM134.788 19.4246C139.622 20.5473 144.135 25.1351 145.177 30.0175C145.871 33.2699 145.367 36.8469 143.788 39.7823C142.989 41.3004 140.13 44.4782 139.596 44.4782C139.435 44.4782 139.327 43.7845 139.327 42.8744C139.327 41.4346 139.435 41.14 140.372 39.9129C143.844 35.3251 143.471 29.4841 139.435 25.2395C134.467 20.0662 125.866 20.9725 122.021 27.0821C120.711 29.1634 120.285 30.8716 120.419 33.6467C120.524 36.3396 121.192 38.1262 122.741 40.0471C123.462 40.9535 123.57 41.2743 123.57 42.7961C123.57 44.344 123.518 44.4782 123.088 44.2358C122.85 44.1015 121.995 43.3294 121.244 42.5275C114.995 35.9405 116.813 25.053 124.85 20.7861C125.735 20.3049 127.068 19.7715 127.87 19.5589C129.58 19.1039 133.078 19.0255 134.788 19.4246ZM133.104 26.2018C135.243 26.8434 136.927 29.0813 136.927 31.2707C136.927 34.5791 133.477 37.2721 130.301 36.4739C127.71 35.8324 126.239 33.9115 126.239 31.2185C126.239 28.7344 127.471 27.056 129.875 26.2018C131.208 25.7207 131.477 25.7207 133.104 26.2018ZM134.28 38.6857C136.285 40.021 137.113 42.5275 136.819 46.2089C136.445 50.7743 134.762 56.2161 133.16 58.137C131.103 60.6435 128.938 58.428 127.15 51.9454C126.213 48.5587 125.948 43.3294 126.616 41.3563C127.389 39.0326 128.778 38.1001 131.477 38.074C133.026 38.074 133.533 38.1785 134.28 38.6857Z"
                fill="#1C8D70"
              />
            </a>
            <a
              href="https://www.deezer.com/fr/show/1000872291"
              target="_blank"
            >
              <path
                d="M223.808 0.39201C219.15 1.21927 213.558 3.61533 209.994 6.33559C207.65 8.09444 204.004 11.9326 202.486 14.2243C198.918 19.635 197.296 24.6731 197.028 31.1496C196.816 37.1751 197.802 41.9188 200.354 47.009C202.032 50.3665 203.364 52.2334 206.054 55.0319C212.442 61.6425 220.348 65 229.586 65C236.268 65 241.938 63.2672 247.582 59.511C259.053 51.8608 264.407 37.8384 260.973 24.3005C257.829 11.8804 247.021 2.15086 234.296 0.25786C231.714 -0.140862 226.282 -0.0626088 223.808 0.39201ZM248.859 13.6915V16.2254H240.074V11.1575H248.859V13.6915ZM227.826 20.6225V23.1527H219.042V18.0886H227.826V20.6225ZM248.859 20.6225V23.1527H240.074V18.0886H248.859V20.6225ZM227.826 27.8182V30.3484H219.042V25.2842H227.826V27.8182ZM238.478 27.8182V30.3484H229.69V25.2842H238.478V27.8182ZM248.859 27.8182V30.3484H240.074V25.2842H248.859V27.8182ZM217.394 34.8014L217.472 37.2794H208.662V32.2153L213 32.2675L217.312 32.3494L217.394 34.8014ZM227.826 34.7492V37.2794H219.042V32.2153H227.826V34.7492ZM238.423 34.8014L238.504 37.2794H229.69V32.2153L234.032 32.2675L238.344 32.3494L238.423 34.8014ZM248.859 34.7492V37.2794H240.074V32.2153H248.859V34.7492ZM215.85 45.2763V50.3404H215.05C214.518 50.3404 214.25 50.2063 214.25 49.9417C214.25 49.5132 213.826 49.4088 213.614 49.7815C213.372 50.1802 211.962 50.3143 211.002 50.0758C209.06 49.5132 208.13 47.3034 209.008 45.2241C209.674 43.6255 211.694 42.9845 213.532 43.782C213.934 43.972 213.986 43.8118 213.986 42.1051V40.2121H215.85V45.2763ZM222.156 44.2627C222.636 44.7434 222.848 45.2763 222.878 45.9694L222.904 47.009L220.586 47.0873C219.284 47.1171 218.246 47.2736 218.246 47.4078C218.246 47.9145 219.31 48.7418 219.976 48.7418C220.348 48.7418 220.88 48.4996 221.2 48.1828C221.68 47.7021 221.866 47.6761 222.398 47.9145C223.194 48.2611 223.194 48.6076 222.424 49.3827C221.04 50.7652 218.112 50.4187 216.992 48.7679C215.902 47.1432 216.356 44.6912 217.926 43.8118C219.042 43.1709 221.304 43.4093 222.156 44.2627ZM228.332 43.782C229.158 44.2366 229.69 45.2241 229.69 46.342V47.1432H227.428C225.058 47.1432 224.768 47.3295 225.62 48.2611C226.178 48.902 227.242 48.8759 227.96 48.2089C228.44 47.7543 228.678 47.7021 229.266 47.9406C229.85 48.1568 229.932 48.2872 229.72 48.6896C228.678 50.6348 225.512 50.795 223.994 48.9803C222.662 47.4078 223.25 44.3968 225.006 43.6776C225.884 43.305 227.51 43.3833 228.332 43.782ZM236.082 44.1285C236.082 44.6614 235.628 45.3284 234.296 46.6625L232.514 48.4735H236.082V50.3404H229.958V49.4871C229.958 48.7679 230.278 48.2872 231.74 46.8227L233.526 45.008H230.222V43.4093H236.082V44.1285ZM242.124 44.3186C242.549 44.7956 242.735 45.3843 242.735 46.1035V47.1432H240.473C238.69 47.1432 238.21 47.2214 238.21 47.5158C238.21 48.0487 239.248 48.7418 239.993 48.7418C240.313 48.7418 240.819 48.4996 241.086 48.2089C241.511 47.7543 241.723 47.7021 242.31 47.9145C243.189 48.2611 243.189 48.6076 242.31 49.4088C241.432 50.2323 240.208 50.4746 238.824 50.1019C237.385 49.6995 236.588 48.7679 236.428 47.3034C236.134 44.7695 237.518 43.305 240.048 43.4913C241.22 43.5696 241.618 43.7298 242.124 44.3186ZM245.399 43.6776C245.399 43.864 245.559 43.864 245.905 43.6776C247.315 42.9324 248.859 43.7298 248.859 45.1682C248.859 45.9955 248.78 46.0774 248.115 46.0774C247.553 46.0774 247.263 45.8911 247.047 45.4104C246.73 44.7173 246.515 44.6353 245.823 44.9036C245.477 45.0378 245.399 45.5446 245.399 47.7021V50.3404H243.535V43.4093H244.465C244.971 43.4093 245.399 43.5435 245.399 43.6776Z"
                fill="#1C8D70"
              />
            </a>
            <a
              href="https://music.amazon.com/podcasts/005dac1b-4b90-4726-8b2c-458094cf3e39"
              target="_blank"
            >
              <path
                d="M326.017 0.0750216C316.592 1.09228 308.668 5.28287 303.116 12.2213C292.572 25.3807 293.877 44.4086 306.158 56.101C312.671 62.318 321.025 65.39 330.154 64.9604C351.243 63.9472 365.685 43.4481 359.597 23.1355C356.714 13.502 349.028 5.35988 339.551 1.94336C335.812 0.609992 329.432 -0.269466 326.017 0.0750216ZM342.434 21.0037C342.888 21.8832 342.325 22.6572 341.286 22.5519C340.617 22.4951 340.406 22.3371 340.35 21.8548C340.192 20.87 340.484 20.4687 341.339 20.4687C341.875 20.4687 342.248 20.6552 342.434 21.0037ZM311.628 24.8174L312.322 25.4334L313.551 24.8174C314.273 24.4445 315.234 24.2054 315.927 24.2054C318.515 24.2054 318.945 25.0849 318.945 30.4791V34.3455H317.128L317.022 30.5318C316.97 27.78 316.836 26.552 316.568 26.2602C316.114 25.7009 314.698 25.6725 313.47 26.1791L312.537 26.5804V34.3455H310.667V30.7993C310.667 26.633 310.456 25.9684 309.065 25.859C308.534 25.8063 307.678 25.9684 307.119 26.2075L306.129 26.6087V34.3455H304.264V24.4729H305.034C305.464 24.4729 305.866 24.631 305.971 24.8741C306.076 25.1943 306.263 25.1943 307.253 24.7404C308.879 23.9906 310.72 24.0433 311.628 24.8174ZM337.47 24.4729C337.949 24.631 338.164 24.9268 338.164 25.3524C338.164 25.9927 338.135 25.9927 336.294 25.859C335.013 25.7779 334.319 25.8346 334.023 26.0738C333.009 26.9005 333.97 28.1002 336.266 28.8742C338.002 29.4376 338.776 30.2887 338.748 31.6504C338.723 33.7052 337.442 34.613 334.639 34.613C332.689 34.613 331.651 34.1875 331.541 33.3607C331.464 32.773 331.488 32.773 333.545 32.9311C335.974 33.1216 336.829 32.8257 336.829 31.8125C336.829 31.0627 336.108 30.5035 334.372 29.9158C331.756 29.0607 330.957 26.8195 332.664 25.1132C333.492 24.2865 333.703 24.2054 335.171 24.2054C336.079 24.2054 337.093 24.3108 337.47 24.4729ZM350.975 24.4445C351.454 24.5783 351.669 24.8458 351.721 25.3524L351.802 26.0981L350.119 25.9116C348.651 25.7779 348.359 25.8346 347.719 26.3129C346.222 27.5166 345.983 30.8236 347.345 32.157C347.986 32.8257 348.226 32.8784 349.933 32.8257L351.802 32.773L351.721 33.4944C351.644 34.2928 351.028 34.536 349.106 34.5887C347.37 34.613 345.691 33.7052 344.997 32.3475C344.328 31.0101 344.275 27.9664 344.888 26.7425C345.423 25.7536 346.356 24.8458 347.24 24.4972C347.986 24.2054 349.986 24.177 350.975 24.4445ZM323.215 27.9948C323.215 32.2137 323.426 32.8541 324.87 32.9595C325.401 33.0121 326.257 32.8541 326.792 32.6393L327.725 32.2381L327.806 28.4203L327.887 24.6066H329.753V34.2158L329.112 34.2928C328.714 34.3455 328.313 34.2158 328.126 33.9483C327.83 33.5471 327.725 33.5471 326.711 34.0537C325.162 34.8562 323.215 34.7994 322.226 33.9727L321.479 33.3323L321.398 29.2755C321.345 27.0626 321.374 25.0606 321.451 24.8458C321.532 24.631 321.958 24.4729 322.412 24.4729H323.215V27.9948ZM342.3 29.4092V34.2158L341.526 34.2928C341.1 34.3455 340.67 34.2401 340.536 34.0253C340.273 33.6282 340.216 25.5388 340.459 24.8741C340.593 24.5783 340.885 24.4729 341.473 24.5256L342.3 24.6066V29.4092ZM352.151 38.3497C352.764 38.5645 352.845 38.7509 352.845 39.8209C352.845 41.365 351.965 43.9831 350.947 45.4786C350.148 46.6255 349.239 47.3185 349.028 46.97C348.947 46.8403 349.239 45.7461 349.665 44.4897C351.109 40.218 350.813 39.7925 346.518 40.0316C344.381 40.1653 343.768 40.1127 343.768 39.8452C343.768 38.6455 349.986 37.5229 352.151 38.3497ZM307.143 40.3518C314.751 44.1695 323.669 45.9852 331.728 45.3165C337.069 44.8909 344.113 43.2901 346.786 41.8999C347.613 41.4744 348.574 41.6608 348.574 42.2485C348.574 43.0753 344.17 45.6123 340.406 46.97C336.452 48.3885 333.358 48.8951 328.284 48.8951C322.015 48.8951 318.089 48.0683 312.565 45.5313C308.721 43.744 303.408 39.8979 303.834 39.2048C303.943 39.0184 304.077 38.8847 304.13 38.8847C304.183 38.8847 305.545 39.5534 307.143 40.3518Z"
                fill="#1C8D70"
              />
            </a>
          </svg>
        </div>
      </div>
    </div>
  );
}
