/**
 * USDQS 풀스택 백엔드 코어 서버 (Express + TypeScript)
 * 기획안 제8절의 모든 REST API 엔드포인트를 제공합니다.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { signup, login, refreshToken, getMe } from './controllers/authController.js';
import {
  getBalance,
  buyUsdqs,
  sellUsdqs,
  transferUsdqs,
  getTransactions,
  freezeAccount,
  unfreezeAccount,
} from './controllers/walletController.js';
import {
  getReserves,
  getAttestations,
  getAuditLogs,
  processMintBurnMultisig,
  toggleBridgeCircuitBreaker,
  verifyWeb3Connect,
  simulateMint,
  simulateRedeem,
  simulateBridge,
} from './controllers/adminController.js';
import { requireAuth } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// 0. 헬스체크 엔드포인트
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'USDQS Full-Stack Quantum Core API',
    version: '2.0.0-hkma-pqc',
    timestamp: new Date().toISOString(),
  });
});

// 1. 인증 엔드포인트 (Auth)
app.post('/api/auth/signup', signup);
app.post('/api/auth/login', login);
app.post('/api/auth/refresh', requireAuth, refreshToken);
app.get('/api/auth/me', requireAuth, getMe);

// 2. 개인/기관 지갑 원장 엔드포인트 (Wallet)
app.get('/api/wallet/balance', requireAuth, getBalance);
app.post('/api/wallet/buy', requireAuth, buyUsdqs);
app.post('/api/wallet/sell', requireAuth, sellUsdqs);
app.post('/api/wallet/transfer', requireAuth, transferUsdqs);
app.get('/api/wallet/transactions', requireAuth, getTransactions);
app.post('/api/wallet/freeze', requireAuth, freezeAccount);
app.post('/api/wallet/unfreeze', requireAuth, unfreezeAccount);

// 3. 운영/거버넌스 및 투명성 엔드포인트 (Admin & Transparency)
app.post('/api/admin/mintburn', processMintBurnMultisig);
app.post('/api/admin/bridge/circuit-breaker', toggleBridgeCircuitBreaker);
app.get('/api/reserves', getReserves);
app.get('/api/attestations', getAttestations);
app.get('/api/audit-logs', getAuditLogs);

// 4. Web3 및 시뮬레이션 엔드포인트 (Web3 & Simulator)
app.post('/api/web3/connect', verifyWeb3Connect);
app.post('/api/sim/mint', simulateMint);
app.post('/api/sim/redeem', simulateRedeem);
app.post('/api/sim/bridge', simulateBridge);

// 전역 에러 방어 핸들러
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled backend error:', err);
  res.status(500).json({ success: false, message: '서버 내부 처리 중 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 USDQS 풀스택 코어 API 서버 가동 완료: http://localhost:${PORT}/api`);
  console.log(`🔒 Security: PBKDF2(150k) + Lockout(5회/30초) + NIST FIPS 203/204`);
  console.log(`=======================================================`);
});

export default app;

