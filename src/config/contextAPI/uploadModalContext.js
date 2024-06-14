import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import React from "react";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const openUpload = () => setIsUploadOpen(true);
    const closeUpload = () => setIsUploadOpen(false);

    return (
        <UploadContext.Provider value={{ openUpload, isUploadOpen, closeUpload }}>
            {children}
        </UploadContext.Provider>
    );
};

export const useUpload = () => useContext(UploadContext);
