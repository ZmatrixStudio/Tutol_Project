import axios from "axios";
export interface UserProfileToken {
    accessToken: string;
}

export const loginAPI = async(email: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>("/auth/login", {
            email: email,
            password: password
        })
        return data.data;
    } catch (error) {
        throw error;
    }
}