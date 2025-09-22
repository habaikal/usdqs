
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { login, signup } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!username || !password) {
            showMessage(t('auth.error.required'), 'error');
            return;
        }

        const user: User = { username, password };
        
        try {
            if (isLoginView) {
                await login(user);
                showMessage(t('auth.login_success', {username}), 'success');
                setTimeout(() => {
                    onClose();
                    resetForm();
                }, 1500);
            } else {
                await signup(user);
                showMessage(t('auth.signup_success'), 'success');
                setIsLoginView(true); // Switch to login view after successful signup
            }
        } catch (error) {
            const errorKey = (error as Error).message;
            showMessage(t(`auth.error.${errorKey}`), 'error');
        }
    };
    
    const resetForm = () => {
        setUsername('');
        setPassword('');
        setMessage(null);
    }
    
    const handleClose = () => {
        resetForm();
        onClose();
    }

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 5000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300" onClick={handleClose}>
            <div className="card rounded-2xl p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold gradient-text">{isLoginView ? t('auth.login') : t('auth.signup')}</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                <div className="flex border-b border-gray-700 mb-6">
                    <button onClick={() => setIsLoginView(true)} className={`py-2 px-4 text-lg font-semibold ${isLoginView ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>{t('auth.login')}</button>
                    <button onClick={() => setIsLoginView(false)} className={`py-2 px-4 text-lg font-semibold ${!isLoginView ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}>{t('auth.signup')}</button>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">{t('auth.username')}</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">{t('auth.password')}</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-full transition-colors">
                        {isLoginView ? t('auth.login') : t('auth.signup')}
                    </button>
                </form>
                 {message && (
                    <div className={`mt-4 p-3 rounded-md text-sm text-center ${message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};
