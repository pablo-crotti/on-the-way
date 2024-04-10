
import axios from 'axios';
import cookies from 'js-cookie';

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

        const name = 'podbean_token';
        const token = response.data.access_token;
        //const expires = response.data.expires_in;
        const expires = 30

        const formData = new FormData();

        formData.append('name', name);
        formData.append('value', token);
        formData.append('expires', expires);


        try {
            const response = await fetch("http://localhost:3000/api/auth/cookies", {
                method: "POST",
                body: formData
            });
        
            if (response.ok) {
                console.log("Cookie set successfully");
            } else {
                console.error("Failed to set cookie");
            }
        } catch (error) {
            console.error("Failed to set cookie", error);
        }


        try {
            const response = await fetch("http://localhost:3000/api/auth/cookies", {
                method: "GET",
            });
        
            if (response.ok) {
                const data = await response.json();
                console.log("Cookie retrieved successfully", data);
            } else {
                console.error("Failed to get cookie");
            }
        } catch (error) {
            console.error("Failed to get cookie", error);
        }





        return token;
    } catch (error) {
        console.error('Error fetching OAuth token:', error);
    }
}
