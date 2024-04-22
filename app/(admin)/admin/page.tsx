"use client";
import { useEffect, useState } from "react";
import { fetchPodcastEngagementStats, fetchPodcasts } from "../../actions";
import { Title } from "@/components/title";
import { get } from "http";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>([]);
  const [monthSum, setMonthSum] = useState(0);
  const [lastMonthSum, setLastMonthSum] = useState(0);
  const [lastPodcasts, setLastPodcasts] = useState<any>([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(0);

  const getPercentage = (monthSum: number, lastMonthSum: number) => {
    if (monthSum > lastMonthSum) {
      return Math.round(((monthSum - lastMonthSum) / lastMonthSum) * 100);
    } else if (monthSum < lastMonthSum) {
      return Math.round(((lastMonthSum - monthSum) / lastMonthSum) * 100);
    } else {
      return 0;
    }
  };

  const getTotalPageViews = () => {
    const interval = 1000 * 60 * 60 * 24 * 30;
    const toDateTime = new Date();
    const fromDateTime = new Date(toDateTime.getTime() - interval);
    fetch(`/api/analytics?category=os_name&from=${encodeURIComponent(fromDateTime.toISOString())}&to=${encodeURIComponent(toDateTime.toISOString())}`, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (!data || !data.data) {
          throw new Error('Data is undefined or empty');
        }
        const tab = Array.from(data.data);
        let total = 0;
        tab.forEach((element: any) => {
          total += element.devices;
        });
        setTotalPageViews(total);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    getTotalPageViews();
    fetchPodcastEngagementStats().then((data) => {
      setStats(data);
      setLoading(false);
      let sum = 0;
      for (const [key, value] of Object.entries(data.last30)) {
        sum += value as number;
      }

      setMonthSum(sum);


      sum = 1;
      for (const [key, value] of Object.entries(data.last60)) {
        sum += value as number;
      }

      setLastMonthSum(sum);
    });
    fetchPodcasts().then((data) => {
      const dataSorted = data.sort((a: any, b: any) => b.publish_time - a.publish_time);
      setTotalEpisodes(dataSorted.length);
      setLastPodcasts([dataSorted[0], dataSorted[1]]);
    });
  }, []);

  return (
    <div>
      <Title type="h1" children="Bienvenue !" />
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <img
            className="w-64 h-64"
            src="/loader/loader.gif"
            alt="Chargement..."
          />
        </div>
      ) : (
        <div className="flex justify-center flex-wrap md:justify-center gap-4">
          <div className="flex flex-col gap-4 basis-1/3">
            <div className="flex flex-col items-center p-4 w-max min-w-full bg-white border border-gray-200 rounded-lg shadow md:flex-row  dark:border-darkbg-700 dark:bg-darkbg-800">
              {monthSum < lastMonthSum ? (
                <div className="flex flex-shrink-0 items-center justify-center bg-red-200 h-16 w-16 rounded">
                  <svg
                    className="w-6 h-6 fill-current text-red-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
                  <svg
                    className="w-6 h-6 fill-current text-green-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              <div className="flex-grow flex flex-col ml-4">
                <span className="text-xl font-bold dark:text-white">{monthSum}</span>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-200">
                    Écoutes des derniers 30 jours
                  </span>
                  <span
                    className={
                      monthSum < lastMonthSum
                        ? "text-red-500 text-sm font-semibold ml-2"
                        : "text-green-500 text-sm font-semibold ml-2"
                    }
                  >
                    {monthSum < lastMonthSum ? `-` : `+`}{" "}
                    {getPercentage(monthSum, lastMonthSum)} %
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center p-4 w-max min-w-full bg-white border border-gray-200 rounded-lg shadow md:flex-row  dark:border-darkbg-700 dark:bg-darkbg-800">
              <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-current text-green-700">
                  <path d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z" />
                </svg>
              </div>
              <div className="flex-grow flex flex-col ml-4">
                <span className="text-xl font-bold dark:text-white">{totalPageViews}</span>
                <span className="text-gray-500 dark:text-gray-200">
                  Visites des derniers 30 jours
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center p-4 w-max min-w-full bg-white border border-gray-200 rounded-lg shadow md:flex-row  dark:border-darkbg-700 dark:bg-darkbg-800">
              <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-current text-green-700">
                  <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                  <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                </svg>
              </div>
              <div className="flex-grow flex flex-col ml-4">
                <span className="text-xl font-bold dark:text-white">{totalEpisodes}</span>
                <span className="text-gray-500 dark:text-gray-200">
                  Total d'épisodes créés
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-start gap-4 p-4 w-max basis-1/3 bg-white border border-gray-200 rounded-lg shadow md:flex-col  dark:border-darkbg-700 dark:bg-darkbg-800">
            <div className="flex flex-row items-center gap-4 w-max">
              <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-current text-green-700">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-500 dark:text-gray-200">
                Dernières publications
              </span>
            </div>
            {lastPodcasts.map((podcast: any, index: number) => (
              <div key={index} className="flex items-center w-full bg-white border border-gray-200 rounded-lg shadow flex-row md:max-w-xl dark:border-darkbg-700 dark:bg-darkbg-800">
                <img
                  className="object-cover w-1/3 aspect-square rounded-none rounded-s-lg"
                  src={podcast.logo}
                  alt=""
                />
                <div className="flex flex-col justify-between p-4 leading-normal w-2/3">
                  <h4 className="w-full break-words text-base text-left font-medium tracking-tight text-gray-900 dark:text-white">Série {podcast.season_number}</h4>
                  <h5 className="w-full break-words text-lg text-left font-bold tracking-tight text-gray-900 dark:text-white">Episode {podcast.episode_number}</h5>
                  <p className="text-gray-500 dark:text-gray-200">Publié le : {new Date(podcast.publish_time * 1000).toLocaleString("fr-CH", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
                  <p className="text-gray-500 dark:text-gray-200">Statut : {podcast.status === "publish" ? "Public" : "Brouillon"}</p>
                  <div className="flex flex-row gap-2 mt-2">
                    <a href={`/admin/episodes/${podcast.id}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 text-green-700 fill-none stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      )}
    </div>
  );
}
