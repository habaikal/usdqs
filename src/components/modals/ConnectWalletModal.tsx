import React, { useState } from 'react';
import { X, Wallet, CheckCircle2, RefreshCw, PlusCircle, AlertCircle, Check } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useWeb3 } from '../../context/Web3Context';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const {
    account,
    balance,
    chainId,
    isMetaMaskInstalled,
    isConnecting,
    error,
    connectMetaMask,
    connectSandbox,
    disconnect,
    addUsdqsTokenToMetaMask
  } = useWeb3();

  const [tokenAddedSuccess, setTokenAddedSuccess] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState('MetaMask');

  if (!isOpen) return null;

  const handleWalletSelect = async (walletId: string, name: string) => {
    setSelectedWalletName(name);
    if (walletId === 'metamask') {
      if (isMetaMaskInstalled) {
        await connectMetaMask();
      } else {
        // Fallback to sandbox if MetaMask is missing
        connectSandbox(name);
      }
    } else {
      // Connect other wallets via simulated provider
      connectSandbox(name);
    }
  };

  const handleAddToken = async () => {
    const success = await addUsdqsTokenToMetaMask();
    if (success) {
      setTokenAddedSuccess(true);
      setTimeout(() => setTokenAddedSuccess(false), 3000);
    }
  };

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      symbol: '🦊',
      desc: isMetaMaskInstalled ? 'EIP-1193 Browser Extension Detected' : 'Click to connect (or launch sandbox)'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      symbol: '👻',
      desc: 'Solana, Ethereum & Polygon multi-chain'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      symbol: '🔵',
      desc: 'Self-custody institutional Web3 portal'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      symbol: '🔗',
      desc: 'Mobile QR code connection'
    },
  ];

  const getNetworkName = (id: string | null) => {
    if (!id) return 'Unknown Network';
    if (id === '0x1') return 'Ethereum Mainnet';
    if (id === '0xaa36a7') return 'Sepolia Testnet';
    if (id === '0x89') return 'Polygon Mainnet';
    if (id === '0xa4b1') return 'Arbitrum One';
    return `Chain ID: ${id}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0a101f] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl overflow-hidden">
        
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                {account ? t.walletModal.connectedTitle : t.walletModal.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {t.walletModal.subtitle}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="py-6">
          {account ? (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  {t.walletModal.connectTo} {selectedWalletName}
                </h4>
                <div className="flex items-center justify-center gap-1.5 mt-1 font-mono text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{account}</span>
                </div>
                <span className="inline-block mt-1 text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {getNetworkName(chainId)}
                </span>
              </div>

              {/* On-Chain Balances */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.walletModal.balanceUSDQS}:</span>
                  <span className="text-white font-bold">124,500.00 USDQS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.walletModal.usdValuation}:</span>
                  <span className="text-emerald-400 font-bold">$124,512.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.walletModal.nativeBalance}:</span>
                  <span className="text-slate-200 font-bold">{balance ? `${balance} ETH` : '0.0000 ETH'}</span>
                </div>
              </div>

              {/* Add USDQS Token to MetaMask Button */}
              {isMetaMaskInstalled && (
                <button
                  type="button"
                  onClick={handleAddToken}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {tokenAddedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{t.walletModal.tokenAdded}</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      <span>{t.walletModal.addToken}</span>
                    </>
                  )}
                </button>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 text-xs cursor-pointer"
                >
                  {t.walletModal.proceedMint}
                </button>
                <button
                  onClick={disconnect}
                  className="px-4 py-3 rounded-xl font-semibold text-rose-400 bg-rose-950/30 border border-rose-800/40 hover:bg-rose-900/30 text-xs cursor-pointer"
                >
                  {t.walletModal.disconnect}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet.id, wallet.name)}
                  disabled={isConnecting}
                  className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 flex items-center justify-between transition-all cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.symbol}</span>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                        <span>{wallet.name}</span>
                        {wallet.id === 'metamask' && isMetaMaskInstalled && (
                          <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                            Detected
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {wallet.desc}
                      </div>
                    </div>
                  </div>

                  {isConnecting && selectedWalletName === wallet.name ? (
                    <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-emerald-400">
                      Connect →
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            {t.walletModal.terms}
          </p>
        </div>

      </div>
    </div>
  );
};
