"use client";
import { Title } from "@/components/title";
import { Text } from "@/components/text";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { countCollectionPodcast } from "../../actions";

export default function SeriesPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEpisodes, setTotalEpisodes] = useState<number[]>([]);

  const getCollections = async () => {
    const response = await fetch(`/api/collection?all=true`, { method: "GET" });
    const data = await response.json();
    setCollections(data);
    data.forEach(async (collection: any) => {
      const total = await countCollectionPodcast(collection.number);
      setTotalEpisodes((prev) => [...prev, total]);
    });
    setLoading(false);
  };

  const dateToShortString = (date: string) => {
    const newDate = new Date(date);
    const month = newDate.toLocaleString("default", { month: "long" });
    const year = newDate.getFullYear();
    return `${month} ${year}`;
  }

  useEffect(() => {
    getCollections();
  }, []);
  return (
    <div className="p-4 flex flex-col gap-8">
      <Title type="h1" children="A propos de nous" />
      <Text>Vous vous trouvez sur le site dédié à notre podcast On The Way dont le but est de partager des histoires incroyables.</Text>
      {loading ? (<Loading />) : (
        <div className="flex flex-col gap-8">
          {
            collections.map((collection, index) => (
              <div className="flex justify-center" key={index}>
                <a
                  href={`/series/${collection.id}`}
                  className="flex items-center bg-white border border-gray-200 rounded-lg shadow flex-row md:max-w-xl hover:bg-gray-100 dark:border-darkbg-700 dark:bg-darkbg-800 dark:hover:bg-darkbg-700"
                >
                  <img
                    className="object-cover h-auto w-1/3 rounded-none rounded-s-lg"
                    src={`${collection.image}`}
                    alt=""
                  />
                  <div className="flex flex-col justify-between p-4 leading-normal w-2/3">
                    <h5 className="w-full break-words mb-2 text-lg text-left font-bold tracking-tight text-gray-900 dark:text-white">
                      {collection.name}
                    </h5>
                    <div className="flex flex-row w-full justify-between">
                      <p className="text-primary">{totalEpisodes[index] > 1 ? `${totalEpisodes[index]} épisodes` : `${totalEpisodes[index]} épisode`}</p>
                      <p className="text-gray-700 dark:text-gray-300">{dateToShortString(collection.createdAt)}</p>
                    </div>
                  </div>
                </a>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
