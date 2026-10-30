/**
 * USDQS 풀스택 사용자 인증 컨텍스트 (AuthContext)
 * - 회원가입, 로그인(PBKDF2 150k 해싱 + 5회 실패 시 30초 락아웃 방어), 로그아웃
 * - 백엔드 코어 서버 연결 상태(isBackendConnected) 실시간 감지
 */
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import type { User, Credentials } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  login: (credentials: Credentials) => Promise<User>;
  logout: () => void;
  signup: (credentials: Credentials) => Promise<User>;
  isBackendConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_STORAGE_KEY = 'usdqs-fullstack-current-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // 주기적 백엔드 코어 헬스체크
  useEffect(() => {
    const check = async () => {
      const ok = await api.checkHealth();
      setIsBackendConnected(ok);
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  const persistCurrentUser = (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      api.setToken(null);
    }
    setCurrentUser(user);
  };

  /**
   * 회원가입 (PBKDF2 150k + 초기 계좌 생성)
   */
  const signup = useCallback(async (credentials: Credentials): Promise<User> => {
    const username = credentials.username.trim();
    if (username.length < 3) {
      throw new Error('invalid_username_format');
    }
    if (credentials.password.length < 6) {
      throw new Error('invalid_password_format');
    }

    const res = await api.signup(username, credentials.password);
    if (!res.success) {
      throw new Error('username_exists');
    }

    const user: User = {
      id: res.user?.id,
      username,
      role: username.toLowerCase() === 'admin' ? 'admin' : 'user',
      kycTier: res.user?.kycTier ?? 1,
      pqcPublicKey: res.user?.pqcPublicKey,
    };

    return user;
  }, []);

  /**
   * 로그인 (5회 연속 실패 시 30초 락아웃 방어)
   */
  const login = useCallback(async (credentials: Credentials): Promise<User> => {
    const username = credentials.username.trim();
    const res = await api.login(username, credentials.password);

    if (!res.success) {
      if (res.lockoutRemainingSec) {
        throw new Error(`account_locked_${res.lockoutRemainingSec}`);
      }
      throw new Error(res.message || 'invalid_password');
    }

    const user: User = {
      id: res.user?.id,
      username: res.user?.username || username,
      role: res.user?.role || (username.toLowerCase() === 'admin' ? 'admin' : 'user'),
      kycTier: res.user?.kycTier ?? 1,
      pqcPublicKey: res.user?.pqcPublicKey,
    };

    persistCurrentUser(user);
    return user;
  }, []);

  /**
   * 로그아웃
   */
  const logout = useCallback(() => {
    persistCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        signup,
        isBackendConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

