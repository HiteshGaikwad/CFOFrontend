import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import React from "react";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openMenu = () => setIsMenuOpen(true);
    const closeMenu = () => setIsMenuOpen(false);
    return (
        <MenuContext.Provider value={{ openMenu, isMenuOpen, closeMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => useContext(MenuContext);
