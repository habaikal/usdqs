
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Account, Transaction } from '../types';
import { useAuth } from './AuthContext';

interface AccountContextType {
    myAccount: Account | null;
    buyUsdqs: (amount: number) => Promise<void>;
    sellUsdqs: (amount: number) => Promise<void>;
    transferUsdqs: (recipientUsername: string, amount: number) => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

const ACCOUNTS_STORAGE_KEY = 'usdqs-accounts';

export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [myAccount, setMyAccount] = useState<Account | null>(null);

    useEffect(() => {
        const storedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
        if (storedAccounts) {
            setAccounts(JSON.parse(storedAccounts));
        }
    }, []);
    
    useEffect(() => {
        if (currentUser) {
            let userAccount = accounts.find(acc => acc.username === currentUser.username);
            if (!userAccount) {
                userAccount = { username: currentUser.username, balance: 0, transactions: [] };
                const newAccounts = [...accounts, userAccount];
                setAccounts(newAccounts);
                localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(newAccounts));
            }
            setMyAccount(userAccount);
        } else {
            setMyAccount(null);
        }
    }, [currentUser, accounts]);

    const updateAccounts = useCallback((updatedAccounts: Account[]) => {
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
        setAccounts(updatedAccounts);
    }, []);

    const buyUsdqs = useCallback((amount: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!currentUser) return reject(new Error('not_logged_in'));
            
            const newTransaction: Transaction = {
                id: Date.now().toString(),
                type: 'purchase',
                amount,
                from: 'system',
                to: currentUser.username,
                timestamp: new Date().toISOString()
            };
            
            const updatedAccounts = accounts.map(acc => {
                if (acc.username === currentUser.username) {
                    return {
                        ...acc,
                        balance: acc.balance + amount,
                        transactions: [newTransaction, ...acc.transactions]
                    };
                }
                return acc;
            });
            updateAccounts(updatedAccounts);
            resolve();
        });
    }, [currentUser, accounts, updateAccounts]);

    const sellUsdqs = useCallback((amount: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!currentUser) return reject(new Error('not_logged_in'));

            const userAccount = accounts.find(acc => acc.username === currentUser.username);
            if (!userAccount || userAccount.balance < amount) {
                return reject(new Error('insufficient_balance'));
            }
            
            const newTransaction: Transaction = {
                id: Date.now().toString(),
                type: 'sell',
                amount,
                from: currentUser.username,
                to: 'system',
                timestamp: new Date().toISOString()
            };
            
            const updatedAccounts = accounts.map(acc => {
                if (acc.username === currentUser.username) {
                    return {
                        ...acc,
                        balance: acc.balance - amount,
                        transactions: [newTransaction, ...acc.transactions]
                    };
                }
                return acc;
            });
            updateAccounts(updatedAccounts);
            resolve();
        });
    }, [currentUser, accounts, updateAccounts]);

    const transferUsdqs = useCallback((recipientUsername: string, amount: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!currentUser) return reject(new Error('not_logged_in'));
            if (currentUser.username === recipientUsername) return reject(new Error('self_transfer'));

            const senderAccount = accounts.find(acc => acc.username === currentUser.username);
            const recipientAccount = accounts.find(acc => acc.username === recipientUsername);

            if (!senderAccount || senderAccount.balance < amount) return reject(new Error('insufficient_funds'));
            if (!recipientAccount) return reject(new Error('recipient_not_found'));

            const senderTransaction: Transaction = {
                id: Date.now().toString() + '_sent',
                type: 'transfer_sent',
                amount,
                from: currentUser.username,
                to: recipientUsername,
                timestamp: new Date().toISOString()
            };

            const recipientTransaction: Transaction = {
                id: Date.now().toString() + '_received',
                type: 'transfer_received',
                amount,
                from: currentUser.username,
                to: recipientUsername,
                timestamp: new Date().toISOString()
            };

            const updatedAccounts = accounts.map(acc => {
                if (acc.username === currentUser.username) {
                    return { ...acc, balance: acc.balance - amount, transactions: [senderTransaction, ...acc.transactions] };
                }
                if (acc.username === recipientUsername) {
                    return { ...acc, balance: acc.balance + amount, transactions: [recipientTransaction, ...acc.transactions] };
                }
                return acc;
            });

            updateAccounts(updatedAccounts);
            resolve();
        });
    }, [currentUser, accounts, updateAccounts]);


    return (
        <AccountContext.Provider value={{ myAccount, buyUsdqs, sellUsdqs, transferUsdqs }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};