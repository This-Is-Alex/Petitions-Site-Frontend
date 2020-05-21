import axios from "axios";

export const SERVER_URL = "http://localhost:4941/api/v1";
export const CLIENT_URL = "http://localhost:8080/"

const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 30000,
});

instance.interceptors.request.use(function(config) {
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
        return {};
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

export async function register(requestBody) {
    try {
        let res = await instance.post(`/users/register`, requestBody);
        if (res.status != 201) {
            return res.statusText;
        } else {
            return res.data.userId;
        }
    } catch (e) {
        console.error(e);
        return "A network error occured";
    }
}

export async function login(email, password) {
    let res = await instance.post('/users/login', { email, password })
    if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        return true;
    } else {
        return false;
    }
}

export async function uploadProfilePhoto(userId, file) {
    uploadPhoto("/users/" + userId + "/photo", file);
}

async function uploadPhoto(endpoint, file) {
    let res = await instance.put(endpoint, file, {
        headers: {
            'Content-Type': file.type
        }
    })
    return res.status === 200;
}