
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

export const verifyTokenAge = (expiration) => {
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

    console.log(response.data);
}

export const fetchPresignedAmazonUrl = async (file) => {
    console.log("fetchPresignedAmazonUrl")
    const token = await getToken();
    console.log("token", token)
    const url = `${BASE_URL}//files/uploadAuthorize`;

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const params = {
        filename: file.filename,
        content_type: file.content_type,
        filesize: file.filesize,
    }

    const response = await axios.get(url, { headers, params });

    console.log(response.data);
}