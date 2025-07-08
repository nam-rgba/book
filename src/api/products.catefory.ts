import api from "./api";

const getAllCategories = async () => {
    const response = await api.get('/productCategory?page=1&limit=20');
    return response.data;
}

export { getAllCategories };