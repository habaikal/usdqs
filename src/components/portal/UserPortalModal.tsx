/**
 * 통합 개인 & 기관 풀스택 포털 모달 (UserPortalModal)
 * - G1 (개인 유저 풀 플로우): 회원가입/로그인(PBKDF2 150k + 5회 잠금 30초 타이머) -> 1:1 구매(Buy)/환전(Sell) -> 타 유저 PQC 송금(Transfer) -> 거래내역(History) -> 킬스위치(Freeze)
 * - G2 (기관 고객 플로우): PQC Dilithium3 키페어 발급 -> 3단계 KYC/AML 심사 -> T+1 전신환 상환(Redemption) 트래커
 */
import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  FileCheck,
  ArrowDownLeft,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Building,
  UserCheck,
  Wallet,
  Send,
  History,
  Lock,
  Unlock,
  LogOut,
  AlertTriangle,
  ArrowRightLeft,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useWeb3 } from '../../context/Web3Context';
import { useAuth } from '../../context/AuthContext';
import { useAccount } from '../../context/AccountContext';
import type { SimulatedPqcKeypair, WalletTransaction } from '../../types';

interface UserPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserPortalModal: React.FC<UserPortalModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useTranslation();
  const { account: web3Account } = useWeb3();
  const { currentUser, login, signup, logout, isBackendConnected } = useAuth();
  const { myAccount, buyUsdqs, sellUsdqs, transferUsdqs, freezeAccount, unfreezeAccount } = useAccount();

  const isKo = language === 'ko';
  const isZh = language === 'zh-HK';

  const [activeTab, setActiveTab] = useState<'wallet' | 'keygen' | 'kyc' | 'redeem'>('wallet');

  // ----------------------------------------------------
  // Tab 1: 개인/기관 지갑 (Auth + Buy/Sell + Transfer + History) 상태
  // ----------------------------------------------------
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [walletMessage, setWalletMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ----------------------------------------------------
  // Tab 2 ~ 4: 기관용 PQC Keygen / KYC / T+1 Redemption 상태
  // ----------------------------------------------------
  const [pqcKeypair, setPqcKeypair] = useState<SimulatedPqcKeypair>({
    classicAddress: web3Account || '0x71C...a891 (Default Demo Account)',
    pqcAlgorithm: 'ML-DSA-65 (Dilithium3)',
    pqcPublicKey: '0x8f2a...f9024a1b827e43d92c7104b95f (NIST FIPS 204 Lattice Key)',
    erc4337SmartWalletAddress: '0x9924...b451 (Hybrid Smart Account)',
    kyberKEMKey: '0x3c11...Kyber768-Capsule-ID',
    createdAt: '2026-10-27 10:00 UTC',
  });
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);
  const [kycStep, setKycStep] = useState<number>(2);
  const [entityType, setEntityType] = useState<'institutional' | 'individual'>('institutional');
  const [redeemAmount, setRedeemAmount] = useState<string>('50000');
  const [bankWireIban, setBankWireIban] = useState<string>('HK82 BOCH 0128 7511 8923 01');
  const [redemptionSubmitted, setRedemptionSubmitted] = useState<boolean>(false);
  const [localSelfFrozen, setLocalSelfFrozen] = useState<boolean>(false);

  // 5회 비밀번호 실패 시 30초 락아웃 타이머 카운트다운
  useEffect(() => {
    if (lockoutTimer === null || lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setAuthError('');
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  if (!isOpen) return null;

  const isAccountFrozen = currentUser ? Boolean(myAccount?.frozen) : localSelfFrozen;

  // 인증 폼 제출 (PBKDF2 150k + 5회 실패 30초 잠금)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');

    if (!username.trim() || !password) {
      setAuthError('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }
    if (authMode === 'signup' && password !== confirmPassword) {
      setAuthError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setSubmitting(true);
    try {
      if (authMode === 'signup') {
        await signup({ username, password });
        setAuthNotice('회원가입 및 PQC 스마트 계좌 생성이 완료되었습니다! 로그인해 주세요.');
        setAuthMode('login');
        setPassword('');
        setConfirmPassword('');
      } else {
        await login({ username, password });
        setPassword('');
        setWalletMessage(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('account_locked')) {
        const secMatch = msg.match(/\d+/);
        const sec = secMatch ? parseInt(secMatch[0], 10) : 30;
        setLockoutTimer(sec);
        setAuthError(`비밀번호 5회 연속 오류로 계정이 일시 잠금되었습니다. (${sec}초 후 해제)`);
      } else if (msg === 'username_exists') {
        setAuthError('이미 존재하는 사용자 아이디입니다.');
      } else if (msg === 'user_not_found') {
        setAuthError('등록되지 않은 사용자 아이디입니다.');
      } else if (msg === 'invalid_password') {
        setAuthError('비밀번호가 일치하지 않습니다. (5회 실패 시 30초 잠금)');
      } else if (msg === 'invalid_username_format') {
        setAuthError('아이디는 최소 3자 이상이어야 합니다.');
      } else if (msg === 'invalid_password_format') {
        setAuthError('비밀번호는 최소 6자 이상이어야 합니다.');
      } else {
        setAuthError(msg || '인증 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 데모 계정 원클릭 채우기 및 로그인
  const handleQuickDemoLogin = async (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setAuthError('');
    setSubmitting(true);
    try {
      await login({ username: demoUser, password: demoPass });
      setPassword('');
    } catch {
      // 만약 아직 시드가 없으면 회원가입 후 로그인
      try {
        await signup({ username: demoUser, password: demoPass });
        await login({ username: demoUser, password: demoPass });
      } catch (e) {
        setAuthError(e instanceof Error ? e.message : '데모 로그인 오류');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 1:1 구매 (Buy)
  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(tradeAmount);
    setWalletMessage(null);
    setActionLoading(true);
    try {
      await buyUsdqs(amount);
      setWalletMessage({
        type: 'success',
        text: `${amount.toLocaleString()} USDQS 1:1 즉시 구매(Mint)가 완료되었습니다.`,
      });
      setTradeAmount('');
    } catch (err: unknown) {
      setWalletMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '구매 처리에 실패했습니다.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 1:1 환전 (Sell)
  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(tradeAmount);
    setWalletMessage(null);
    setActionLoading(true);
    try {
      await sellUsdqs(amount);
      setWalletMessage({
        type: 'success',
        text: `${amount.toLocaleString()} USDQS 1:1 USD 환전(Redeem)이 완료되었습니다.`,
      });
      setTradeAmount('');
    } catch (err: unknown) {
      setWalletMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '환전 처리에 실패했습니다.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 타 유저 실시간 PQC 송금 (Transfer)
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    setWalletMessage(null);
    setActionLoading(true);
    try {
      await transferUsdqs(transferTo.trim(), amount);
      setWalletMessage({
        type: 'success',
        text: `'${transferTo.trim()}' 님에게 ${amount.toLocaleString()} USDQS가 NIST FIPS 204 양자내성 서명으로 즉시 송금되었습니다.`,
      });
      setTransferTo('');
      setTransferAmount('');
    } catch (err: unknown) {
      setWalletMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '송금 처리에 실패했습니다.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 계정 긴급 자가 킬스위치 (Freeze / Unfreeze)
  const handleToggleKillSwitch = async () => {
    if (currentUser && myAccount) {
      setActionLoading(true);
      try {
        if (myAccount.frozen) {
          await unfreezeAccount();
          setWalletMessage({
            type: 'success',
            text: '보안 킬스위치가 해제되어 정상 입출금 및 송금이 가능합니다.',
          });
        } else {
          await freezeAccount();
          setWalletMessage({
            type: 'error',
            text: '계정 긴급 킬스위치(Self-Freeze)가 작동되어 모든 거래와 송금이 즉시 차단되었습니다.',
          });
        }
      } finally {
        setActionLoading(false);
      }
    } else {
      const next = !localSelfFrozen;
      setLocalSelfFrozen(next);
    }
  };

  const handleGenerateNewPqcKey = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      const randomHex = Math.random().toString(16).slice(2, 8);
      setPqcKeypair({
        classicAddress: web3Account || `0x${randomHex}...${Math.random().toString(16).slice(2, 6)}`,
        pqcAlgorithm: 'ML-DSA-65 (Dilithium3)',
        pqcPublicKey: `0x${Math.random().toString(16).slice(2, 10)}...f902${randomHex}`,
        erc4337SmartWalletAddress: `0x${Math.random().toString(16).slice(2, 8)}...${randomHex}`,
        kyberKEMKey: `0x${Math.random().toString(16).slice(2, 6)}...Kyber768`,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      });
      setIsGeneratingKey(false);
    }, 700);
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRedemptionSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#070b16] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  {t.portal.title}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Full-Stack Wallet &amp; Institutional Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{t.portal.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Kill-Switch Button */}
            <button
              onClick={handleToggleKillSwitch}
              disabled={actionLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAccountFrozen
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                  : 'bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/40'
              }`}
            >
              {isAccountFrozen ? <Unlock className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              <span>
                {isAccountFrozen
                  ? isKo
                    ? '계정 동결 중 (클릭 시 해제)'
                    : 'Frozen (Click to Unfreeze)'
                  : isKo
                  ? '자가 킬스위치 (Kill-Switch)'
                  : 'Self Kill-Switch'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Tab Headers */}
        <div className="px-6 bg-slate-950/70 border-b border-slate-800 flex items-center gap-4 sm:gap-6 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-3.5 border-b-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'wallet'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>
              {isKo
                ? '1. 개인/기관 지갑 & PQC 송금'
                : isZh
                ? '1. 個人/機構錢包與 PQC 匯款'
                : '1. Wallet, Buy/Sell & PQC Transfer'}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
              Full Flow
            </span>
          </button>

          <button
            onClick={() => setActiveTab('keygen')}
            className={`py-3.5 border-b-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'keygen'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>2. {t.portal.tabKeygen}</span>
          </button>

          <button
            onClick={() => setActiveTab('kyc')}
            className={`py-3.5 border-b-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'kyc'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>3. {t.portal.tabKyc}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>

          <button
            onClick={() => setActiveTab('redeem')}
            className={`py-3.5 border-b-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'redeem'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>4. {t.portal.tabRedeem}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
              T+1 SLA
            </span>
          </button>
        </div>

        {/* =========================================================
            Tab 1: 개인/기관 디지털 달러 지갑 (Auth -> Buy/Sell -> Transfer -> History)
           ========================================================= */}
        {activeTab === 'wallet' && (
          <div className="flex-1 overflow-y-auto p-6">
            {!currentUser ? (
              <div className="max-w-md mx-auto my-4 animate-fadeIn">
                <div className="p-6 sm:p-7 rounded-2xl bg-slate-950/90 border border-emerald-500/30 shadow-2xl space-y-5">
                  <div className="text-center space-y-1.5">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                      {authMode === 'login'
                        ? isKo
                          ? 'USDQS 지갑 포털 로그인'
                          : 'USDQS Wallet Login'
                        : isKo
                        ? '신규 양자내성 지갑 계좌 개설'
                        : 'Create Quantum-Safe Wallet'}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      PBKDF2 (150,000 Iterations) &amp; 5-Fail 30s Lockout Protection
                    </p>
                  </div>

                  {/* Login / Signup Switcher */}
                  <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError('');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authMode === 'login'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isKo ? '로그인 (Login)' : 'Login'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthError('');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authMode === 'signup'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isKo ? '회원가입 (Sign Up)' : 'Sign Up'}
                    </button>
                  </div>

                  {authNotice && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{authNotice}</span>
                    </div>
                  )}

                  {authError && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {lockoutTimer !== null && (
                    <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between font-mono">
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>5회 오류 잠금 작동 중</span>
                      </span>
                      <span className="font-bold text-sm text-amber-400">{lockoutTimer}s</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {isKo ? '사용자 아이디 (Username)' : 'Username'}
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="예: demo 또는 satoshi_01"
                        disabled={submitting || lockoutTimer !== null}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {isKo ? '비밀번호 (Password)' : 'Password'}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="최소 6자 이상"
                        disabled={submitting || lockoutTimer !== null}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {isKo ? '비밀번호 확인 (Confirm Password)' : 'Confirm Password'}
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="비밀번호 재입력"
                          disabled={submitting || lockoutTimer !== null}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || lockoutTimer !== null}
                      className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
                    >
                      {submitting
                        ? 'PBKDF2 암호화 검증 중...'
                        : authMode === 'login'
                        ? isKo
                          ? '지갑 포털 로그인'
                          : 'Sign In to Wallet'
                        : isKo
                        ? '신규 계좌 생성 완료'
                        : 'Create Account'}
                    </button>
                  </form>

                  {/* 원클릭 데모 로그인 도우미 */}
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                    <span>원클릭 즉시 체험:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('demo', 'Demo1234!')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 cursor-pointer"
                      >
                        개인 계정 (demo)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('admin', 'Admin1234!')}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 cursor-pointer"
                      >
                        기관/운영 계정 (admin)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 로그인 완료 후: 잔액 카드 + 1:1 Buy/Sell + PQC 송금 + 거래내역 */
              <div className="space-y-6 animate-fadeIn">
                {/* User Header Bar */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">
                          {currentUser.username} {isKo ? '님의 양자내성 지갑' : 'Quantum Wallet'}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {currentUser.role}
                        </span>
                        {myAccount?.frozen ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            FROZEN (Kill-Switch)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        NIST FIPS 204 ML-DSA Protected •{' '}
                        <span className={isBackendConnected ? 'text-emerald-400' : 'text-cyan-400'}>
                          {isBackendConnected ? 'Node.js Core API Connected' : 'Dual-Engine WebCrypto Ledger Active'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isKo ? '로그아웃' : 'Logout'}</span>
                  </button>
                </div>

                {walletMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border font-mono animate-fadeIn ${
                      walletMessage.type === 'success'
                        ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                        : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    {walletMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{walletMessage.text}</span>
                  </div>
                )}

                {/* Balance Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                      USDQS Balance (1:1 Pegged)
                    </span>
                    <div className="text-2xl font-extrabold text-white mt-1">
                      {(myAccount?.balance ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      <span className="text-xs text-emerald-400">USDQS</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold block">
                      USD Fiat Trust Deposit
                    </span>
                    <div className="text-2xl font-extrabold text-white mt-1">
                      $
                      {(myAccount?.balanceUsd ?? 10000).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      <span className="text-xs text-cyan-400">USD</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Quantum Signature Standard
                    </span>
                    <div className="text-sm font-bold text-emerald-300 mt-2">
                      ML-DSA-65 (Dilithium3)
                    </div>
                    <span className="text-[10px] text-slate-500">ERC-4337 Hybrid Account</span>
                  </div>
                </div>

                {/* Buy/Sell & PQC Transfer Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: 1:1 Buy / Sell */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                        <h5 className="text-sm font-bold text-white">
                          {isKo ? '1:1 USDQS 즉시 구매 및 환전' : '1:1 Mint (Buy) & Redeem (Sell)'}
                        </h5>
                      </div>
                      <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => {
                            setTradeTab('buy');
                            setWalletMessage(null);
                          }}
                          className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                            tradeTab === 'buy' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                          }`}
                        >
                          1:1 구매(Buy)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTradeTab('sell');
                            setWalletMessage(null);
                          }}
                          className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                            tradeTab === 'sell' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'
                          }`}
                        >
                          1:1 환전(Sell)
                        </button>
                      </div>
                    </div>

                    <form onSubmit={tradeTab === 'buy' ? handleBuy : handleSell} className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                          <span>{tradeTab === 'buy' ? '지불할 USD 금액' : '환전할 USDQS 수량'}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setTradeAmount(
                                String(tradeTab === 'buy' ? myAccount?.balanceUsd ?? 10000 : myAccount?.balance ?? 0)
                              )
                            }
                            className="text-emerald-400 underline cursor-pointer"
                          >
                            MAX:{' '}
                            {tradeTab === 'buy'
                              ? `$${(myAccount?.balanceUsd ?? 10000).toLocaleString()}`
                              : `${(myAccount?.balance ?? 0).toLocaleString()} USDQS`}
                          </button>
                        </div>
                        <input
                          type="number"
                          step="any"
                          min="1"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          placeholder="수량 입력 (예: 1000)"
                          disabled={actionLoading || Boolean(myAccount?.frozen)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                        <span>교환비: 1 USD = 1.0000 USDQS (수수료 0%)</span>
                        <span className="text-emerald-400 font-bold">
                          수령: {tradeAmount ? Number(tradeAmount).toLocaleString() : '0'}{' '}
                          {tradeTab === 'buy' ? 'USDQS' : 'USD'}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading || !tradeAmount || Boolean(myAccount?.frozen)}
                        className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 disabled:opacity-50 cursor-pointer"
                      >
                        {tradeTab === 'buy' ? '1:1 USDQS 즉시 구매 실행' : '1:1 USD 즉시 환전 실행'}
                      </button>
                    </form>
                  </div>

                  {/* Right: PQC Cross-User Transfer */}
                  <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                      <Send className="w-4 h-4 text-cyan-400" />
                      <h5 className="text-sm font-bold text-white">
                        {isKo ? '타 유저 실시간 PQC 서명 송금' : 'Instant PQC Signed Transfer'}
                      </h5>
                    </div>

                    <form onSubmit={handleTransfer} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-mono">
                            수신자 아이디 (To)
                          </label>
                          <input
                            type="text"
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                            placeholder="예: admin 또는 alice"
                            disabled={actionLoading || Boolean(myAccount?.frozen)}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1 font-mono">
                            송금 수량 (USDQS)
                          </label>
                          <input
                            type="number"
                            step="any"
                            min="1"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="예: 500"
                            disabled={actionLoading || Boolean(myAccount?.frozen)}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-400 flex justify-between">
                        <span>서명: NIST FIPS 204 ML-DSA-65</span>
                        <span className="text-cyan-300">완결 속도: &lt; 0.5s</span>
                      </div>

                      <button
                        type="submit"
                        disabled={actionLoading || !transferTo || !transferAmount || Boolean(myAccount?.frozen)}
                        className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:brightness-110 disabled:opacity-50 cursor-pointer"
                      >
                        PQC 양자내성 서명 송금 실행
                      </button>
                    </form>
                  </div>
                </div>

                {/* Transaction History Table */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-400" />
                    <h5 className="text-sm font-bold text-white">
                      {isKo ? '실시간 거래 원장 내역 (Transaction History)' : 'Real-Time Transaction Ledger'}
                    </h5>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">유형</th>
                          <th className="py-2.5 px-3">수량 (USDQS)</th>
                          <th className="py-2.5 px-3">발신 → 수신</th>
                          <th className="py-2.5 px-3">PQC 검증 상태</th>
                          <th className="py-2.5 px-3">시각</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {myAccount?.transactions && myAccount.transactions.length > 0 ? (
                          myAccount.transactions.map((tx: WalletTransaction) => {
                            const isPositive =
                              tx.type === 'purchase' || tx.type === 'transfer_received' || tx.type === 'mint';
                            return (
                              <tr key={tx.id} className="hover:bg-slate-900/40">
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      isPositive
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-cyan-500/20 text-cyan-300'
                                    }`}
                                  >
                                    {tx.type}
                                  </span>
                                </td>
                                <td
                                  className={`py-2.5 px-3 font-bold ${
                                    isPositive ? 'text-emerald-400' : 'text-white'
                                  }`}
                                >
                                  {isPositive ? '+' : '-'}
                                  {tx.amount.toLocaleString()}
                                </td>
                                <td className="py-2.5 px-3 text-slate-300">
                                  {tx.from} → {tx.to}
                                </td>
                                <td className="py-2.5 px-3 text-emerald-400 text-[11px]">
                                  {tx.pqcSignatureHex || 'FIPS 204 Verified'}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                                  {new Date(tx.timestamp).toLocaleString()}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-500">
                              아직 거래 내역이 없습니다. 위에서 1:1 구매 또는 송금을 실행해 보세요.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            Tab 2: PQC Keypair Generation & Smart Wallet
           ========================================================= */}
        {activeTab === 'keygen' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300 font-sans">
              <div>
                <span className="font-bold text-white block">
                  NIST FIPS 204 ML-DSA (CRYSTALS-Dilithium) 양자내성 키 체계
                </span>
                <span className="text-slate-400 text-[11px]">
                  이더리움의 표준 서명(ECDSA)과 결합된 ERC-4337 계정추상화 스마트 지갑으로, 양자컴퓨터의 공개키 역산 공격을 원천 차단합니다.
                </span>
              </div>
              <button
                onClick={handleGenerateNewPqcKey}
                disabled={isGeneratingKey}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 shrink-0 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingKey ? '격자 키페어 계산 중...' : '신규 PQC 키페어 발급'}
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Classic EVM Public Address (secp256k1)
                </span>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold truncate">
                  {pqcKeypair.classicAddress}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NIST FIPS 204 ML-DSA-65 (Dilithium3) Quantum Public Key</span>
                </span>
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/40 text-cyan-300 truncate">
                  {pqcKeypair.pqcPublicKey}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                    ERC-4337 Hybrid Smart Wallet (Proxy)
                  </span>
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 truncate">
                    {pqcKeypair.erc4337SmartWalletAddress}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-teal-400 uppercase font-bold tracking-wider">
                    NIST FIPS 203 ML-KEM (Kyber768) Capsule ID
                  </span>
                  <div className="p-3 rounded-lg bg-slate-900 border border-teal-500/30 text-teal-300 truncate">
                    {pqcKeypair.kyberKEMKey}
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex justify-between items-center">
                <span>발급 타임스탬프: {pqcKeypair.createdAt}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>하이브리드 검증 어댑터 활성화됨</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            Tab 3: KYC/AML Institutional Onboarding Flow
           ========================================================= */}
        {activeTab === 'kyc' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-mono">신원 검증 유형 선택:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEntityType('institutional')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    entityType === 'institutional'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  기관/법인 (Institutional)
                </button>
                <button
                  type="button"
                  onClick={() => setEntityType('individual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    entityType === 'individual'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  개인 투자자 (Individual)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <button
                type="button"
                onClick={() => setKycStep(1)}
                className={`flex items-center gap-2 cursor-pointer ${
                  kycStep === 1 ? 'text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                    kycStep === 1 ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800'
                  }`}
                >
                  1
                </span>
                <span>서류 제출</span>
              </button>
              <div className={`h-0.5 w-12 ${kycStep >= 2 ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
              <button
                type="button"
                onClick={() => setKycStep(2)}
                className={`flex items-center gap-2 cursor-pointer ${
                  kycStep === 2 ? 'text-emerald-300 font-bold' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                    kycStep === 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'
                  }`}
                >
                  2
                </span>
                <span>심사 및 AML 스크리닝</span>
              </button>
              <div className={`h-0.5 w-12 ${kycStep >= 3 ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
              <button
                type="button"
                onClick={() => setKycStep(3)}
                className={`flex items-center gap-2 cursor-pointer ${
                  kycStep === 3 ? 'text-emerald-300 font-bold' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                    kycStep === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'
                  }`}
                >
                  3
                </span>
                <span>신탁 계좌 개설 승인</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5 text-xs font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-sm">
                    {entityType === 'institutional'
                      ? '홍콩 HKMA 적격 법인 KYC 상태'
                      : '개인 공인 투자자 KYC 상태'}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold">
                  {kycStep === 3 ? 'Tier-3 Final Approved' : 'Tier-2 Cleared & Monitored'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">인증 대상 명칭</span>
                  <span className="text-white font-bold">
                    {entityType === 'institutional'
                      ? 'Apex Quantum Capital Asia Ltd.'
                      : currentUser?.username || 'Verified Accredited Investor'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">홍콩 등록 식별번호</span>
                  <span className="text-cyan-300 font-bold">HK-3849102-X</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">AML / FATF Travel Rule 상태</span>
                  <span className="text-emerald-400 font-bold">Verified via Sumsub / Notabene</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">1일 1차 발행/상환 한도</span>
                  <span className="text-white font-bold">Unlimited ($10,000,000 USD Daily Conduit)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-[11px] leading-relaxed">
                ✅ 법인 신원 및 자금 출처 증빙이 확인되었으며, 홍콩 Standard Chartered 및 Bank of China (HK)의 파산절연 신탁 계좌로 직접 미 달러화(USD) 전신환 입금 및 1:1 민팅이 승인되었습니다.
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            Tab 4: T+1 Redemption Tracker
           ========================================================= */}
        {activeTab === 'redeem' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>
                <strong>홍콩 HKMA 라이선스 보증 상환 SLA:</strong> 정상 상환 처리 기한은 영업일 기준 T+1 이내(목표), 최대 T+2를 초과하지 않습니다.
              </span>
            </div>

            {redemptionSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 space-y-4 text-center font-sans animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    T+1 상환 전신환 요청이 정상 접수되었습니다
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    주문 번호: REDEEM-202610-8841 | 소각 수량: {Number(redeemAmount).toLocaleString()} USDQS
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left font-mono text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-400">지급 예정 은행 계좌:</span>
                    <span className="text-white font-bold">{bankWireIban}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">예상 입금 완료 시점:</span>
                    <span className="text-emerald-400 font-bold">2026-10-31 17:00 HKT (T+1 SLA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">온체인 소각 트랜잭션:</span>
                    <span className="text-cyan-300">0x3b89...BurnVerified</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRedemptionSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                >
                  추가 상환 신청하기
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleRedeemSubmit}
                className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 font-sans"
              >
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-cyan-400" />
                  <span>USDQS 소각 및 미 달러화(USD) 은행 송금 신청</span>
                </h4>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-mono">상환할 USDQS 토큰 수량</label>
                  <input
                    type="number"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-500/50"
                    placeholder="50,000"
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-mono">
                    1:1 무수수료 교환 = ${Number(redeemAmount || 0).toLocaleString()} USD 지급
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-mono">
                    수취할 홍콩/글로벌 은행 계좌 (IBAN / SWIFT)
                  </label>
                  <input
                    type="text"
                    value={bankWireIban}
                    onChange={(e) => setBankWireIban(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
                  <div className="flex justify-between">
                    <span>처리 SLA:</span>
                    <span className="text-emerald-400 font-bold">
                      영업일 기준 T+1 이내 (홍콩 은행 영업시간 기준)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>수탁 신탁사:</span>
                    <span>Standard Chartered (HK) Segregated Trust</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold font-mono text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:brightness-110 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  T+1 상환 및 은행 송금 요청 접수 (소각 서명)
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
