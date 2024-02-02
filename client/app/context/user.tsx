"use client"
import React, { useState, createContext, useEffect } from 'react'

interface User {
    id: string
    username: string
}

export const UserContext = createContext<{
    user: User
    setUser: (u: User) => void
}>({
    user: { id: "", username: "" },
    setUser: () => { },
})

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>({ id: "", username: "" });

    useEffect(() => {
        const storedId = sessionStorage.getItem("id");
        const storedUsername = sessionStorage.getItem("username");

        if (storedId && storedUsername) {
            setUser({ id: storedId, username: storedUsername });
        }
    }, []);

    return (
        <UserContext.Provider
            value={{
                user: user,
                setUser: setUser,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider