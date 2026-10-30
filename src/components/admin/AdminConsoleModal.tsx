import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Users,
  GitPullRequest,
  Lock,
  Flame,
  FileCheck,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_PROPOSALS, INITIAL_BRIDGE_STATUS, INITIAL_SANCTIONED_ENTITIES, INITIAL_AUDIT_LOGS } from '../../data/complianceData';
import type { MultisigProposal, BridgeSecurityStatus, SanctionedEntity, AuditLogItem } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateCap?: (newCap: number) => void;
  isBridgePaused?: boolean;
  onToggleBridgePause?: (paused: boolean) => void;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  onClose,
  onUpdateCap,
  onToggleBridgePause,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'multisig' | 'bridge' | 'sanctions' | 'audit'>('multisig');

  // Interactive states
  const [proposals, setProposals] = useState<MultisigProposal[]>(INITIAL_PROPOSALS);
  const [bridgeStatus, setBridgeStatus] = useState<BridgeSecurityStatus>(INITIAL_BRIDGE_STATUS);
  const [sanctions, setSanctions] = useState<SanctionedEntity[]>(INITIAL_SANCTIONED_ENTITIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [selectedRole, setSelectedRole] = useState<'CISO' | 'MLRO' | 'Treasury_Lead'>('CISO');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. 다중서명 서명 및 실행 핸들러
  const handleSignProposal = (propId: string) => {
    setProposals((prev) =>
      prev.map((prop) => {
        if (prop.id !== propId) return prop;
        const updatedApprovers = prop.approvers.map((app) => {
          if (app.role === selectedRole && !app.signed) {
            return {
              ...app,
              signed: true,
              signedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
            };
          }
          return app;
        });

        const signCount = updatedApprovers.filter((a) => a.signed).length;
        const newStatus = signCount >= prop.requiredSignatures ? 'ready_for_execution' : 'voting';

        return {
          ...prop,
          approvers: updatedApprovers,
          status: prop.status === 'timelock_pending' ? 'timelock_pending' : newStatus
        };
      })
    );

    // 감사 로그 기록
    const newLog: AuditLogItem = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actor: `${selectedRole} Signer`,
      role: selectedRole,
      action: 'MULTISIG_PQC_SIGNATURE',
      details: `Signed proposal ${propId} using NIST FIPS 204 Dilithium3 private key`,
      ipAddress: '203.145.92.11 (Hong Kong Office)',
      pqcSignatureHex: '0x3f8a...Dilithium3-Valid',
      severity: 'info'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`[${selectedRole}] 서명이 PQC Dilithium3로 정상 검증 및 등록되었습니다.`);
  };

  const handleExecuteProposal = (propId: string) => {
    setProposals((prev) =>
      prev.map((prop) => {
        if (prop.id !== propId) return prop;
        if (prop.type === 'cap_expansion' && prop.newCap && onUpdateCap) {
          onUpdateCap(prop.newCap);
        }
        return {
          ...prop,
          status: 'executed',
          executionTxHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
        };
      })
    );

    const targetProp = proposals.find((p) => p.id === propId);
    showToast(`안건 [${targetProp?.title}] 온체인 실행 완료! (스마트컨트랙트 상태 갱신됨)`);
  };

  // 2. 브릿지 서킷 브레이커 비상 토글
  const handleToggleCircuitBreaker = () => {
    const nextState = !bridgeStatus.isPaused;
    setBridgeStatus((prev) => ({
      ...prev,
      isPaused: nextState,
      lastAnomalyCheck: `${new Date().toISOString().slice(0, 16)} UTC (${nextState ? 'EMERGENCY PAUSE ENGAGED' : 'NORMAL RESTORED'})`
    }));
    if (onToggleBridgePause) {
      onToggleBridgePause(nextState);
    }
    fetch('/api/admin/bridge/circuit-breaker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaused: nextState, role: selectedRole }),
    }).catch(() => {});

    const newLog: AuditLogItem = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      actor: `${selectedRole} Commander`,
      role: selectedRole,
      action: nextState ? 'CIRCUIT_BREAKER_TRIGGERED' : 'CIRCUIT_BREAKER_RESUMED',
      details: nextState
        ? 'Emergency global circuit breaker engaged across all bridge contracts'
        : 'Bridge operations successfully resumed after security re-attestation',
      ipAddress: '203.145.92.11 (Emergency Console)',
      pqcSignatureHex: '0x992a...Admin-Killswitch',
      severity: nextState ? 'critical' : 'warning'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(nextState ? '⚠️ 브릿지 긴급 서킷 브레이커가 발동되었습니다! 모든 자금 이동이 동결됩니다.' : '✅ 브릿지 보안 검증이 완료되어 정상 재개되었습니다.');
  };

  // 3. 제재 주소 동결 & 강제 소각(Forced Burn)
  const handleToggleFreeze = (id: string) => {
    setSanctions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, isFrozen: !s.isFrozen };
      })
    );
    showToast('개별 주소 온체인 동결(Freeze) 상태가 변경되었습니다.');
  };

  const handleForcedBurn = (id: string) => {
    setSanctions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, forceBurnExecuted: true, frozenAmountUSDQS: 0 };
      })
    );
    showToast('홍콩 HKMA 긴급 규제 명령에 따라 불법 자금 온체인 강제 소각(Forced Burn)이 집행되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#070b16] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  {t.admin.title}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  RBAC Multi-Sig Enforced
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {t.admin.subtitle}
              </p>
            </div>
          </div>

          {/* Current Role Switcher & Close */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 px-2 font-mono">서명 권한:</span>
              {(['CISO', 'MLRO', 'Treasury_Lead'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                    selectedRole === role
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 sm:gap-6 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('multisig')}
            className={`py-3.5 border-b-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'multisig'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>{t.admin.tabMultisig}</span>
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-mono">
              {proposals.filter((p) => p.status !== 'executed').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className={`py-3.5 border-b-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'bridge'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{t.admin.tabBridge}</span>
            {bridgeStatus.isPaused && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('sanctions')}
            className={`py-3.5 border-b-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'sanctions'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t.admin.tabSanctions}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3.5 border-b-2 text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{t.admin.tabAudit}</span>
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-24 right-6 z-50 p-3.5 rounded-xl bg-emerald-950 border border-emerald-400 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 font-mono animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab 1: Multisig 3-of-5 Approval Queue */}
        {activeTab === 'multisig' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
              <div>
                <span className="font-bold text-white block">다중서명 거버넌스 임계값 (Threshold): 3-of-5</span>
                <span className="text-slate-400 text-[11px]">
                  발행 상한 변경(초기 24M 상향 포함), 대량 민팅/소각, 관리자 권한 변경은 최소 3명의 PQC 서명과 24~48시간 타임락 지연 후 집행됩니다.
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>타임락 기본 설정: 48 Hours</span>
              </div>
            </div>

            <div className="space-y-4">
              {proposals.map((prop) => {
                const signedCount = prop.approvers.filter((a) => a.signed).length;
                const userAlreadySigned = prop.approvers.some((a) => a.role === selectedRole && a.signed);

                return (
                  <div
                    key={prop.id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4 font-sans"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            {prop.id}
                          </span>
                          <span className="text-xs font-mono text-cyan-300 uppercase">
                            [{prop.type.replace('_', ' ')}]
                          </span>
                          <h4 className="text-sm font-bold text-white">
                            {prop.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {prop.description}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {prop.status === 'executed' && (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> 온체인 실행 완료
                          </span>
                        )}
                        {prop.status === 'timelock_pending' && (
                          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 타임락 대기 중 (48h)
                          </span>
                        )}
                        {prop.status === 'ready_for_execution' && (
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                            정족수(3/5) 달성 • 실행 대기
                          </span>
                        )}
                        {prop.status === 'voting' && (
                          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                            서명 진행 중 ({signedCount}/3)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Approvers Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                      {prop.approvers.map((app) => (
                        <div
                          key={app.role}
                          className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                            app.signed
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span>{app.role}</span>
                            {app.signed ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-slate-600" />}
                          </div>
                          <span className="text-[10px] text-slate-400 truncate mt-1">
                            {app.name}
                          </span>
                          <span className="text-[9px] text-slate-500 mt-0.5">
                            {app.signed ? app.signedAt?.slice(11, 16) + ' 서명됨' : '미서명'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                      <div className="text-[11px] text-slate-400 font-mono">
                        제안자: {prop.proposer} | 생성: {prop.createdAt}
                        {prop.executionTxHash && ` | Tx: ${prop.executionTxHash}`}
                      </div>

                      <div className="flex items-center gap-2">
                        {prop.status !== 'executed' && (
                          <>
                            <button
                              onClick={() => handleSignProposal(prop.id)}
                              disabled={userAlreadySigned}
                              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                                userAlreadySigned
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              }`}
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>{userAlreadySigned ? '서명 완료됨' : `${selectedRole} 키로 승인 서명`}</span>
                            </button>

                            {(prop.status === 'ready_for_execution' || prop.status === 'timelock_pending') && (
                              <button
                                onClick={() => handleExecuteProposal(prop.id)}
                                className="px-4 py-2 rounded-xl text-xs font-bold font-mono text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span>온체인 최종 집행</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Cross-chain Bridge & Circuit Breaker */}
        {activeTab === 'bridge' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status card */}
            <div className={`p-6 rounded-2xl border transition-all ${
              bridgeStatus.isPaused
                ? 'bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-950/50'
                : 'bg-slate-900/60 border-emerald-500/40'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${bridgeStatus.isPaused ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                    <h3 className="text-lg font-bold text-white">
                      {bridgeStatus.bridgeName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    메커니즘: {bridgeStatus.mechanism} | 활성 릴레이어 노드: {bridgeStatus.activeRelayers}개
                  </p>
                </div>

                <button
                  onClick={handleToggleCircuitBreaker}
                  className={`px-5 py-2.5 rounded-xl font-bold font-mono text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    bridgeStatus.isPaused
                      ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                      : 'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30'
                  }`}
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>{bridgeStatus.isPaused ? t.admin.resumeBridge : t.admin.triggerCircuitBreaker}</span>
                </button>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 text-xs block">24시간 자금 유출 한도 (Rate Limit)</span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    ${bridgeStatus.dailyRateLimitUSD.toLocaleString('en-US')} USD
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">RFP 5.3절 보안 규격 적용</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 text-xs block">금일 현재 누적 유출량</span>
                  <span className="text-xl font-bold text-cyan-300 mt-1 block">
                    ${bridgeStatus.currentDayOutflowUSD.toLocaleString('en-US')} USD
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    한도 대비 점유율: {((bridgeStatus.currentDayOutflowUSD / bridgeStatus.dailyRateLimitUSD) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 text-xs block">이상거래 감지 상태 (Circuit Breaker)</span>
                  <span className={`text-xl font-bold mt-1 block ${bridgeStatus.isPaused ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {bridgeStatus.isPaused ? 'GLOBAL PAUSED' : 'NORMAL (Arm & Guard)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block truncate">
                    {bridgeStatus.lastAnomalyCheck}
                  </span>
                </div>
              </div>
            </div>

            {/* Bridge security explanation */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans space-y-2">
              <span className="font-bold text-white block">RFP 5.3절 브릿지 보안 설계 원칙:</span>
              <p>
                브릿지는 블록체인 생태계 최대의 공격 표면입니다. USDQS 브릿지 컨트랙트는 24시간 Rate Limit 자금 상한을 초과하거나 분당 200만 달러 이상의 비정상 급격 유출이 감지될 경우, 오프체인 모니터링 데몬과 스마트컨트랙트 내부 서킷 브레이커가 즉시 자금을 자동 동결하고 관리자 온콜(24/7)에 비상 경보를 송출합니다.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Sanctions & Blacklist (OFAC/UN/EU) */}
        {activeTab === 'sanctions' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>
                <strong>홍콩 HKMA 및 글로벌 자금세탁방지(AML) 규제 대응:</strong> OFAC SDN, UN, EU 제재 리스트 및 Chainalysis 온체인 분석 솔루션과 실시간 연동되어 고위험 지갑을 자동 감지하고 개별 동결(Freeze) 및 법정 강제 소각(Forced Burn)을 집행합니다.
              </span>
            </div>

            <div className="space-y-3 font-mono">
              {sanctions.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60 text-[10px]">
                        {s.category}
                      </span>
                      <span className="text-white font-bold">{s.alias}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      주소: <span className="text-cyan-300">{s.address}</span> | 지정일자: {s.dateAdded}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      비고: {s.notes}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right mr-3">
                      <span className="text-xs font-bold text-white block">
                        ${s.frozenAmountUSDQS.toLocaleString()} USDQS
                      </span>
                      <span className="text-[10px] text-slate-500">동결 자산</span>
                    </div>

                    <button
                      onClick={() => handleToggleFreeze(s.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        s.isFrozen
                          ? 'bg-rose-950/60 border border-rose-600 text-rose-300 hover:bg-rose-900/40'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {s.isFrozen ? '동결 해제' : '주소 동결'}
                    </button>

                    <button
                      onClick={() => handleForcedBurn(s.id)}
                      disabled={s.forceBurnExecuted || !s.isFrozen}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 disabled:opacity-40 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{s.forceBurnExecuted ? '소각 집행완료' : '강제 소각'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: 7-Year Statutory Audit Log */}
        {activeTab === 'audit' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>법정 보관 기한: 최소 7년 (홍콩 HKMA 및 글로벌 AML 규정 의무 보관)</span>
              </span>
              <span className="text-slate-400 text-[11px]">무결성 암호화 해시 봉인됨</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">시간 (UTC)</th>
                    <th className="p-3">행위자 (Actor)</th>
                    <th className="p-3">동작 (Action)</th>
                    <th className="p-3">상세 내용</th>
                    <th className="p-3">IP / 서명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/30">
                      <td className="p-3 text-[11px] text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3 font-bold text-white whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-300 mr-1.5">
                          {log.role}
                        </span>
                        {log.actor}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : log.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-300">{log.details}</td>
                      <td className="p-3 text-[10px] text-slate-500 whitespace-nowrap">
                        <div>{log.ipAddress}</div>
                        <div className="text-emerald-400">{log.pqcSignatureHex}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
