# 🏛️ USDQS (USD Quantum Stable) Full-Stack Platform

**Institutional Multi-Chain Settlement Dollar — HKMA Stablecoins Ordinance Compliant & NIST Post-Quantum Cryptography (FIPS 203/204)**

## ✨ Key Features

- **Full User & Institutional Portal (`UserPortalModal`)**:
  - **Quantum-Safe Wallet & Ledger**: PBKDF2-SHA256 (150,000 iterations) authentication, 5-attempt 30s lockout protection, 1:1 zero-slippage USDQS Buy/Sell, real-time PQC-signed peer-to-peer transfers, transaction ledger, and emergency self Kill-Switch (`Freeze`/`Unfreeze`).
  - **Institutional Conduit**: NIST FIPS 204 ML-DSA-65 (Dilithium3) keypair generator, 3-step HKMA KYC/AML onboarding, and T+1 bank wire redemption tracker.
- **Operator & Compliance Console (`AdminConsoleModal`)**:
  - 3-of-5 Multi-Sig governance queue (including expandable issuance cap `24M ➔ 50M USDQS`), CCTP-Q bridge circuit breaker, OFAC/UN/EU sanctions screening & forced burn, and 7-year statutory audit logs.
- **Interactive Telemetry & Simulators**:
  - Real-time Proof of Reserves (102.4% over-collateralized HK segregated trust), PQC ERC-4337 hybrid verification simulator, SWIFT vs. USDQS remittance cost calculator, CCTP-Q native burn-and-mint bridge simulator, and AI Protocol Intelligence Assistant.
- **Multi-Language Support (`i18n`)**: English (`en`), Traditional Chinese (`zh-HK`), and Korean (`ko`).

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start frontend development server
npm run dev

# 3. Build for production
npm run build
```
