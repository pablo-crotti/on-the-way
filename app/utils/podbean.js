
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
        const expires = 30

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

    console.log(now)
    console.log(expiration)
    
    console.log(now < expiration)
    return now < expiration;
}

export const getToken = async () => {
    try {
        await fetch("http://localhost:3000/api/auth/apitoken", {
            method: "GET",
        }).then((token) => token.json()).then((data) => {
                console.log(data)
                // if (token === null) {
                    // console.log("Token is null")
                    // const newToken = fetchOAuthToken().then((token) => {
                        // console.log(token)
                        // return token
                    // })
                // } else { 

                    // console.log(token.expiration)
                // if (verifyTokenAge(token.expiration)) {
                //     console.log("Token is still valid")
                //     console.log(token.token)
                //     return token.token;
                // } else {
                //     console.log("Token is expired")
                //     const newToken = fetchOAuthToken().then((token) => {
                //         console.log(token)
                //         return token
                //     })
                // }
            // }
        })


} catch (error) {
    console.error("Failed to get token", error);
}

}