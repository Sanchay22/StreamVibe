import React, { useContext, useState, createContext } from "react";
import { useQuery } from "react-query";
import * as apiClient from '../apiClient';
import Toast from "../components/Toast";

// Create the context with a default value of undefined
const AppContext = React.createContext(undefined);

export const AppContextProvider = ({ children }) => {
    const [toast, setToast] = useState(undefined);
    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000,
    });

    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                setToast(toastMessage);
            },
            isLoggedIn: !isError
        }}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => {
                        setToast(undefined);
                    }}
                />
            )}
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};
