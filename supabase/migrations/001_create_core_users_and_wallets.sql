-- ============================================================================
-- Migration: 001_create_core_users_and_wallets.sql
-- 설명: USDQS 풀스택 플랫폼 핵심 사용자, 세션, 계좌 원장, 거래내역, KYC, 지갑연동, 감사추적 테이블 생성
-- 보안: 모든 테이블에 Row Level Security (RLS) 정책을 강제하여 타인의 데이터 접근 차단
-- ============================================================================

-- UUID 생성을 위한 확장 활성화
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. 사용자 테이블 (users)
-- PBKDF2(150,000회) 해싱된 비밀번호와 5회 실패 시 30초 락아웃 상태, PQC 공개키를 저장합니다.
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(256) NOT NULL,
    salt VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'institutional', 'admin')),
    kyc_tier INTEGER NOT NULL DEFAULT 1 CHECK (kyc_tier BETWEEN 1 AND 3),
    pqc_public_key VARCHAR(512),
    erc4337_smart_wallet VARCHAR(128),
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    mfa_secret VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);

-- 2. 인증 세션 테이블 (sessions)
-- JWT Refresh Token 및 접속 IP, 기기 정보를 관리합니다.
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(256) NOT NULL,
    ip_address VARCHAR(64),
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions (user_id);

-- 3. 디지털 달러 지갑 계좌 테이블 (accounts)
-- 1:1 USDQS 잔액, 법정화폐 USD 예치 잔액, 자가 킬스위치(Freeze) 상태를 관리합니다.
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    username VARCHAR(64) NOT NULL UNIQUE,
    balance_usdqs NUMERIC(24, 6) NOT NULL DEFAULT 0.000000 CHECK (balance_usdqs >= 0),
    balance_usd NUMERIC(24, 2) NOT NULL DEFAULT 10000.00 CHECK (balance_usd >= 0),
    is_frozen BOOLEAN NOT NULL DEFAULT false,
    frozen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts (user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_username ON public.accounts (username);

-- 4. 거래 원장 테이블 (transactions)
-- 1:1 구매(purchase), 환전(sell), PQC 송금(transfer_sent/transfer_received) 내역을 보관합니다.
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tx_type VARCHAR(32) NOT NULL CHECK (tx_type IN ('purchase', 'sell', 'transfer_sent', 'transfer_received', 'mint', 'burn')),
    amount NUMERIC(24, 6) NOT NULL CHECK (amount > 0),
    sender_username VARCHAR(64) NOT NULL,
    recipient_username VARCHAR(64) NOT NULL,
    pqc_signature_hex VARCHAR(256) NOT NULL DEFAULT '0xFIPS204_Dilithium3_Verified',
    note VARCHAR(256),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id_created ON public.transactions (user_id, created_at DESC);

-- 5. 기관/개인 KYC/AML 심사 케이스 테이블 (kyc_cases)
-- 홍콩 HKMA 적격 기관 온보딩 및 FATF Travel Rule 검증 상태를 추적합니다.
CREATE TABLE IF NOT EXISTS public.kyc_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entity_type VARCHAR(32) NOT NULL DEFAULT 'institutional' CHECK (entity_type IN ('institutional', 'individual')),
    entity_name VARCHAR(256) NOT NULL,
    hk_registration_no VARCHAR(64),
    current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 3),
    status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'aml_cleared', 'approved', 'rejected')),
    daily_conduit_limit_usd NUMERIC(24, 2) NOT NULL DEFAULT 10000000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Web3 외부 지갑 연동 테이블 (wallet_links)
-- MetaMask(EIP-1193) 및 ERC-4337 하이브리드 스마트 지갑 주소를 매핑합니다.
CREATE TABLE IF NOT EXISTS public.wallet_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    classic_evm_address VARCHAR(64) NOT NULL,
    erc4337_smart_wallet VARCHAR(64),
    pqc_algorithm VARCHAR(64) NOT NULL DEFAULT 'ML-DSA-65 (Dilithium3)',
    pqc_public_key VARCHAR(512) NOT NULL,
    kyber_kem_capsule VARCHAR(256),
    chain_id VARCHAR(32) NOT NULL DEFAULT '0x1',
    is_primary BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. 사용자 보안 감사 추적 테이블 (audit_trails)
CREATE TABLE IF NOT EXISTS public.audit_trails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_name VARCHAR(64) NOT NULL,
    metadata JSONB,
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Row Level Security (RLS) 정책 설정 (타인의 민감 데이터 접근 원천 차단)
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trails ENABLE ROW LEVEL SECURITY;

-- 본인 데이터만 조회/수정 가능하도록 정책 강제
CREATE POLICY users_self_policy ON public.users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY sessions_self_policy ON public.sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY accounts_self_select_policy ON public.accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY transactions_self_select_policy ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY kyc_cases_self_policy ON public.kyc_cases
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY wallet_links_self_policy ON public.wallet_links
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY audit_trails_self_select_policy ON public.audit_trails
    FOR SELECT USING (auth.uid() = user_id);

