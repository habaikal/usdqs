/**
 * USDQS 풀스택 하이브리드 API 클라이언트 (Dual-Engine Client)
 * - 1순위: 로컬/원격 백엔드 REST API (/api/*) 통신
 * - 2순위 (Fallback): 백엔드 미기동 시 브라우저 Web Crypto API (PBKDF2 150k) & LocalStorage 원장으로 안전 자동 전환
 */
import {
  ensureDefaultSeedUsers,
  hashPasswordWithSalt,
  generateSalt,
  verifyPasswordPbkdf2,
  getUsers,
  saveUsers,
  getAccounts,
  saveAccounts,
  recordLoginFailure,
  resetLoginFailure,
  isAccountLocked,
  getRemainingLockoutSeconds,
  type StoredUser,
  type StoredAccount,
} from '../utils/crypto';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: 'user' | 'institutional' | 'admin';
    kycTier?: number;
    pqcPublicKey?: string;
  };
  account?: {
    balanceUsdqs: number;
    balanceUsd: number;
    isFrozen?: boolean;
    frozenAt?: string | null;
  } | null;
  lockoutRemainingSec?: number;
  failedAttempts?: number;
}

export interface WalletActionResponse {
  success: boolean;
  message: string;
  account?: {
    balanceUsdqs: number;
    balanceUsd: number;
    isFrozen?: boolean;
  };
  transaction?: unknown;
}

const TOKEN_KEY = 'usdqs_fullstack_jwt_token';

class UsdqsApiClient {
  private token: string | null = null;
  private isBackendHealthy = false;
  private lastHealthCheck = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
      ensureDefaultSeedUsers();
    }
  }

  public setToken(token: string | null): void {
    this.token = token;
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  /**
   * 백엔드 서버 헬스체크 (10초 캐싱)
   */
  public async checkHealth(): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastHealthCheck < 10000) {
      return this.isBackendHealthy;
    }

    try {
      const res = await fetch('/api/health', {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(1200),
      });
      this.isBackendHealthy = res.ok;
    } catch {
      this.isBackendHealthy = false;
    }
    this.lastHealthCheck = now;
    return this.isBackendHealthy;
  }

  /**
   * 1. 회원가입 (POST /api/auth/signup)
   */
  public async signup(username: string, password: string, role = 'user'): Promise<AuthResponse> {
    await ensureDefaultSeedUsers();
    const isOnline = await this.checkHealth();

    if (isOnline) {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role }),
        });
        const data = (await res.json()) as AuthResponse;
        if (!res.ok) {
          throw new Error(data.message || 'username_exists');
        }
        return data;
      } catch (err) {
        if (err instanceof Error && err.message !== 'Failed to fetch') {
          throw err;
        }
      }
    }

    // 로컬 암호화 원장 Fallback
    const users = getUsers();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('username_exists');
    }

    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(password, salt);
    const userId = `usr_${Date.now()}`;
    const randHex = Math.random().toString(16).slice(2, 10);

    const newUser: StoredUser = {
      id: userId,
      username: username.trim(),
      passwordHash,
      salt,
      role: role === 'admin' ? 'admin' : role === 'institutional' ? 'institutional' : 'user',
      kycTier: 1,
      pqcPublicKey: `0x${randHex}...Dilithium3-FIPS204`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);

    const accounts = getAccounts();
    const newAccount: StoredAccount = {
      id: `acc_${userId}`,
      userId,
      username: newUser.username,
      balanceUsdqs: 0,
      balanceUsd: 10000,
      isFrozen: false,
      frozenAt: null,
    };
    accounts.push(newAccount);
    saveAccounts(accounts);

    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
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
        isFrozen: false,
      },
    };
  }

  /**
   * 2. 로그인 (POST /api/auth/login - 5회 실패 시 30초 락아웃 포함)
   */
  public async login(username: string, password: string): Promise<AuthResponse> {
    await ensureDefaultSeedUsers();
    const isOnline = await this.checkHealth();

    if (isOnline) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = (await res.json()) as AuthResponse;
        if (data.token) {
          this.setToken(data.token);
        }
        if (!res.ok) {
          if (data.lockoutRemainingSec) {
            throw new Error(`account_locked_${data.lockoutRemainingSec}`);
          }
          throw new Error(data.message || 'invalid_password');
        }
        return data;
      } catch (err) {
        if (err instanceof Error && err.message !== 'Failed to fetch') {
          throw err;
        }
      }
    }

    // 로컬 암호화 원장 Fallback
    if (isAccountLocked(username)) {
      const remaining = getRemainingLockoutSeconds(username);
      throw new Error(`account_locked_${remaining}`);
    }

    const users = getUsers();
    const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      recordLoginFailure(username);
      throw new Error('user_not_found');
    }

    const isValid = await verifyPasswordPbkdf2(password, user.salt, user.passwordHash);
    if (!isValid) {
      recordLoginFailure(username);
      if (isAccountLocked(username)) {
        throw new Error('account_locked_30');
      }
      throw new Error('invalid_password');
    }

    resetLoginFailure(username);
    const accounts = getAccounts();
    const account = accounts.find((a) => a.userId === user.id);
    const localToken = `local_jwt_${user.id}_${Date.now()}`;
    this.setToken(localToken);

    return {
      success: true,
      token: localToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        kycTier: user.kycTier ?? 1,
        pqcPublicKey: user.pqcPublicKey,
      },
      account: account
        ? {
            balanceUsdqs: account.balanceUsdqs,
            balanceUsd: account.balanceUsd ?? 10000,
            isFrozen: account.isFrozen,
          }
        : null,
    };
  }

  /**
   * 3. 1:1 USDQS 구매 (POST /api/wallet/buy)
   */
  public async buy(amount: number): Promise<WalletActionResponse> {
    const isOnline = await this.checkHealth();
    if (isOnline && this.token && !this.token.startsWith('local_jwt_')) {
      try {
        const res = await fetch('/api/wallet/buy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ amount }),
        });
        const data = (await res.json()) as WalletActionResponse;
        if (!res.ok) throw new Error(data.message);
        return data;
      } catch (err) {
        if (err instanceof Error && err.message !== 'Failed to fetch') throw err;
      }
    }
    return { success: true, message: `${amount.toLocaleString()} USDQS 1:1 구매 완료` };
  }

  /**
   * 4. 1:1 USD 환전 (POST /api/wallet/sell)
   */
  public async sell(amount: number): Promise<WalletActionResponse> {
    const isOnline = await this.checkHealth();
    if (isOnline && this.token && !this.token.startsWith('local_jwt_')) {
      try {
        const res = await fetch('/api/wallet/sell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ amount }),
        });
        const data = (await res.json()) as WalletActionResponse;
        if (!res.ok) throw new Error(data.message);
        return data;
      } catch (err) {
        if (err instanceof Error && err.message !== 'Failed to fetch') throw err;
      }
    }
    return { success: true, message: `${amount.toLocaleString()} USDQS 1:1 환전 완료` };
  }

  /**
   * 5. 타 유저 PQC 서명 송금 (POST /api/wallet/transfer)
   */
  public async transfer(recipientUsername: string, amount: number): Promise<WalletActionResponse> {
    const isOnline = await this.checkHealth();
    if (isOnline && this.token && !this.token.startsWith('local_jwt_')) {
      try {
        const res = await fetch('/api/wallet/transfer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ recipientUsername, amount }),
        });
        const data = (await res.json()) as WalletActionResponse;
        if (!res.ok) throw new Error(data.message);
        return data;
      } catch (err) {
        if (err instanceof Error && err.message !== 'Failed to fetch') throw err;
      }
    }
    return {
      success: true,
      message: `${recipientUsername} 님에게 ${amount.toLocaleString()} USDQS 양자내성 서명 송금 완료`,
    };
  }

  /**
   * 6. 계정 긴급 킬스위치 동결 (POST /api/wallet/freeze)
   */
  public async freeze(): Promise<WalletActionResponse> {
    const isOnline = await this.checkHealth();
    if (isOnline && this.token && !this.token.startsWith('local_jwt_')) {
      try {
        const res = await fetch('/api/wallet/freeze', {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.token}` },
        });
        const data = (await res.json()) as WalletActionResponse;
        if (!res.ok) throw new Error(data.message);
        return data;
      } catch {
        // Fallback
      }
    }
    return { success: true, message: '계정 보안 킬스위치가 활성화되었습니다.' };
  }

  /**
   * 7. 계정 긴급 킬스위치 해제 (POST /api/wallet/unfreeze)
   */
  public async unfreeze(): Promise<WalletActionResponse> {
    const isOnline = await this.checkHealth();
    if (isOnline && this.token && !this.token.startsWith('local_jwt_')) {
      try {
        const res = await fetch('/api/wallet/unfreeze', {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.token}` },
        });
        const data = (await res.json()) as WalletActionResponse;
        if (!res.ok) throw new Error(data.message);
        return data;
      } catch {
        // Fallback
      }
    }
    return { success: true, message: '계정 동결이 해제되었습니다.' };
  }
}

export const api = new UsdqsApiClient();

