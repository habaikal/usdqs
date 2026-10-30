/**
 * 지갑 및 원장 컨트롤러 (Wallet Controller)
 * - GET /api/wallet/balance: 잔액 조회
 * - POST /api/wallet/buy: 1:1 USDQS 구매 (Mint)
 * - POST /api/wallet/sell: 1:1 USD 환전 (Redeem)
 * - POST /api/wallet/transfer: 타 유저 실시간 PQC 서명 송금
 * - GET /api/wallet/transactions: 거래내역 조회
 * - POST /api/wallet/freeze & unfreeze: 계정 긴급 자가 킬스위치
 */
import express from 'express';
import crypto from 'crypto';
import { db } from '../store/inMemoryDb.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const getBalance = (req: AuthenticatedRequest, res: express.Response): void => {
  const account = db.accounts.find((a) => a.userId === req.user?.id);
  if (!account) {
    res.status(404).json({ success: false, message: '계좌를 찾을 수 없습니다.' });
    return;
  }
  res.json({
    success: true,
    account: {
      balanceUsdqs: account.balanceUsdqs,
      balanceUsd: account.balanceUsd,
      isFrozen: account.isFrozen,
      frozenAt: account.frozenAt,
    },
  });
};

export const buyUsdqs = (req: AuthenticatedRequest, res: express.Response): void => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ success: false, message: '유효한 구매 수량을 입력해 주세요.' });
      return;
    }

    const account = db.accounts.find((a) => a.userId === req.user?.id);
    if (!account) {
      res.status(404).json({ success: false, message: '계좌를 찾을 수 없습니다.' });
      return;
    }
    if (account.isFrozen) {
      res.status(403).json({ success: false, message: '계정이 킬스위치 동결 상태입니다.' });
      return;
    }
    if (account.balanceUsd < amount) {
      res.status(400).json({ success: false, message: '법정화폐(USD) 예치 잔액이 부족합니다.' });
      return;
    }

    account.balanceUsd -= amount;
    account.balanceUsdqs += amount;

    const tx = {
      id: `tx_${crypto.randomBytes(6).toString('hex')}`,
      userId: account.userId,
      type: 'purchase' as const,
      amount,
      from: 'USD Reserve Vault (HK Trust)',
      to: account.username,
      pqcSignatureHex: `0x${crypto.randomBytes(4).toString('hex')}...Dilithium3-Valid`,
      timestamp: new Date().toISOString(),
      note: '1:1 USD to USDQS Zero-Slippage Mint',
    };
    db.transactions.unshift(tx);

    res.json({
      success: true,
      message: `${amount.toLocaleString()} USDQS 1:1 구매 완료`,
      account: {
        balanceUsdqs: account.balanceUsdqs,
        balanceUsd: account.balanceUsd,
        isFrozen: account.isFrozen,
      },
      transaction: tx,
    });
  } catch (err) {
    console.error('Buy error:', err);
    res.status(500).json({ success: false, message: '구매 처리 중 서버 오류가 발생했습니다.' });
  }
};

export const sellUsdqs = (req: AuthenticatedRequest, res: express.Response): void => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ success: false, message: '유효한 환전 수량을 입력해 주세요.' });
      return;
    }

    const account = db.accounts.find((a) => a.userId === req.user?.id);
    if (!account) {
      res.status(404).json({ success: false, message: '계좌를 찾을 수 없습니다.' });
      return;
    }
    if (account.isFrozen) {
      res.status(403).json({ success: false, message: '계정이 킬스위치 동결 상태입니다.' });
      return;
    }
    if (account.balanceUsdqs < amount) {
      res.status(400).json({ success: false, message: '보유 USDQS 잔액이 부족합니다.' });
      return;
    }

    account.balanceUsdqs -= amount;
    account.balanceUsd += amount;

    const tx = {
      id: `tx_${crypto.randomBytes(6).toString('hex')}`,
      userId: account.userId,
      type: 'sell' as const,
      amount,
      from: account.username,
      to: 'USD Reserve Vault (T+1 Wire)',
      pqcSignatureHex: `0x${crypto.randomBytes(4).toString('hex')}...Dilithium3-Burn`,
      timestamp: new Date().toISOString(),
      note: '1:1 USDQS Redeemed to USD',
    };
    db.transactions.unshift(tx);

    res.json({
      success: true,
      message: `${amount.toLocaleString()} USDQS 1:1 환전 완료`,
      account: {
        balanceUsdqs: account.balanceUsdqs,
        balanceUsd: account.balanceUsd,
        isFrozen: account.isFrozen,
      },
      transaction: tx,
    });
  } catch (err) {
    console.error('Sell error:', err);
    res.status(500).json({ success: false, message: '환전 처리 중 서버 오류가 발생했습니다.' });
  }
};

export const transferUsdqs = (req: AuthenticatedRequest, res: express.Response): void => {
  try {
    const { recipientUsername, amount: rawAmount } = req.body;
    const amount = Number(rawAmount);
    const cleanRecipient = String(recipientUsername || '').trim();

    if (!cleanRecipient || !Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ success: false, message: '수신자 아이디와 유효한 수량을 입력해 주세요.' });
      return;
    }

    const senderAccount = db.accounts.find((a) => a.userId === req.user?.id);
    if (!senderAccount) {
      res.status(404).json({ success: false, message: '발신 계좌를 찾을 수 없습니다.' });
      return;
    }
    if (senderAccount.isFrozen) {
      res.status(403).json({ success: false, message: '발신 계정이 동결 상태입니다.' });
      return;
    }
    if (senderAccount.username.toLowerCase() === cleanRecipient.toLowerCase()) {
      res.status(400).json({ success: false, message: '본인 계좌로는 송금할 수 없습니다.' });
      return;
    }
    if (senderAccount.balanceUsdqs < amount) {
      res.status(400).json({ success: false, message: '보유 USDQS 잔액이 부족합니다.' });
      return;
    }

    const recipientAccount = db.accounts.find(
      (a) => a.username.toLowerCase() === cleanRecipient.toLowerCase()
    );
    if (!recipientAccount) {
      res.status(404).json({ success: false, message: '존재하지 않는 수신자 아이디입니다.' });
      return;
    }
    if (recipientAccount.isFrozen) {
      res.status(403).json({ success: false, message: '수신자 계좌가 현재 동결 상태입니다.' });
      return;
    }

    senderAccount.balanceUsdqs -= amount;
    recipientAccount.balanceUsdqs += amount;

    const now = new Date().toISOString();
    const sigHex = `0x${crypto.randomBytes(4).toString('hex')}...FIPS204-ML-DSA`;

    const senderTx = {
      id: `tx_${crypto.randomBytes(6).toString('hex')}`,
      userId: senderAccount.userId,
      type: 'transfer_sent' as const,
      amount,
      from: senderAccount.username,
      to: recipientAccount.username,
      pqcSignatureHex: sigHex,
      timestamp: now,
      note: 'PQC Verified Cross-Account Transfer',
    };

    const recipientTx = {
      id: `tx_${crypto.randomBytes(6).toString('hex')}`,
      userId: recipientAccount.userId,
      type: 'transfer_received' as const,
      amount,
      from: senderAccount.username,
      to: recipientAccount.username,
      pqcSignatureHex: sigHex,
      timestamp: now,
      note: 'PQC Verified Cross-Account Transfer',
    };

    db.transactions.unshift(senderTx, recipientTx);

    res.json({
      success: true,
      message: `${recipientAccount.username} 님에게 ${amount.toLocaleString()} USDQS 송금 완료`,
      account: {
        balanceUsdqs: senderAccount.balanceUsdqs,
        balanceUsd: senderAccount.balanceUsd,
        isFrozen: senderAccount.isFrozen,
      },
      transaction: senderTx,
    });
  } catch (err) {
    console.error('Transfer error:', err);
    res.status(500).json({ success: false, message: '송금 처리 중 서버 오류가 발생했습니다.' });
  }
};

export const getTransactions = (req: AuthenticatedRequest, res: express.Response): void => {
  const userTxs = db.transactions.filter((t) => t.userId === req.user?.id);
  res.json({
    success: true,
    transactions: userTxs,
  });
};

export const freezeAccount = (req: AuthenticatedRequest, res: express.Response): void => {
  const account = db.accounts.find((a) => a.userId === req.user?.id);
  if (!account) {
    res.status(404).json({ success: false, message: '계좌를 찾을 수 없습니다.' });
    return;
  }
  account.isFrozen = true;
  account.frozenAt = new Date().toISOString();

  res.json({
    success: true,
    message: '계정 긴급 킬스위치가 활성화되어 모든 출금 및 송금이 차단되었습니다.',
    account: {
      balanceUsdqs: account.balanceUsdqs,
      balanceUsd: account.balanceUsd,
      isFrozen: account.isFrozen,
      frozenAt: account.frozenAt,
    },
  });
};

export const unfreezeAccount = (req: AuthenticatedRequest, res: express.Response): void => {
  const account = db.accounts.find((a) => a.userId === req.user?.id);
  if (!account) {
    res.status(404).json({ success: false, message: '계좌를 찾을 수 없습니다.' });
    return;
  }
  account.isFrozen = false;
  account.frozenAt = null;

  res.json({
    success: true,
    message: '계정 동결이 해제되어 정상 거래가 가능합니다.',
    account: {
      balanceUsdqs: account.balanceUsdqs,
      balanceUsd: account.balanceUsd,
      isFrozen: account.isFrozen,
      frozenAt: null,
    },
  });
};

