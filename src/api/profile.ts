import api from "./api";

const getProfile = async()=>{
    try {
        const response = await api.get("/auth/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
}

export default getProfile