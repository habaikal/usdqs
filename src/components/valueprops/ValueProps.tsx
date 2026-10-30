/**
 * 6대 핵심 경쟁 우위 비교 섹션 (ValueProps)
 * - neo-usdc의 직관적인 가치 제안 레이아웃과 neo-usdt의 HKMA 규제/PQC 기술을 결합
 */
import React from 'react';
import {
  Globe,
  Zap,
  Percent,
  BadgeDollarSign,
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface ValuePropsProps {
  onOpenUserPortal: () => void;
}

export const ValueProps: React.FC<ValuePropsProps> = ({ onOpenUserPortal }) => {
  const { language } = useTranslation();
  const isKo = language === 'ko';
  const isZh = language === 'zh-HK';

  const valueItems = [
    {
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      title: isKo
        ? '홍콩 HKMA Stablecoins Ordinance 완벽 준수 및 파산절연 신탁'
        : isZh
        ? '完全符合香港金管局《穩定幣條例》及破產隔離信託'
        : 'HKMA Stablecoins Ordinance Compliant & Bankruptcy-Remote Trust',
      description: isKo
        ? '준비금의 100% 이상(102.4%)이 홍콩 인가 수탁은행(Standard Chartered HK 등)의 독립 분리 신탁 계좌에 만기 90일 이내 미국 단기국채(T-Bills)와 현금으로 안전하게 보관됩니다.'
        : isZh
        ? '超過 100% (102.4%) 的儲備安全存放於香港認可託管銀行的獨立破產隔離信託賬戶中，全數配置於 90 天內到期之美國短期國債與現金。'
        : 'Over 102.4% of reserves are segregated in bankruptcy-remote trust accounts at authorized Hong Kong custodian banks, invested strictly in <90-day U.S. T-Bills and cash.',
    },
    {
      icon: Cpu,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      title: isKo
        ? 'NIST 공식 표준 후양자암호(FIPS 203/204) & ERC-4337 계정추상화'
        : isZh
        ? 'NIST 官方標準後量子密碼 (FIPS 203/204) 與 ERC-4337 賬戶抽象'
        : 'NIST Post-Quantum Cryptography (FIPS 203/204) & ERC-4337 AA',
      description: isKo
        ? '미래 양자컴퓨터의 쇼어(Shor) 알고리즘 공격으로부터 자산을 보호하기 위해 CRYSTALS-Dilithium(ML-DSA) 서명과 Kyber(ML-KEM) 키교환을 하이브리드 스마트 지갑에 기본 탑재했습니다.'
        : isZh
        ? '為防禦未來量子電腦 Shor 演算法攻擊，混合智能錢包原生內建 CRYSTALS-Dilithium (ML-DSA) 簽章與 Kyber (ML-KEM) 金鑰封裝。'
        : 'Preemptively immune to quantum Shor algorithm attacks via native CRYSTALS-Dilithium (ML-DSA) lattice signatures and Kyber (ML-KEM) key encapsulation.',
    },
    {
      icon: BadgeDollarSign,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/30',
      title: isKo
        ? '언제나 1 USDQS = $1.00 USD 무슬리피지 1:1 발행 및 T+1 상환'
        : isZh
        ? '始終 1 USDQS = $1.00 USD 零滑點 1:1 鑄造與 T+1 贖回'
        : 'Guaranteed 1 USDQS = $1.00 USD Minting & T+1 Wire Redemption',
      description: isKo
        ? '알고리즘이나 변동성 위험 자산이 전혀 섞이지 않은 순수 법정화폐 연동 달러입니다. 영업일 기준 T+1 이내에 홍콩 및 글로벌 은행 계좌로 전신환 상환이 보장됩니다.'
        : isZh
        ? '絕不包含演算法或高風險波動資產。保證於 T+1 營業日內透過電匯將資金贖回至香港及全球銀行賬戶。'
        : 'Zero algorithmic or volatile collateral risk. Verified holders enjoy guaranteed T+1 business day bank wire redemptions directly from the Hong Kong trust.',
    },
    {
      icon: Percent,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      title: isKo
        ? '건당 $0.001 미만 — 기존 SWIFT 국제 전신환 대비 99% 비용 절감'
        : isZh
        ? '每筆低於 $0.001 — 較傳統 SWIFT 國際電匯節省 99% 成本'
        : 'Sub-$0.001 Network Cost — 99% Savings vs. Traditional SWIFT Wires',
      description: isKo
        ? '기존 해외 송금 시 발생하던 $30~$50의 전신환 수수료와 1.5%의 환전 스프레드를 제거하여 기업 무역 대금 정산과 개인 송금 효율을 극대화합니다.'
        : isZh
        ? '消除傳統跨境匯款高達 $30~$50 的電匯費與 1.5% 匯兌點差，大幅提升企業貿易結算與個人匯款效率。'
        : 'Eliminates the $30-$50 fixed wire fees and 1.5% FX spread of legacy correspondent banking, maximizing corporate treasury and individual remittance efficiency.',
    },
    {
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      title: isKo
        ? 'CCTP-Q 네이티브 Burn & Mint 브릿지와 서킷 브레이커 방어'
        : isZh
        ? 'CCTP-Q 原生銷毀與鑄造跨鏈橋及熔斷防禦機制'
        : 'CCTP-Q Native Burn & Mint Bridge with Autonomous Circuit Breaker',
      description: isKo
        ? '해킹에 취약한 래핑(Wrapped) 토큰 대신 출발 체인 소각 후 도착 체인 네이티브 발행을 수행하며, 일일 유출 한도 초과 시 서킷 브레이커가 자동으로 자금을 보호합니다.'
        : isZh
        ? '摒棄易受攻擊的封裝代幣，採用源鏈銷毀、目標鏈原生鑄造機制，並配備每日流出限額與自動熔斷保護。'
        : 'Replaces vulnerable wrapped tokens with native burn-and-mint across Ethereum and Solana, guarded by 24h rate limits and an automated anomaly circuit breaker.',
    },
    {
      icon: Globe,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      title: isKo
        ? '자율 AI 에이전트 HTTP 402 마이크로 결제 및 24/7 글로벌 유동성'
        : isZh
        ? '自主 AI 代理 HTTP 402 微支付與 24/7 全球流動性'
        : 'Autonomous AI Agent HTTP 402 Micro-Payments & 24/7 Liquidity',
      description: isKo
        ? '연중무휴 0.8초 이내 정산과 프로그래밍 가능한 스마트 지갑 SDK를 통해 AI 에이전트 간 API 호출·GPU 연산 대금 실시간 정산까지 완벽히 지원합니다.'
        : isZh
        ? '全天候 0.8 秒內極速結算，結合可編程智能錢包 SDK，完美支援 AI 代理之間的 API 調用與算力微支付。'
        : 'Sub-second 24/7/365 finality with programmable smart wallet SDKs enabling machine-to-machine API and GPU compute micro-settlements.',
    },
  ];

  return (
    <section className="py-24 relative border-b border-slate-800/80 bg-[#050811]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Sticky Column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>UNMATCHED QUANTUM FINANCIAL INFRASTRUCTURE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-['Plus_Jakarta_Sans']">
                {isKo ? (
                  <>
                    기관과 개인 모두를 위한 달러,
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                      비교할 수 없는 6대 기술 우위.
                    </span>
                  </>
                ) : isZh ? (
                  <>
                    專為機構與個人打造的數位美元，
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                      無可匹敵的六大核心優勢。
                    </span>
                  </>
                ) : (
                  <>
                    Built for Institutions &amp; Individuals,
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                      Six Unmatched Advantages.
                    </span>
                  </>
                )}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isKo
                  ? '1세대 스테이블코인의 불투명한 준비금과 양자컴퓨터 해독 취약점을 완전히 극복했습니다. USDQS는 홍콩 금융관리국(HKMA) 라이선스 기준과 NIST 양자보안 표준을 동시에 충족하는 유일한 풀스택 디지털 달러입니다.'
                  : isZh
                  ? '徹底克服第一代穩定幣儲備不透明與量子電腦破解風險。USDQS 是唯一同時滿足香港金管局(HKMA)發牌標準與 NIST 後量子安全標準的全棧數位美元。'
                  : 'Overcoming the opacity and quantum vulnerabilities of first-generation stablecoins, USDQS is the only full-stack digital dollar engineered for both HKMA regulatory standards and NIST post-quantum security.'}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenUserPortal}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-xl shadow-emerald-500/20 cursor-pointer group"
                >
                  <span>
                    {isKo
                      ? '개인 지갑 개설 및 1:1 민팅 시작하기'
                      : isZh
                      ? '立即開啟個人錢包與 1:1 鑄造'
                      : 'Open Wallet & Start 1:1 Minting'}
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/30 space-y-1.5 font-mono">
                <div className="text-[11px] text-emerald-400 font-bold uppercase">
                  Regulatory &amp; Cryptographic Standard
                </div>
                <div className="text-xs text-slate-300">
                  HKMA Stablecoins Ordinance + NIST FIPS 203 (ML-KEM) &amp; FIPS 204 (ML-DSA) + FATF Travel Rule
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Feature Cards */}
          <div className="lg:col-span-7 space-y-4">
            {valueItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 flex flex-col sm:flex-row items-start gap-5 transition-all group"
                >
                  <div
                    className={`p-3.5 rounded-xl ${item.bgColor} ${item.borderColor} border ${item.color} shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition font-['Plus_Jakarta_Sans']">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

