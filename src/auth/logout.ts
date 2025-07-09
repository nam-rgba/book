import api from "../api/api";

const logout = async () => {
    const API_URL = 'https://shop.staging.bmdapp.store:3249/v1/customer/auth/logout';
    try {
        const response = await api.post(API_URL, {}, {
            headers: {
                'namespace': 'hoangphuc'
            }
        });

        return response.data; // Assuming the response contains a data field with the logout confirmation
    } catch (error) {
        // Handle error, e.g., show error message to user
        console.error('Logout failed:', error);
    }
}

export default logout;