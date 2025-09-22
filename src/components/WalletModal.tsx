
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccount } from '../contexts/AccountContext';
import { Transaction } from '../types';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const { t } = useLanguage();
    
    const renderDetails = () => {
        switch(tx.type) {
            case 'purchase':
                return { text: t('wallet.transaction.purchase', {amount: tx.amount}), color: 'text-green-400', sign: '+'};
            case 'sell':
                 return { text: t('wallet.transaction.sell', {amount: tx.amount}), color: 'text-red-400', sign: '-'};
            case 'transfer_sent':
                return { text: t('wallet.transaction.sent', {amount: tx.amount, to: tx.to}), color: 'text-red-400', sign: '-'};
            case 'transfer_received':
                return { text: t('wallet.transaction.received', {amount: tx.amount, from: tx.from}), color: 'text-green-400', sign: '+'};
            default:
                return { text: 'Unknown transaction', color: 'text-gray-400', sign: ''};
        }
    };
    
    const { text, color, sign } = renderDetails();
    
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <div>
                <p className={color}>{text}</p>
                <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>
            <p className={`${color} font-semibold`}>
                {sign} {tx.amount.toFixed(2)} USDQS
            </p>
        </div>
    );
};

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { myAccount, transferUsdqs } = useAccount();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        const transferAmount = parseFloat(amount);
        if (!recipient || isNaN(transferAmount) || transferAmount <= 0) {
            showMessage(t('transfer.error.invalid_amount'), 'error');
            return;
        }

        try {
            await transferUsdqs(recipient, transferAmount);
            showMessage(t('transfer.success', { amount: transferAmount, to: recipient }), 'success');
            setRecipient('');
            setAmount('');
        } catch (error) {
            const errorKey = (error as Error).message;
            if (errorKey === 'recipient_not_found') {
                showMessage(t('transfer.error.not_found', { recipient }), 'error');
            } else if(errorKey === 'self_transfer') {
                showMessage(t('transfer.error.self'), 'error');
            } else if(errorKey === 'insufficient_funds') {
                showMessage(t('transfer.error.insufficient'), 'error');
            } else {
                 showMessage(errorKey, 'error');
            }
        }
    };
    
    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 5000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="card rounded-2xl p-8 w-full max-w-lg mx-4 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold gradient-text">{t('wallet.title')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="mb-6 card p-4 rounded-lg bg-gray-900">
                    <p className="text-gray-400">{t('wallet.balance')}</p>
                    <p className="text-3xl font-bold gradient-text">{myAccount?.balance.toFixed(2) || '0.00'} USDQS</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">{t('wallet.send_usdqs')}</h3>
                    <form onSubmit={handleTransfer} className="space-y-4">
                        <input type="text" placeholder={t('wallet.recipient')} value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <input type="number" placeholder={t('wallet.amount')} value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-full transition-colors">{t('wallet.send_button')}</button>
                    </form>
                    {message && (
                        <div className={`mt-4 p-3 rounded-md text-sm text-center ${message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <div className="flex-grow overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4 text-white">{t('wallet.transaction_history')}</h3>
                    <div className="space-y-2">
                        {myAccount?.transactions && myAccount.transactions.length > 0 ? (
                            myAccount.transactions.map(tx => <TransactionItem key={tx.id} tx={tx} />)
                        ) : (
                            <p className="text-gray-500 text-center py-4">{t('wallet.no_transactions')}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};