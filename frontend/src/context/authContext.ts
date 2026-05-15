import React, { createContext, useState, useEffect } from "react"


interface AuthContextType {
    user: null | object
    setUser: React.Dispatch<React.SetStateAction<null | object>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthContext = createContext<AuthContextType | null>(null);

//export const AuthProvider = 