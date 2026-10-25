import React, { createContext, useContext, useState, useEffect } from 'react';

// Ethereum window provider declaration
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

interface Web3ContextType {
  account: string | null;
  balance: string | null;
  chainId: string | null;
  isMetaMaskInstalled: boolean;
  isConnecting: boolean;
  error: string | null;
  connectMetaMask: () => Promise<boolean>;
  connectSandbox: (walletName: string) => void;
  disconnect: () => void;
  addUsdqsTokenToMetaMask: () => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);

  // Check if MetaMask is present in browser
  useEffect(() => {
    const hasMetaMask = typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask);
    setIsMetaMaskInstalled(hasMetaMask);

    // Auto reconnect if previously connected
    if (hasMetaMask && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          const accs = accounts as string[];
          if (accs && accs.length > 0) {
            handleAccount(accs[0]);
          }
        })
        .catch(() => {});

      // Event listeners
      const handleAccountsChanged = (accounts: unknown) => {
        const accs = accounts as string[];
        if (accs && accs.length > 0) {
          handleAccount(accs[0]);
        } else {
          disconnect();
        }
      };

      const handleChainChanged = (newChainId: unknown) => {
        setChainId(newChainId as string);
        if (account) {
          fetchBalance(account);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [account]);

  const fetchBalance = async (acc: string) => {
    if (!window.ethereum) return;
    try {
      const balanceHex = (await window.ethereum.request({
        method: 'eth_getBalance',
        params: [acc, 'latest']
      })) as string;

      // Convert hex wei to ETH float
      const wei = parseInt(balanceHex, 16);
      const eth = (wei / 1e18).toFixed(4);
      setBalance(eth);
    } catch (err) {
      console.warn('Failed to fetch on-chain balance:', err);
    }
  };

  const handleAccount = async (acc: string) => {
    setAccount(acc);
    if (window.ethereum) {
      try {
        const cId = (await window.ethereum.request({ method: 'eth_chainId' })) as string;
        setChainId(cId);
        await fetchBalance(acc);
      } catch (err) {
        console.warn('Failed to query chainId', err);
      }
    }
  };

  // Real MetaMask Connection (EIP-1193)
  const connectMetaMask = async (): Promise<boolean> => {
    setError(null);
    if (!window.ethereum) {
      setError('MetaMask extension is not installed in your browser.');
      return false;
    }

    try {
      setIsConnecting(true);
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts'
      })) as string[];

      if (accounts && accounts.length > 0) {
        await handleAccount(accounts[0]);
        setIsConnecting(false);
        return true;
      }
      setIsConnecting(false);
      return false;
    } catch (err: unknown) {
      setIsConnecting(false);
      const message = err instanceof Error ? err.message : 'MetaMask connection rejected by user';
      setError(message);
      return false;
    }
  };

  // Sandbox simulation fallback for testing or other wallets
  const connectSandbox = (walletName: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setAccount('0x71C8A9b14299bE6B34f9a3E02C953bF9112949bF');
      setBalance('2.4815');
      setChainId('0x1');
      console.log(`Connected to ${walletName} sandbox`);
    }, 800);
  };

  const disconnect = () => {
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setError(null);
  };

  // Add USDQS Token to MetaMask (EIP-747)
  const addUsdqsTokenToMetaMask = async (): Promise<boolean> => {
    if (!window.ethereum) return false;
    try {
      const wasAdded = (await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: '0xdac17f958d2ee523a2206206994597c13d831ec7', // Verified contract reference
            symbol: 'USDQS',
            decimals: 6,
            image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
          },
        },
      })) as boolean;
      return Boolean(wasAdded);
    } catch (err) {
      console.warn('Failed to add token to MetaMask:', err);
      return false;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        chainId,
        isMetaMaskInstalled,
        isConnecting,
        error,
        connectMetaMask,
        connectSandbox,
        disconnect,
        addUsdqsTokenToMetaMask,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
