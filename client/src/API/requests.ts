import axios from 'axios';

const baseURL = "http://localhost:5030/";

const instance = axios.create({
    baseURL,
    timeout: 1000
});

async function get(url: string) {
    return await instance({
        url
    });
}

const agent = { get };

export default agent;