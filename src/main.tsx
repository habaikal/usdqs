import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext'
import { Web3Provider } from './context/Web3Context'
import { AuthProvider } from './context/AuthContext'
import { AccountProvider } from './context/AccountContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <AccountProvider>
          <Web3Provider>
            <App />
          </Web3Provider>
        </AccountProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)

