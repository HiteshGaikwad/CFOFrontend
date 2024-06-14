import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import React from "react";

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);

    const openCompany = () => setIsCompanyOpen(true);
    const closeCompany = () => setIsCompanyOpen(false);

    return (
        <CompanyContext.Provider value={{ openCompany, isCompanyOpen, closeCompany }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => useContext(CompanyContext);
