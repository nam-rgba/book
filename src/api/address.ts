import api from "./api"; // Adjust the import path as necessary


const getAllCities = async () => {
    const response = await api.get("/city");
    return response.data;
}

const getAllDistricts = async (cityId: number) => {
    const response = await api.get(`/district?parentCode=${cityId}`);
    return response.data;
}

const getAllWards = async (districtId: number) => {
    const response = await api.get(`/ward?parentCode=${districtId}`);
    return response.data;
}

export { getAllCities, getAllDistricts, getAllWards };