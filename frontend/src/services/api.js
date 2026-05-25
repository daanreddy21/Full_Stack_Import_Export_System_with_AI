import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default API;

export const getDocumentStats = async () => {
    const response = await API.get("/documents/stats");
    return response.data;
};

export const getDocuments = async () => {
    const response = await API.get("/documents");
    return response.data;
};

export const getDocumentById = async (id) => {
    const response = await API.get(`/documents/${id}`);
    return response.data;
};

export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await API.post(
        "/documents/upload",
        formData
    );

    return response.data;
};