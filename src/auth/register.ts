import axios from "axios"

const register = async (phone: string, password: string, email: string, name: string): Promise<void> => {

    const API_URL = 'https://shop.staging.bmdapp.store:3249/v1/customer/auth/register';
    try {
        const response = await axios.post(API_URL, {
            "customer": {
                "email": email,
                "fullName": name,
                "phone": phone,
                "password": password
            },
            "refCustomerId": 0
        }, {
            headers: {
                "namespace": "hoangphuc"
            }
        });
        return response.data; // Assuming the API returns some data on successful login
    } catch (error: unknown) {
        // Handle error, e.g., show error message to user
        console.error('Register failed:', error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error( error.response.data.message);
        } else if (error instanceof Error) {
            throw new Error(`Registration failed: ${error.message}`);
        } else {
            throw new Error('Registration failed: Unknown error');
        }
    }

}


export default register;