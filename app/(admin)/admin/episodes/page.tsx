import {fetchPodcasts} from '../../../actions';
import { useState, useEffect } from 'react';


export default function EpisodesPage() {
    const [episodes, setEpisodes] = useState<{
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
    }[]>([]);
    

    useEffect(() => {
        fetchPodcasts().then((episodesData) =>
            setEpisodes(episodesData)
        );
      }, []);

    return (
        <div>Hello</div>
    )
}