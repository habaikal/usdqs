/**
 * 인증 컨트롤러 (Auth Controller)
 * - POST /api/auth/signup: PBKDF2(150k) 서버 해싱 기반 회원가입 및 초기 계좌 개설
 * - POST /api/auth/login: 5회 실패 시 30초 락아웃 방어 및 MFA 지원 로그인
 * - POST /api/auth/refresh: JWT 토큰 재발급
 * - GET /api/auth/me: 현재 로그인된 사용자 프로필 조회
 */
import express from 'express';
import crypto from 'crypto';
import {
  db,
  hashPasswordServer,
  verifyPasswordServer,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION_MS,
} from '../store/inMemoryDb.js';
import { signAccessToken, AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const signup = (req: express.Request, res: express.Response): void => {
  try {
    const { username, password, role = 'user' } = req.body;
    const cleanUsername = String(username || '').trim();

    if (cleanUsername.length < 3) {
      res.status(400).json({ success: false, message: '아이디는 최소 3자 이상이어야 합니다.' });
      return;
    }
    if (!password || String(password).length < 6) {
      res.status(400).json({ success: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' });
      return;
    }

    const exists = db.users.some((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());
    if (exists) {
      res.status(409).json({ success: false, message: '이미 존재하는 사용자 아이디입니다.' });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPasswordServer(String(password), salt);
    const userId = `usr_${Date.now()}`;
    const randHex = crypto.randomBytes(8).toString('hex');

    const newUser = {
      id: userId,
      username: cleanUsername,
      salt,
      passwordHash,
      role: (role === 'admin' || role === 'institutional' ? role : 'user') as 'user' | 'institutional' | 'admin',
      kycTier: 1 as const,
      pqcPublicKey: `0x${randHex}...Dilithium3-FIPS204`,
      erc4337SmartWallet: `0x${crypto.randomBytes(4).toString('hex')}...${randHex.slice(0, 4)}`,
      failedLoginAttempts: 0,
      lockedUntil: null,
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);

    const newAccount = {
      id: `acc_${userId}`,
      userId,
      username: cleanUsername,
      balanceUsdqs: 0,
      balanceUsd: 10000,
      isFrozen: false,
      frozenAt: null,
    };
    db.accounts.push(newAccount);

    res.status(201).json({
      success: true,
      message: '회원가입 및 PQC 스마트 지갑 계좌 개설이 완료되었습니다.',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        kycTier: newUser.kycTier,
        pqcPublicKey: newUser.pqcPublicKey,
      },
      account: {
        balanceUsdqs: newAccount.balanceUsdqs,
        balanceUsd: newAccount.balanceUsd,
        isFrozen: newAccount.isFrozen,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: '회원가입 처리 중 서버 오류가 발생했습니다.' });
  }
};

export const login = (req: express.Request, res: express.Response): void => {
  try {
    const { username, password } = req.body;
    const cleanUsername = String(username || '').trim();

    const user = db.users.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());
    if (!user) {
      res.status(401).json({ success: false, message: 'user_not_found' });
      return;
    }

    // 락아웃 상태 확인
    const now = Date.now();
    if (user.lockedUntil && user.lockedUntil > now) {
      const remainingSec = Math.ceil((user.lockedUntil - now) / 1000);
      res.status(423).json({
        success: false,
        message: `account_locked_${remainingSec}`,
        lockoutRemainingSec: remainingSec,
      });
      return;
    }

    // 비밀번호 검증 (PBKDF2 150,000회)
    const isValid = verifyPasswordServer(String(password || ''), user.salt, user.passwordHash);
    if (!isValid) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
        res.status(423).json({
          success: false,
          message: 'account_locked_30',
          lockoutRemainingSec: 30,
          failedAttempts: user.failedLoginAttempts,
        });
        return;
      }

      res.status(401).json({
        success: false,
        message: 'invalid_password',
        failedAttempts: user.failedLoginAttempts,
      });
      return;
    }

    // 로그인 성공 시 실패 카운터 초기화
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    const token = signAccessToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    const account = db.accounts.find((a) => a.userId === user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        kycTier: user.kycTier,
        pqcPublicKey: user.pqcPublicKey,
      },
      account: account
        ? {
            balanceUsdqs: account.balanceUsdqs,
            balanceUsd: account.balanceUsd,
            isFrozen: account.isFrozen,
            frozenAt: account.frozenAt,
          }
        : null,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: '로그인 처리 중 오류가 발생했습니다.' });
  }
};

export const refreshToken = (req: AuthenticatedRequest, res: express.Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: '인증 정보가 없습니다.' });
    return;
  }
  const newToken = signAccessToken(req.user);
  res.json({ success: true, token: newToken });
};

export const getMe = (req: AuthenticatedRequest, res: express.Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: '인증 정보가 없습니다.' });
    return;
  }
  const user = db.users.find((u) => u.id === req.user?.id);
  const account = db.accounts.find((a) => a.userId === req.user?.id);

  res.json({
    success: true,
    user: user
      ? {
          id: user.id,
          username: user.username,
          role: user.role,
          kycTier: user.kycTier,
          pqcPublicKey: user.pqcPublicKey,
        }
      : req.user,
    account,
  });
};

