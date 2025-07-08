import axios from "axios"

interface LoginResponse {
    token: string;
}

const login = async (phone: string, password: string): Promise<LoginResponse> => {

    const API_URL = 'https://shop.staging.bmdapp.store:3249/v1/customer/auth/login';
    try {
        const response = await axios.post(API_URL, {
            "phone":phone,
            "password":password
        }, {
            headers: {
                'namespace': 'hoangphuc'
            }
        });

        return response.data.data; // Assuming the response contains a data field with the user information
    } catch (error) {
        // Handle error, e.g., show error message to user
        console.error('Login failed:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else if (error instanceof Error) {
            throw new Error(`Login failed: ${error.message}`);
        } else {
            throw new Error('Login failed: Unknown error');
        }
    }
    
}


export default login;