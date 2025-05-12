// import axios from "axios";
// import { getUserSession } from "./auth";

// // Create an Axios instance with a configurable base URL
// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001", // Use environment variable for flexibility
// });

// // Add a request interceptor to include the Authorization header
// axiosInstance.interceptors.request.use(
//   async (config: any) => {
//     try {
//       const session = await getUserSession();
//       // const { token } = session || {};
//       const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InJvbGUiOiJzdXBlcl9hZG1pbnMiLCJpZCI6Im1lYWx3aGlybC5zdXBlcmFkbWluMUBtZWFsd2hpcmwuY29tIiwicm9sZUlkIjoyfSwidGVuYW50Ijp7InRlbmFudElkZW50aWZpZXIiOiJ0ZW5hbnRfaWRlbnRpZmllciIsImRiSWRlbnRpZmllciI6ImRiX2lkZW50aWZpZXIifSwiaWF0IjoxNzQ1NTE1NDQ1LCJleHAiOjE3NDU1MTkwNDUsImlzcyI6ImF1dGgtc2VydmljZSJ9.FWWUWPaagpx6oNvZgvSpg-lk-kVAim2qhndR6rgtKJ5pvtqHy1JQSgt5bnj21koz9qCMKSNWyoxsMKiyvJ_AcCm-_wIhasksncq4XdDyvRN3sjQjsCkLQRXYAwFCe0xBeYl7y7Mi_Er8fwKYTqrgLCzUi6RbtSwkUE731pcFOfLc8RHx5Xf_iu5hMNx9YeuNJ041QcUYgz_kBOktc4RA050BB8yYFM1OIP0Bqaz-axQ4UPPX48-6veIbGdFCpy5pUxeKn0brZrytHao1Xi7pWPKvJLHW4u04xzUnexB3lmnhwqNSHpVbsRIg-apoJ_2FlxYwZ5MHWpjwzzsP-69oTQ'

//       if (token) {
//         config.headers = {
//           ...config.headers,
//           Authorization: config.headers.Authorization || token,
//         };
//       }

//       if (config.originalUrl) {
//         config.url = `${config.baseURL}${config.originalUrl}`;
//       }
//     } catch (error) {
//       console.error("Error retrieving user session or setting headers:", error);
//     }

//     return config;
//   },
//   (error) => {
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


import axios from 'axios';
import { getToken } from './auth';

import isTokenExpired from './jwt';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // baseURL: 'http://localhost:5001/mealwhirl_server/api/v1',
});

axiosInstance.interceptors.request.use(async (config: any) => {
    const token: any = await getToken(); 
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODFlMWQ0OTc5NWEwMTUxYjhkNDRiYTciLCJpYXQiOjE3NDY5NTAwMjksImV4cCI6MTc0Njk1MzYyOX0.BOgoKFQ1V0c1YITBH7KnNL2F7zXlarwPK8ePc4AEGJ8'; 
    if (isTokenExpired(token)) {
        window.location.href = `/login`;
        return Promise.reject(new Error('Token is expired'));
    }

    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;