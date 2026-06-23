import React, { createContext, useContext, useState } from "react";

// Định nghĩa dữ liệu response
interface AuthContextType {
    accessToken: string | null;
    setAccessToken: ( token: string | null ) => void;
}

// Khởi tạo không gian lưu trữ Context
const AuthContext = createContext<AuthContextType | null>( null );

export const AuthProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {

    const [accessToken, setAccessToken] =
        useState<string | null>(null);

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                setAccessToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};