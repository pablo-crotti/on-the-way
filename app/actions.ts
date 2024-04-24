"use server"

import axios from 'axios';

const BASE_URL = 'https://api.podbean.com/v1';
const USER = process.env.POSTBEAN_API_USER;
const PASSWORD = process.env.POSTBEAN_API_SECRET;
const GRANT_TYPE = 'client_credentials';

/**
 * Fetches an OAuth token using client credentials grant type. Handles the authentication
 * by encoding user credentials and posting to the OAuth endpoint. If successful, it also
 * sets the token with an expiration time through a separate API call.
 *
 * @returns {Promise<string>} A promise that resolves to the fetched token.
 */
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
        const expires = response.data.expires_in;

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + (expires ? parseInt(expires.toString()) : 0));

        const expirationTime = expiration.toISOString();

        const formData = new FormData();
        formData.append('token', token);
        formData.append('expires', expirationTime);

        try {
            const response = await fetch(`${process.env.BASE_URL}/api/auth/apitoken`, {
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

/**
 * Verifies if a given token expiration date is still valid by comparing it to the current date and time.
 *
 * @param {Date | string} expiration - The expiration date of the token.
 * @returns {boolean} True if the current date is before the expiration date, false otherwise.
 */
export const verifyTokenAge = (expiration: any) => {
    expiration = new Date(expiration);
    const now = new Date();

    return now < expiration;
}

/**
 * Retrieves an existing token from storage or fetches a new one if the existing token is expired.
 * This function checks the validity of the token, renews it if necessary, and returns a valid token.
 *
 * @returns {Promise<string>} A promise that resolves to a valid token.
 */
export const getToken = async () => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/auth/apitoken`);

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

/**
 * Fetches all podcast episodes, sorts them by season and episode number in descending order,
 * and returns the sorted list.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of sorted podcast episodes.
 */
export const fetchPodcasts = async () => {
    const token = await getToken();
    const url = `${BASE_URL}/episodes`;
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers });

    if (response.data) {
        response.data.episodes.sort((a: any, b: any) => {
            if (a.season_number === b.season_number) {
                return b.episode_number - a.episode_number;
            } 
            return b.season_number - a.season_number;
        });

        return response.data.episodes;
    } else {
        console.error("Failed to fetch podcasts");
    }
}

/**
 * Fetches and returns all episodes from a specified season, sorted by episode number in ascending order.
 *
 * @param {number} collectionNumber - The season number to filter episodes by.
 * @returns {Promise<Array>} A promise that resolves to a sorted array of episodes for the specified season.
 */
export const fetchCollectionPodcast = async (collectionNumber: number) => {
    const podcasts = await fetchPodcasts();


    const episodesOfSeason = podcasts.filter((episode: any) => episode.season_number === collectionNumber);
    episodesOfSeason.sort((a: any, b: any) => a.episode_number - b.episode_number);

    return episodesOfSeason;
}

/**
 * Counts the number of episodes in a specified season of the podcast collection.
 *
 * @param {number} collectionNumber - The season number to count episodes in.
 * @returns {Promise<number>} A promise that resolves to the count of episodes in the specified season.
 */
export const countCollectionPodcast = async (collectionNumber: number) => {
    const podcasts = await fetchPodcasts();

    const episodesOfSeason = podcasts.filter((episode: any) => episode.season_number === collectionNumber);

    return episodesOfSeason.length;
}

/**
 * Requests a presigned Amazon S3 URL for uploading a file. This URL is used to securely upload
 * files directly to an S3 bucket.
 *
 * @param {Object} file - An object containing file details such as filename, content type, and filesize.
 * @returns {Promise<Array>} A promise that resolves to an array containing the presigned URL and the file key.
 */
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

/**
 * Uploads a file to Amazon S3 using a presigned URL provided by the `fetchPresignedAmazonUrl` function.
 *
 * @param {FormData} formData - FormData containing the file to be uploaded.
 * @param {string} url - The presigned URL for uploading.
 * @returns {Promise<boolean>} A promise that resolves to true if the upload was successful, otherwise false.
 */
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

        if (response.status === 200) {
            return true;
        } else {
            console.error("Failed to store file on Amazon");
        }
    } catch (error) {
        console.error("An error occurred while uploading file to Amazon:", error);
    }
};

/**
 * Publishes a new podcast episode by posting its details to the podcast hosting API.
 *
 * @param {Object} podcast - An object containing podcast details such as title, content, status, and media keys.
 * @returns {Promise<Object>} A promise that resolves to the API response data after publishing the podcast.
 */
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
    requestBody.append('season_number', podcast.season_number.toString());
    requestBody.append('episode_number', podcast.episode_number.toString());

    const fullUrl = `${url}?${requestBody.toString()}`;

    try {
        const response = await axios.post(url, requestBody, { headers });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la publication du podcast:', error);
        throw error;
    }
}

/**
 * Updates an existing podcast episode's details on the podcast hosting API.
 *
 * @param {Object} podcast - An object containing the updated podcast details.
 * @returns {Promise<Object>} A promise that resolves to the API response data after updating the podcast.
 */
export const updatePodcast = async (podcast: any) => {
    const token = await getToken();
    const url = `${BASE_URL}/episodes/${podcast.id}`;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const requestBody = new URLSearchParams();
    requestBody.append('title', podcast.title);
    requestBody.append('content', podcast.content);
    requestBody.append('status', `${podcast.status}`);
    requestBody.append('type', podcast.type);

    if (podcast.logo_key) {
        requestBody.append('logo_key', podcast.logo_key);
    }

    if (podcast.media_key) {
        requestBody.append('media_key', podcast.media_key);
    }


    try {
        const response = await axios.post(url, requestBody, { headers });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du podcast:', error);
        throw error;
    }
}

/**
 * Fetches a single podcast episode by its ID.
 *
 * @param {string} id - The ID of the podcast episode to fetch.
 * @returns {Promise<Object>} A promise that resolves to the podcast episode data.
 */
export const fetchPodcast = async (id: string) => {
    const token = await getToken();
    const url = `${BASE_URL}/episodes/${id}`;
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers });

    if (response.data) {
        return response.data;
    } else {
        console.error("Failed to fetch podcast");
    }

}

/**
 * Fetches engagement statistics for podcasts, comparing data over the last 30 and 60 days.
 *
 * @returns {Promise<Object>} A promise that resolves to engagement statistics for the last 30 and 60 days.
 */
export const fetchPodcastEngagementStats = async () => {
    const token = await getToken();
    const url = `${BASE_URL}/podcastStats/stats`;
    const headers = {
        Authorization: `Bearer ${token}`,
    };


    const today = new Date();

    const past30Days = new Date(today);
    past30Days.setDate(today.getDate() - 30);

    const past60Days = new Date(today);
    past60Days.setDate(today.getDate() - 60);

    let params = {
        start: `${past30Days.getFullYear()}-${past30Days.getMonth() + 1}-${past30Days.getDate()}`,
        end: ''
    };

    const last30 = await axios.get(url, { headers, params });

    params = {
        start: `${past60Days.getFullYear()}-${past60Days.getMonth() + 1}-${past60Days.getDate()}`,
        end: `${past30Days.getFullYear()}-${past30Days.getMonth() + 1}-${past30Days.getDate()}`,
    };

    const last60 = await axios.get(url, { headers, params });

    return { last30: last30.data, last60: last60.data };
}

/**
 * Fetches podcast statistics for a given time interval, counting back from today.
 *
 * @param {number} interval - The number of days in the past to fetch statistics for, starting from today.
 * @returns {Promise<Object>} A promise that resolves to the podcast statistics for the specified interval.
 */
export const fetchPodcastStats = async (interval: number) => {
    const token = await getToken();
    const url = `${BASE_URL}/podcastStats/stats`;
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const today = new Date();

    const pastXDays = new Date(today);
    pastXDays.setDate(today.getDate() - interval);

    let params = {
        start: `${pastXDays.getFullYear()}-${pastXDays.getMonth() + 1}-${pastXDays.getDate()}`,
        end: ''
    };

    const lastX = await axios.get(url, { headers, params });

    return lastX.data;
}