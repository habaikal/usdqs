import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AccountProvider } from './contexts/AccountContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { WalletModal } from './components/WalletModal';

import { MainPage } from './components/MainPage';
import { WhitepaperPage } from './components/WhitepaperPage';
import { DaoGovernancePage } from './components/DaoGovernancePage';

const AppContent: React.FC = () => {
    const [page, setPage] = useState('main');
    const [targetAnchor, setTargetAnchor] = useState('');
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isWalletModalOpen, setWalletModalOpen] = useState(false);

    // Effect 1: Centralized hash change handler to set page and anchor states.
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/')) {
                const newPage = hash.substring(2);
                setPage(newPage);
                setTargetAnchor(''); // Clear anchor when navigating to a new page
            } else {
                setPage('main');
                setTargetAnchor(hash.substring(1)); // Set anchor for main page scrolling
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Initial check on load

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Effect 2: Handles scrolling after page/anchor state has been updated and components have rendered.
    useEffect(() => {
        if (page !== 'main') {
            // For sub-pages, always scroll to the top.
            window.scrollTo(0, 0);
            return;
        }

        // For the main page, handle scrolling to an anchor.
        if (targetAnchor) {
            const timer = setTimeout(() => {
                const element = document.getElementById(targetAnchor);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100); // Small delay to ensure the element is rendered
            return () => clearTimeout(timer);
        } else {
            // If on main page without a target anchor, scroll to top.
            // This happens on initial load or when navigating to '#' or just the base URL.
            window.scrollTo(0, 0);
        }
    }, [page, targetAnchor]);


    const renderPage = () => {
        switch (page) {
            case 'whitepaper':
                return <WhitepaperPage />;
            case 'governance':
                return <DaoGovernancePage />;
            default: // also handles 'main'
                return <MainPage />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            <Header 
                onAuthClick={() => setAuthModalOpen(true)}
                onWalletClick={() => setWalletModalOpen(true)} 
            />
            <main className="w-full max-w-7xl mx-auto pt-32 px-4">
                {renderPage()}
            </main>
            <Footer />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
            <WalletModal isOpen={isWalletModalOpen} onClose={() => setWalletModalOpen(false)} />
        </div>
    );
};


function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <AccountProvider>
                    <AppContent />
                </AccountProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;