
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
    currentUser: User | null;
    login: (user: User) => Promise<User>;
    logout: () => void;
    signup: (user: User) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'usdqs-users';
const CURRENT_USER_STORAGE_KEY = 'usdqs-current-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }
        const storedCurrentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        if (storedCurrentUser) {
            setCurrentUser(JSON.parse(storedCurrentUser));
        }
    }, []);

    const persistUsers = (newUsers: User[]) => {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
        setUsers(newUsers);
    };
    
    const persistCurrentUser = (user: User | null) => {
        if(user) {
            localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
        }
        setCurrentUser(user);
    };

    const signup = useCallback((user: User): Promise<User> => {
        return new Promise((resolve, reject) => {
            if (users.find(u => u.username === user.username)) {
                return reject(new Error('username_exists'));
            }
            const newUsers = [...users, user];
            persistUsers(newUsers);
            resolve(user);
        });
    }, [users]);
    
    const login = useCallback((user: User): Promise<User> => {
        return new Promise((resolve, reject) => {
            const foundUser = users.find(u => u.username === user.username);
            if (!foundUser) {
                return reject(new Error('user_not_found'));
            }
            if (foundUser.password !== user.password) {
                return reject(new Error('invalid_password'));
            }
            const userToStore = { username: foundUser.username };
            persistCurrentUser(userToStore);
            resolve(userToStore);
        });
    }, [users]);

    const logout = useCallback(() => {
        persistCurrentUser(null);
    }, []);
    
    return (
        <AuthContext.Provider value={{ currentUser, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
