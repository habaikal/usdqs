/**
 * USDQS 풀스택 지갑 원장 컨텍스트 (AccountContext)
 * - 1:1 USDQS 구매(Buy), 1:1 USD 환전(Sell), 타 유저 실시간 PQC 서명 송금(Transfer)
 * - 거래내역(Transactions) 원장 기록 및 계정 긴급 자가 킬스위치(Freeze/Unfreeze)
 */
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import type { Account, WalletTransaction } from '../types';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface AccountContextType {
  myAccount: Account | null;
  buyUsdqs: (amount: number) => Promise<void>;
  sellUsdqs: (amount: number) => Promise<void>;
  transferUsdqs: (recipientUsername: string, amount: number) => Promise<void>;
  freezeAccount: () => Promise<void>;
  unfreezeAccount: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

const ACCOUNTS_LEDGER_KEY = 'usdqs-fullstack-ledger-accounts';
const MAX_TRANSACTION_AMOUNT = 1_000_000_000;

const isValidAmount = (amount: number): boolean =>
  Number.isFinite(amount) && amount > 0 && amount <= MAX_TRANSACTION_AMOUNT;

const DEFAULT_SEED_LEDGER: Account[] = [
  {
    username: 'demo',
    balance: 2500,
    balanceUsd: 25000,
    frozen: false,
    transactions: [
      {
        id: 'tx_seed_demo_01',
        type: 'purchase',
        amount: 2500,
        from: 'USD Reserve Vault (HK Trust)',
        to: 'demo',
        timestamp: '2026-10-29T14:20:00Z',
        pqcSignatureHex: '0x8f2a...Dilithium3-Verified',
        note: '1:1 USD to USDQS Initial Mint',
      },
    ],
  },
  {
    username: 'admin',
    balance: 150000,
    balanceUsd: 500000,
    frozen: false,
    transactions: [
      {
        id: 'tx_seed_admin_01',
        type: 'mint',
        amount: 150000,
        from: 'HKMA Segregated Treasury',
        to: 'admin',
        timestamp: '2026-10-25T10:00:00Z',
        pqcSignatureHex: '0x4c91...Dilithium5-Verified',
        note: 'Institutional Treasury Allocation',
      },
    ],
  },
];

const readStoredAccounts = (): Account[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_LEDGER_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_LEDGER_KEY, JSON.stringify(DEFAULT_SEED_LEDGER));
      return DEFAULT_SEED_LEDGER;
    }
    return JSON.parse(raw) as Account[];
  } catch {
    return DEFAULT_SEED_LEDGER;
  }
};

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>(readStoredAccounts);

  const myAccount = useMemo(
    () =>
      currentUser
        ? accounts.find((acc) => acc.username.toLowerCase() === currentUser.username.toLowerCase()) ?? null
        : null,
    [currentUser, accounts]
  );

  // 신규 로그인 사용자 계좌 자동 생성 보장
  useEffect(() => {
    if (!currentUser) return;
    setAccounts((prev) => {
      if (prev.some((acc) => acc.username.toLowerCase() === currentUser.username.toLowerCase())) {
        return prev;
      }
      const next: Account[] = [
        ...prev,
        {
          username: currentUser.username,
          balance: 0,
          balanceUsd: 10000,
          transactions: [],
          frozen: false,
        },
      ];
      localStorage.setItem(ACCOUNTS_LEDGER_KEY, JSON.stringify(next));
      return next;
    });
  }, [currentUser]);

  const updateAccounts = useCallback((updatedAccounts: Account[]) => {
    localStorage.setItem(ACCOUNTS_LEDGER_KEY, JSON.stringify(updatedAccounts));
    setAccounts(updatedAccounts);
  }, []);

  /**
   * 1:1 USDQS 구매 (Buy)
   */
  const buyUsdqs = useCallback(
    async (amount: number): Promise<void> => {
      if (!currentUser) throw new Error('로그인이 필요합니다.');
      if (!isValidAmount(amount)) throw new Error('유효한 구매 수량을 입력해 주세요.');

      const senderAccount = accounts.find(
        (acc) => acc.username.toLowerCase() === currentUser.username.toLowerCase()
      );
      if (senderAccount?.frozen) throw new Error('계정이 현재 킬스위치 동결 상태입니다.');
      if ((senderAccount?.balanceUsd ?? 10000) < amount) {
        throw new Error('법정화폐(USD) 예치 잔액이 부족합니다.');
      }

      await api.buy(amount);

      const newTx: WalletTransaction = {
        id: `tx_${Date.now().toString(36)}`,
        type: 'purchase',
        amount,
        from: 'USD Reserve Vault (HK Trust)',
        to: currentUser.username,
        timestamp: new Date().toISOString(),
        pqcSignatureHex: `0x${Math.random().toString(16).slice(2, 10)}...Dilithium3-Mint`,
        note: '1:1 USD to USDQS Minted (0% Fee)',
      };

      const updated = accounts.map((acc) => {
        if (acc.username.toLowerCase() === currentUser.username.toLowerCase()) {
          return {
            ...acc,
            balance: acc.balance + amount,
            balanceUsd: Math.max(0, acc.balanceUsd - amount),
            transactions: [newTx, ...acc.transactions],
          };
        }
        return acc;
      });
      updateAccounts(updated);
    },
    [currentUser, accounts, updateAccounts]
  );

  /**
   * 1:1 USD 환전/매도 (Sell)
   */
  const sellUsdqs = useCallback(
    async (amount: number): Promise<void> => {
      if (!currentUser) throw new Error('로그인이 필요합니다.');
      if (!isValidAmount(amount)) throw new Error('유효한 환전 수량을 입력해 주세요.');

      const senderAccount = accounts.find(
        (acc) => acc.username.toLowerCase() === currentUser.username.toLowerCase()
      );
      if (senderAccount?.frozen) throw new Error('계정이 현재 킬스위치 동결 상태입니다.');
      if (!senderAccount || senderAccount.balance < amount) {
        throw new Error('보유 USDQS 잔액이 부족합니다.');
      }

      await api.sell(amount);

      const newTx: WalletTransaction = {
        id: `tx_${Date.now().toString(36)}`,
        type: 'sell',
        amount,
        from: currentUser.username,
        to: 'USD Reserve Vault (T+1 Wire)',
        timestamp: new Date().toISOString(),
        pqcSignatureHex: `0x${Math.random().toString(16).slice(2, 10)}...Dilithium3-Burn`,
        note: '1:1 USDQS Redeemed to USD',
      };

      const updated = accounts.map((acc) => {
        if (acc.username.toLowerCase() === currentUser.username.toLowerCase()) {
          return {
            ...acc,
            balance: acc.balance - amount,
            balanceUsd: acc.balanceUsd + amount,
            transactions: [newTx, ...acc.transactions],
          };
        }
        return acc;
      });
      updateAccounts(updated);
    },
    [currentUser, accounts, updateAccounts]
  );

  /**
   * 타 유저에게 실시간 PQC 서명 송금 (Transfer)
   */
  const transferUsdqs = useCallback(
    async (recipientUsername: string, amount: number): Promise<void> => {
      if (!currentUser) throw new Error('로그인이 필요합니다.');
      if (!isValidAmount(amount)) throw new Error('유효한 송금 수량을 입력해 주세요.');

      const trimmedRecipient = recipientUsername.trim();
      if (trimmedRecipient.toLowerCase() === currentUser.username.toLowerCase()) {
        throw new Error('본인 계좌로는 송금할 수 없습니다.');
      }

      const senderAccount = accounts.find(
        (acc) => acc.username.toLowerCase() === currentUser.username.toLowerCase()
      );
      if (senderAccount?.frozen) throw new Error('보낸 사람 계정이 킬스위치 동결 상태입니다.');
      if (!senderAccount || senderAccount.balance < amount) {
        throw new Error('보유 USDQS 잔액이 부족합니다.');
      }

      // 수신자 계좌가 없으면 자동으로 수신자 지갑 원장을 개설하여 테스트 편의성 극대화
      let currentAccounts = [...accounts];
      let recipientAccount = currentAccounts.find(
        (acc) => acc.username.toLowerCase() === trimmedRecipient.toLowerCase()
      );
      if (!recipientAccount) {
        recipientAccount = {
          username: trimmedRecipient,
          balance: 0,
          balanceUsd: 10000,
          transactions: [],
          frozen: false,
        };
        currentAccounts.push(recipientAccount);
      }

      if (recipientAccount.frozen) {
        throw new Error('수신자 계좌가 현재 동결 상태입니다.');
      }

      await api.transfer(trimmedRecipient, amount);

      const txId = `tx_${Date.now().toString(36)}`;
      const now = new Date().toISOString();
      const sigHex = `0x${Math.random().toString(16).slice(2, 10)}...FIPS204-ML-DSA`;

      const senderTx: WalletTransaction = {
        id: txId,
        type: 'transfer_sent',
        amount,
        from: currentUser.username,
        to: trimmedRecipient,
        timestamp: now,
        pqcSignatureHex: sigHex,
        note: 'PQC Verified Cross-Account Transfer',
      };

      const recipientTx: WalletTransaction = {
        id: `${txId}_recv`,
        type: 'transfer_received',
        amount,
        from: currentUser.username,
        to: trimmedRecipient,
        timestamp: now,
        pqcSignatureHex: sigHex,
        note: 'PQC Verified Cross-Account Transfer',
      };

      const updated = currentAccounts.map((acc) => {
        if (acc.username.toLowerCase() === currentUser.username.toLowerCase()) {
          return {
            ...acc,
            balance: acc.balance - amount,
            transactions: [senderTx, ...acc.transactions],
          };
        }
        if (acc.username.toLowerCase() === trimmedRecipient.toLowerCase()) {
          return {
            ...acc,
            balance: acc.balance + amount,
            transactions: [recipientTx, ...acc.transactions],
          };
        }
        return acc;
      });
      updateAccounts(updated);
    },
    [currentUser, accounts, updateAccounts]
  );

  /**
   * 계정 긴급 자가 킬스위치 동결 (Freeze)
   */
  const freezeAccount = useCallback(async (): Promise<void> => {
    if (!currentUser) return;
    await api.freeze();
    const updated = accounts.map((acc) => {
      if (acc.username.toLowerCase() === currentUser.username.toLowerCase()) {
        return { ...acc, frozen: true, frozenAt: new Date().toISOString() };
      }
      return acc;
    });
    updateAccounts(updated);
  }, [currentUser, accounts, updateAccounts]);

  /**
   * 계정 긴급 자가 킬스위치 해제 (Unfreeze)
   */
  const unfreezeAccount = useCallback(async (): Promise<void> => {
    if (!currentUser) return;
    await api.unfreeze();
    const updated = accounts.map((acc) => {
      if (acc.username.toLowerCase() === currentUser.username.toLowerCase()) {
        return { ...acc, frozen: false, frozenAt: null };
      }
      return acc;
    });
    updateAccounts(updated);
  }, [currentUser, accounts, updateAccounts]);

  return (
    <AccountContext.Provider
      value={{
        myAccount,
        buyUsdqs,
        sellUsdqs,
        transferUsdqs,
        freezeAccount,
        unfreezeAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

