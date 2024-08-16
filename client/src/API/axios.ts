import axios, { AxiosError } from 'axios';

const baseURL = "http://localhost:5030/";

const agent = axios.create({
    baseURL,
    timeout: 15000
});

agent.interceptors.response.use((response) => {
    return response;
}, (error) => {
    let status = 500;
    if (error instanceof AxiosError) {
        const response = error.response;
        if (response) status = response.status;
    }

    switch (status) {
        case 400:
            break;

        case 401:
            break;

        case 403:
            break;

        case 404:
            break;

        default:
            break;
    }

    return Promise.reject(error);
});

export default agent;