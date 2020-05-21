import axios from "axios";

export const SERVER_URL = "http://localhost:4941/api/v1";
export const CLIENT_URL = "http://localhost:8080/"

const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 30000,
});

axios.interceptors.request.use(function(config) {
    const token = localStorage.getItem("token") || "";
    config.headers["X-Authorization"] = token;
    return config;
});

export async function getPetitions(params = {}) {
    try {
        params["count"] = 65536;
        params["startIndex"] = 0;
        let res = await instance.get(`/petitions`, {
            params: params
        });
        return res.data;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getPetitionInfo(id) {
    try {
        let res = await instance.get(`/petitions/${id}`);
        return res.data;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getPetitionSignatures(id) {
    try {
        let res = await instance.get(`/petitions/${id}/signatures`);
        return res.data;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export function getUserPhotoUrl(authorId) {
    return SERVER_URL + "/users/" + authorId + "/photo"
}

export function getPetitionPhotoUrl(id) {
    return SERVER_URL + "/petitions/" + id + "/photo"
}

export async function getCategories() {
    try {
        let res = await instance.get(`/petitions/categories`);
        return res.data;
    } catch (e) {
        console.error(e);
        return [];
    }
}