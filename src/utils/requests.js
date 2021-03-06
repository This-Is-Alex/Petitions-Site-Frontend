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

instance.interceptors.response.use((response) => {
    return response;
}, async(error) => {
    let errorData = await Promise.resolve({ error });
    errorData.status = errorData.error.response.status;
    if (errorData.status == 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }
    return errorData;
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

export async function getUserInfo(id) {
    try {
        let res = await instance.get(`/users/${id}`);
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

export async function signPetition(id) {
    if (localStorage.getItem("userId") == null) {
        return false;
    }
    try {
        let res = await instance.post(`/petitions/${id}/signatures`);
        return res.status == 201;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function unSignPetition(id) {
    if (localStorage.getItem("userId") == null) {
        return false;
    }
    try {
        let res = await instance.delete(`/petitions/${id}/signatures`);
        return res.status == 200;
    } catch (e) {
        console.error(e);
        return false;
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

export async function updateUser(requestBody) {
    try {
        let res = await instance.patch(`/users/${localStorage.getItem('userId')}`, requestBody);
        if (res.status != 200) {
            return res.statusText;
        } else {
            return true;
        }
    } catch (e) {
        console.error(e);
        return "A network error occured";
    }
}

export async function createPetition(requestBody) {
    try {
        let res = await instance.post(`/petitions`, requestBody);
        if (res.status != 201) {
            return res.statusText;
        } else {
            return res.data.petitionId;
        }
    } catch (e) {
        console.error(e);
        return "Error";
    }
}

export async function updatePetition(requestBody, petitionId) {
    try {
        let res = await instance.patch(`/petitions/${petitionId}`, requestBody);
        if (res.status != 200) {
            return res.statusText;
        } else {
            return petitionId;
        }
    } catch (e) {
        console.error(e);
        return "Error";
    }
}

export async function deletePetition(petitionId) {
    try {
        let res = await instance.delete(`/petitions/${petitionId}`);
        if (res.status != 200) {
            return res.statusText;
        } else {
            return true;
        }
    } catch (e) {
        console.error(e);
        return "Error";
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

export async function logout() {
    let res = await instance.post('/users/logout')
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    return res.status == 200;
}

export async function deleteProfilePhoto() {
    let res = await instance.delete("/users/" + localStorage.getItem('userId') + "/photo");
    return res.status == 200;
}

export async function uploadProfilePhoto(file) {
    await uploadPhoto("/users/" + localStorage.getItem('userId') + "/photo", file);
}

export async function uploadPetitionPhoto(petitionId, file) {
    await uploadPhoto("/petitions/" + petitionId + "/photo", file);
}

async function uploadPhoto(endpoint, file) {
    let res = await instance.put(endpoint, file, {
        headers: {
            'Content-Type': file.type
        }
    })
    return res.status === 200;
}