import { Title } from "@/components/title";
import { Text } from "@/components/text";

import { fetchPodcasts } from "./actions";

export default async function Home() {
  console.log('Hello')
  // const podcasts = await fetchPodcasts();
  // console.log(podcasts)

  // console.log(fetchPodcasts());
  return (
    <>
      <div>
        <Title type="h1">PODCAST</Title>
        <img src="/logo/on-the-way.png" alt="podcast" />
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
