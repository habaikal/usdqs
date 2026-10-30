-- ============================================================================
-- Migration: 002_create_treasury_and_compliance.sql
-- 설명: USDQS 트레저리 다중서명(3-of-5), 준비금(Reserves), 회계법인 공증(Attestations),
--       CCTP-Q 브릿지 트랜잭션, OFAC 제재 리스트, 7년 법정 보관 감사 로그(Audit Logs) 스키마
-- ============================================================================

-- 1. 3-of-5 다중서명 승인 큐 테이블 (mint_burn_requests)
CREATE TABLE IF NOT EXISTS public.mint_burn_requests (
    id VARCHAR(64) PRIMARY KEY,
    req_type VARCHAR(32) NOT NULL CHECK (req_type IN ('mint', 'burn', 'cap_expansion', 'circuit_breaker', 'freeze_address')),
    title VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    target_amount NUMERIC(24, 2),
    new_cap NUMERIC(24, 2),
    target_address VARCHAR(128),
    target_chain VARCHAR(64),
    proposer VARCHAR(128) NOT NULL,
    timelock_hours INTEGER NOT NULL DEFAULT 48,
    timelock_expires_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'voting' CHECK (status IN ('voting', 'timelock_pending', 'ready_for_execution', 'executed', 'rejected')),
    approvers JSONB NOT NULL DEFAULT '[]'::jsonb,
    required_signatures INTEGER NOT NULL DEFAULT 3,
    execution_tx_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 실시간 준비금 텔레메트리 테이블 (reserves)
CREATE TABLE IF NOT EXISTS public.reserves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initial_cap NUMERIC(24, 2) NOT NULL DEFAULT 24000000.00,
    current_cap NUMERIC(24, 2) NOT NULL DEFAULT 24000000.00,
    total_supply NUMERIC(24, 2) NOT NULL DEFAULT 24000000.00,
    total_reserves_usd NUMERIC(24, 2) NOT NULL DEFAULT 24576000.00,
    reserve_ratio NUMERIC(6, 2) NOT NULL DEFAULT 102.40,
    net_excess_reserves NUMERIC(24, 2) NOT NULL DEFAULT 576000.00,
    tbills_amount_usd NUMERIC(24, 2) NOT NULL DEFAULT 20275200.00,
    reverse_repo_amount_usd NUMERIC(24, 2) NOT NULL DEFAULT 2826240.00,
    cash_trust_amount_usd NUMERIC(24, 2) NOT NULL DEFAULT 1474560.00,
    custodian_bank VARCHAR(256) NOT NULL DEFAULT 'Standard Chartered Bank (HK) / Bank of China (HK) Segregated Trust',
    auditor VARCHAR(256) NOT NULL DEFAULT 'Deloitte Touche Tohmatsu (HK)',
    last_attestation_date DATE NOT NULL DEFAULT '2026-10-25',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. 독립 회계법인 월간 공증 이력 테이블 (attestations)
CREATE TABLE IF NOT EXISTS public.attestations (
    report_id VARCHAR(64) PRIMARY KEY,
    period VARCHAR(64) NOT NULL,
    attestation_date DATE NOT NULL,
    verified_reserves_usd NUMERIC(24, 2) NOT NULL,
    circulating_supply_usdqs NUMERIC(24, 2) NOT NULL,
    excess_reserves_pct VARCHAR(32) NOT NULL,
    auditor_firm VARCHAR(128) NOT NULL,
    opinion_status VARCHAR(64) NOT NULL DEFAULT 'Unqualified Opinion (Clean)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CCTP-Q 크로스체인 브릿지 트랜잭션 테이블 (bridge_txs)
CREATE TABLE IF NOT EXISTS public.bridge_txs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    source_chain VARCHAR(64) NOT NULL,
    target_chain VARCHAR(64) NOT NULL,
    amount_usdqs NUMERIC(24, 6) NOT NULL CHECK (amount_usdqs > 0),
    protocol VARCHAR(64) NOT NULL DEFAULT 'CCTP-Q Native Burn & Mint',
    tx_hash VARCHAR(128) NOT NULL,
    latency VARCHAR(32) NOT NULL,
    saved_gas_usd VARCHAR(32) NOT NULL DEFAULT '$42.50 USD',
    status VARCHAR(32) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. OFAC/UN/EU 제재 대상 주소 관리 테이블 (sanction_entries)
CREATE TABLE IF NOT EXISTS public.sanction_entries (
    id VARCHAR(64) PRIMARY KEY,
    wallet_address VARCHAR(128) NOT NULL UNIQUE,
    entity_alias VARCHAR(256) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('OFAC SDN', 'EU Sanctions', 'UN Sanctions', 'Suspicious MLRO Flag')),
    date_added DATE NOT NULL DEFAULT CURRENT_DATE,
    is_frozen BOOLEAN NOT NULL DEFAULT true,
    frozen_amount_usdqs NUMERIC(24, 2) NOT NULL DEFAULT 0.00,
    force_burn_executed BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. 홍콩 HKMA 규제 대응 7년 법정 보관 감사 로그 테이블 (audit_logs)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor VARCHAR(128) NOT NULL,
    role VARCHAR(64) NOT NULL,
    action VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(64) NOT NULL,
    pqc_signature_hex VARCHAR(256) NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs (timestamp DESC);

-- ============================================================================
-- Row Level Security (RLS) 정책 설정
-- ============================================================================
ALTER TABLE public.mint_burn_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_txs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanction_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 투명성 지표(reserves, attestations)는 누구나 읽기 가능(Public Read), 수정은 관리자만 가능
CREATE POLICY reserves_public_read ON public.reserves FOR SELECT USING (true);
CREATE POLICY attestations_public_read ON public.attestations FOR SELECT USING (true);

-- 브릿지 내역은 본인 내역만 조회 가능
CREATE POLICY bridge_txs_self_read ON public.bridge_txs FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

