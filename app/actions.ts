"use server"

import axios from 'axios';

const BASE_URL = 'https://api.podbean.com/v1';
const USER = process.env.POSTBEAN_API_USER;
const PASSWORD = process.env.POSTBEAN_API_SECRET;
const GRANT_TYPE = 'client_credentials';

export const fetchOAuthToken = async () => {

    try {
        const url = `${BASE_URL}/oauth/token`;
        const data = {
            grant_type: GRANT_TYPE,
        };
        const headers = {
            Authorization: `Basic ${Buffer.from(`${USER}:${PASSWORD}`).toString('base64')}`,
        };

        const response = await axios.post(url, data, { headers });

        const token = response.data.access_token;

        console.log("New token")
        const expires = 60

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + (expires ? parseInt(expires.toString()) : 0));

        const expirationTime = expiration.toISOString();

        const formData = new FormData();
        formData.append('token', token);
        formData.append('expires', expirationTime);

        try {
            const response = await fetch("http://localhost:3000/api/auth/apitoken", {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                return token;
            } else {
                console.error("Failed to set token");
            }
        } catch (error) {
            console.error("Failed to set token", error);
        }

    } catch (error) {
        console.error('Error fetching OAuth token:', error);
    }
}

export const verifyTokenAge = (expiration: any) => {
    expiration = new Date(expiration);
    const now = new Date();

    return now < expiration;
}

export const getToken = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/auth/apitoken");

        if (response.ok) {
            const token = await response.json();

            if (token) {

                if (verifyTokenAge(token.expiration)) {
                    return token.token;
                } else {
                    const newToken = await fetchOAuthToken();
                    return newToken;
                }
            } else {
                const newToken = await fetchOAuthToken();
                return newToken;
            }
        } else {
            console.error("Failed to fetch token");
            const newToken = await fetchOAuthToken();
            return newToken;
        }
    } catch (error) {
        console.error("Failed to get token", error);
    }
}

export const fetchPodcasts = async () => {
    const token = await getToken();
    const url = `${BASE_URL}/episodes`;
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers });

    if (response.data) {
        return response.data;
    } else {
        console.error("Failed to fetch podcasts");
    }
}

export const fetchCollectionPodcast = async (collectionNumber: number) => {
    const podcasts = await fetchPodcasts();

    // console.log(podcasts);
    
    const episodesOfSeason = podcasts.episodes.filter((episode: any) => episode.season_number === collectionNumber);

    console.log(episodesOfSeason);
    
    // return episodesOfSeason;
}



export const fetchPresignedAmazonUrl = async (file: any) => {
    const token = await getToken();
    const url = `${BASE_URL}/files/uploadAuthorize`;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const params = {
        filename: file.filename,
        content_type: file.content_type,
        filesize: file.filesize,
    }

    const response = await axios.get(url, { headers, params });

    if (response.data) {
        return [response.data.presigned_url, response.data.file_key];
    } else {
        console.error("Failed to get presigned url");
    }
}

export const storeOnAmazon = async (formData: FormData, url: string) => {
    const file = formData.get('file') as File | null;

    if (!url || !file) {
        console.error("Missing presigned URL or file");
        return;
    }

    try {
        const fileBuffer = await file.arrayBuffer();
        const config = {
            headers: {
                'Content-Type': file.type,
            },
        };

        const response = await axios.put(url, Buffer.from(fileBuffer), config);

        console.log(response);

        if (response.status === 200) {
            return true;
        } else {
            console.error("Failed to store file on Amazon");
        }
    } catch (error) {
        console.error("An error occurred while uploading file to Amazon:", error);
    }
};

export const publishPodcast = async (podcast: any) => {
    const token = await getToken();
    const url = `${BASE_URL}/episodes`;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const requestBody = new URLSearchParams();
    requestBody.append('title', podcast.title);
    requestBody.append('content', podcast.content);
    requestBody.append('status', `${podcast.status}`);
    requestBody.append('type', podcast.type);
    requestBody.append('logo_key', podcast.logo_key);
    requestBody.append('media_key', podcast.media_key);

    const fullUrl = `${url}?${requestBody.toString()}`;
    console.log(fullUrl);

    try {
        const response = await axios.post(url, requestBody, { headers });
        console.log('Podcast publié avec succès:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la publication du podcast:', error);
        throw error;
    }
}