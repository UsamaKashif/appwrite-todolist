import { createContext, useState, useEffect } from "react"
import appwrite from "./appwrite"
import uuid from 'react-uuid'
export const AuthContext = createContext()

const AuthenticationProvider = ({ children }) => {

    const createAccount = (email, password, name) => {
        return appwrite.account.create(uuid(), email, password, name)
            
    }

    const createSession = (email, password) => {
       return appwrite.account.createSession(email, password)
            
    }

    const getAccount = () => {
        let promise = appwrite.account.get();
        return promise
    }

    return (
        <AuthContext.Provider value={{
            createAccount,
            createSession,
            getAccount,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthenticationProvider