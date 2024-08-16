import axios from 'axios';

const baseURL = "http://localhost:5030/";

const agent = axios.create({
    baseURL,
    timeout: 1000
});

export default agent;