"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCollectionPodcast } from "../../../actions"; 


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
        id: '',
        podcast_id: '',
        title: '',
        content: '',
        logo: '',
        media_url: '',
        player_url: '',
        permalink_url: '',
        publish_time: 0,
        status: '',
        type: '',
        duration: 0,
        season_number: 0,
        episode_number: 0,
        apple_episode_type: '',
        transcripts_url: null,
        content_explicit: '',
        object: ''
      }
  ]
  

const [collection, setCollection] = useState(collectionModel);
const [episodes, setEpisodes] = useState(episodesModel); 

const pathname = usePathname();
const slug = pathname.split("/").pop();



const getCollection = () => {
    fetch(`http://localhost:3000/api/collection?id=${slug}`).then((res) =>
        res.json().then((data) => {
            setCollection(data);
            fetchCollectionPodcast(data.number).then((episodesData: any) => setEpisodes(episodesData));
            // console.log(data)
            // console.log(collection.number)
        })
            
            
    );
};

useEffect(() => {
    getCollection();


    // fetchCollectionPodcast(collection.number).then((data) => console.log(data));
    // console.log(fetchCollectionPodcast(collection.number))
}, []);
return <p>Post: {episodes[0].title}</p>;
}
