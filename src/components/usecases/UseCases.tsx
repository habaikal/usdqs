/**
 * 인터랙티브 5대 유스케이스 탭 & 실시간 글로벌 송금 비용 비교 계산기 (UseCases)
 * - neo-usdc의 대표 인터랙션 컴포넌트인 SWIFT 전신환 vs USDQS 슬라이더 비교 계산기를 완벽 통합
 * - 해외 송금 / 가치 보관 / 기관 트레이딩 / 가맹점 결제 / AI 에이전트 결제 5개 탭 제공
 */
import React, { useState } from 'react';
import {
  Send,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Bot,
  Calculator,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface UseCasesProps {
  onOpenUserPortal: () => void;
}

export const UseCases: React.FC<UseCasesProps> = ({ onOpenUserPortal }) => {
  const { language } = useTranslation();
  const isKo = language === 'ko';
  const isZh = language === 'zh-HK';

  const [activeTab, setActiveTab] = useState<'send' | 'save' | 'trade' | 'spend' | 'ai-agents'>('send');
  const [sendAmount, setSendAmount] = useState<number>(10000);

  // SWIFT 전신환($45 고정 전신료 + 1.5% 환전 마진) vs USDQS($0.001 온체인 가스비) 실시간 비교 계산
  const swiftFee = 45 + sendAmount * 0.015;
  const usdqsFee = 0.001;
  const savedAmount = Math.max(0, swiftFee - usdqsFee);

  const useCaseList = [
    {
      id: 'send' as const,
      icon: Send,
      tabLabel: isKo ? '글로벌 송금' : isZh ? '跨境匯款' : 'Global Send',
      title: isKo ? '국경 없는 실시간 글로벌 P2P & 기업 송금' : isZh ? '無國界即時全球匯款與企業結算' : 'Borderless Instant Global Remittance',
      tagline: isKo ? 'SWIFT 전신환 대비 99% 비용 절감 및 0.8초 즉시 도착' : isZh ? '較 SWIFT 電匯節省 99% 費用，0.8 秒極速到賬' : '99% Cheaper than SWIFT Wires with 0.8s Finality',
      description: isKo
        ? '중개 은행을 거치며 3~5 영업일이 소요되고 고액의 수수료가 차감되는 기존 국제 송금과 달리, USDQS는 전 세계 185개국 어디로든 연중무휴 24시간 1센트 미만의 비용으로 즉시 전송됩니다.'
        : isZh
        ? '無需經過多家代理銀行並等待 3 至 5 個營業日，USDQS 可全天候 24 小時以不到 1 美分的費用即時發送至全球 185 個國家。'
        : 'Bypass correspondent banking delays of 3-5 business days. Send digital dollars across 185 countries 24/7/365 in under a second for less than a tenth of a cent.',
      stats: {
        SPEED: '< 0.8s',
        FEE: '$0.001',
        SAVINGS: '99.4%',
      },
      cta: isKo ? '지금 실시간 PQC 송금 체험하기' : isZh ? '立即體驗即時 PQC 匯款' : 'Launch PQC Transfer Portal',
    },
    {
      id: 'save' as const,
      icon: PiggyBank,
      tabLabel: isKo ? '가치 보관' : isZh ? '價值儲存' : 'Safe Treasury',
      title: isKo ? '홍콩 파산절연 신탁 기반 102.4% 안전 자산 금고' : isZh ? '香港破產隔離信託支持之 102.4% 安全資產金庫' : '102.4% Over-Collateralized Sovereign Dollar Vault',
      tagline: isKo ? '미국 단기국채(T-Bills) 82.5% + 역레포 11.5% + 신탁 현금 6.0%' : isZh ? '美國短期國債 82.5% + 逆回購 11.5% + 信託現金 6.0%' : '82.5% U.S. T-Bills + 11.5% Reverse Repo + 6.0% Cash',
      description: isKo
        ? '환율 변동성과 은행 파산 위험으로부터 기업 및 개인 자산을 안전하게 보호하세요. 모든 준비금은 발행사와 법적으로 완전히 분리된 홍콩 인가 은행 신탁 계좌에 보관됩니다.'
        : isZh
        ? '保護企業與個人資產免受匯率波動與銀行破產風險影響。所有儲備均存放於與發行人法律完全隔離的香港認可銀行信託賬戶中。'
        : 'Shield corporate and personal wealth from local currency volatility. All backing assets are legally segregated in Hong Kong authorized custodian trusts.',
      stats: {
        BACKING: '102.4%',
        CUSTODY: 'HK Trust',
        SECURITY: 'FIPS 204',
      },
      cta: isKo ? '개인/기관 포털에서 지갑 생성' : isZh ? '於門戶網站建立量子錢包' : 'Create Quantum-Safe Wallet',
    },
    {
      id: 'trade' as const,
      icon: TrendingUp,
      tabLabel: isKo ? '기관 트레이딩' : isZh ? '機構交易' : 'DeFi & OTC',
      title: isKo ? '글로벌 거래소 및 DeFi 기축 유동성 정산 통화' : isZh ? '全球交易所與 DeFi 基礎流動性結算貨幣' : 'Prime Institutional OTC & DeFi Settlement Rail',
      tagline: isKo ? '슬리피지 0.00% 1:1 발행 및 T+1 기관급 대량 상환' : isZh ? '零滑點 0.00% 1:1 鑄造與 T+1 機構級大額贖回' : '0.00% Slippage Primary Conduit & T+1 Wire Settlement',
      description: isKo
        ? '기관 투자자와 마켓메이커는 일일 $10,000,000 USD 한도의 1차 발행 통로(Direct Conduit)를 통해 가격 괴리 없이 대규모 유동성을 공급받고 차익거래를 수행할 수 있습니다.'
        : isZh
        ? '機構投資者與造市商可透過每日高達 $10,000,000 USD 的一級發行通道，無滑點獲取大額流動性並進行跨市場結算。'
        : 'Institutional desks and market makers access a $10M daily primary mint/burn conduit with zero slippage and real-time Chainlink PoR verification.',
      stats: {
        SLIPPAGE: '0.00%',
        SLA: 'T+1 Wire',
        CHAINS: '16 Networks',
      },
      cta: isKo ? '기관용 1:1 민팅/상환 포털 열기' : isZh ? '開啟機構 1:1 鑄造與贖回門戶' : 'Access Institutional Conduit',
    },
    {
      id: 'spend' as const,
      icon: CreditCard,
      tabLabel: isKo ? '가맹점 결제' : isZh ? '商戶支付' : 'Merchant Pay',
      title: isKo ? '차지백 위험 없는 수수료 0% 글로벌 커머스 결제' : isZh ? '無拒付風險之零手續費全球商務支付' : 'Zero-Chargeback Global Merchant Checkout',
      tagline: isKo ? '신용카드 3% 수수료 제거 및 즉각적인 L2 정산 완결성' : isZh ? '免除 3% 信用卡手續費並實現 L2 即時結算終局性' : 'Eliminate 3% Card Interchange Drag with Instant Finality',
      description: isKo
        ? '전 세계 고객으로부터 디지털 달러를 직접 수취하고, 신용카드 환불 사기(Chargeback)나 수주간의 정산 보류 없이 즉시 현금 흐름을 확보하세요.'
        : isZh
        ? '直接向全球客戶收取數位美元，杜絕信用卡拒付詐騙與數週的結算延遲，即時掌握企業現金流。'
        : 'Accept digital dollars globally without credit card chargeback fraud or rolling reserve holds. Settle instantly into your corporate wallet.',
      stats: {
        INTERCHANGE: '0.00%',
        CHARGEBACK: 'Zero Risk',
        SDK: 'REST / Web3',
      },
      cta: isKo ? '가맹점 결제 계좌 개설하기' : isZh ? '開立商戶結算賬戶' : 'Open Merchant Account',
    },
    {
      id: 'ai-agents' as const,
      icon: Bot,
      tabLabel: isKo ? 'AI 에이전트' : isZh ? 'AI 代理支付' : 'AI Agents',
      title: isKo ? '자율 AI 에이전트 간 HTTP 402 초소액(Micro) 자동 정산' : isZh ? '自主 AI 代理間 HTTP 402 微支付自動結算' : 'Autonomous AI Agent HTTP 402 Micro-Settlements',
      tagline: isKo ? 'ERC-4337 세션키 및 PQC 서명 기반 머신-투-머신 경제' : isZh ? '基於 ERC-4337 會話金鑰與 PQC 簽章之機器對機器經濟' : 'ERC-4337 Session Keys & PQC Signatures for M2M Economy',
      description: isKo
        ? 'AI 에이전트가 사람의 매번 수동 승인 없이도 지정된 한도 내에서 클라우드 GPU 연산, LLM API 호출, 실시간 데이터 피드 사용료를 건당 $0.0001 단위로 자율 결제합니다.'
        : isZh
        ? 'AI 代理無需人工逐筆批准，即可在預設限額內以每筆 $0.0001 的精度自動支付雲端 GPU 算力、LLM API 調用與數據訂閱費用。'
        : 'Empower autonomous AI agents to pay for GPU compute, LLM API calls, and real-time data streams per request using programmable ERC-4337 session keys.',
      stats: {
        PROTOCOL: 'HTTP 402',
        MIN_TX: '$0.0001',
        WALLET: 'ERC-4337 AA',
      },
      cta: isKo ? 'AI 에이전트용 PQC 키페어 발급' : isZh ? '簽發 AI 代理專用 PQC 金鑰對' : 'Generate Agent PQC Keypair',
    },
  ];

  const currentCase = useCaseList.find((c) => c.id === activeTab) || useCaseList[0];
  const ActiveIcon = currentCase.icon;

  return (
    <section id="usecases" className="py-24 border-b border-slate-800/80 bg-[#070b16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VERSATILE FINANCIAL APPLICATIONS &amp; REMITTANCE CALCULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            {isKo
              ? '모든 글로벌 금융 활동을 USDQS로 혁신하세요'
              : isZh
              ? '以 USDQS 革新所有全球金融活動'
              : 'Streamline Every Financial Workflow with USDQS'}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            {isKo
              ? '실시간 해외 송금 비용 비교부터 기관 트레이딩, 가맹점 결제, 자율 AI 에이전트 결제까지 한 곳에서 시뮬레이션해 보세요.'
              : isZh
              ? '從即時跨境匯款成本比較、機構交易、商戶支付到自主 AI 代理微支付，於單一平台完整體驗。'
              : 'Simulate real-time remittance cost savings, institutional OTC flows, merchant checkout, and autonomous AI agent payments.'}
          </p>
        </div>

        {/* 5 Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 max-w-3xl mx-auto mb-10 shadow-xl">
          {useCaseList.map((uc) => {
            const Icon = uc.icon;
            const isActive = activeTab === uc.id;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => setActiveTab(uc.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{uc.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Card (5 Cols) */}
          <div className="lg:col-span-5 glass-panel p-7 sm:p-9 rounded-3xl border border-emerald-500/30 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                <ActiveIcon className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans'] mb-2">
                {currentCase.title}
              </h3>
              <p className="text-cyan-400 font-semibold font-mono text-xs mb-4">
                {currentCase.tagline}
              </p>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8">
                {currentCase.description}
              </p>
            </div>

            <div className="space-y-5 pt-5 border-t border-slate-800">
              <div className="grid grid-cols-3 gap-2.5">
                {Object.entries(currentCase.stats).map(([k, v]) => (
                  <div
                    key={k}
                    className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center font-mono"
                  >
                    <div className="text-[10px] uppercase text-slate-400 mb-0.5">{k}</div>
                    <div className="text-xs sm:text-sm font-bold text-emerald-400 truncate">{v}</div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onOpenUserPortal}
                className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl border border-emerald-500/40 hover:border-emerald-400 transition flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>{currentCase.cta}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Interactive Area (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-7 sm:p-9 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-2xl">
            {activeTab === 'send' ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs sm:text-sm font-mono font-bold">
                    <Calculator className="w-4 h-4" />
                    <span>
                      {isKo
                        ? '실시간 글로벌 송금 수수료 비교 계산기 (SWIFT vs USDQS)'
                        : isZh
                        ? '即時全球匯款手續費比較計算機 (SWIFT vs USDQS)'
                        : 'Real-Time Remittance Fee Calculator (SWIFT vs USDQS)'}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 font-mono font-bold">
                    99% Cost Saved
                  </span>
                </div>

                {/* Slider Input */}
                <div className="p-5 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>
                      {isKo
                        ? '해외로 송금할 달러 금액을 조절해 보세요:'
                        : isZh
                        ? '請拖動滑桿設定跨境匯款金額：'
                        : 'Select cross-border transfer amount:'}
                    </span>
                    <span className="font-mono text-emerald-400 font-extrabold text-lg">
                      ${sendAmount.toLocaleString()} USD
                    </span>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(Number(e.target.value))}
                    className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>$100</span>
                    <span>$25,000</span>
                    <span>$50,000</span>
                    <span>$100,000</span>
                  </div>
                </div>

                {/* Comparison Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                  {/* Legacy SWIFT */}
                  <div className="p-5 bg-slate-950/70 rounded-2xl border border-rose-500/30 space-y-3">
                    <div className="text-xs font-bold text-rose-400 flex items-center justify-between">
                      <span>{isKo ? '기존 은행 SWIFT 전신환' : isZh ? '傳統銀行 SWIFT 電匯' : 'Legacy SWIFT Bank Wire'}</span>
                      <span className="text-[10px] bg-rose-500/10 px-1.5 py-0.5 rounded">Legacy</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isKo ? '전신료 + 환전 마진:' : 'Wire + FX Spread:'}</span>
                        <span className="text-rose-300 font-bold">${swiftFee.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isKo ? '소요 시간:' : 'Settlement Time:'}</span>
                        <span className="text-slate-300">{isKo ? '3 ~ 5 영업일' : '3 - 5 Business Days'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isKo ? '주말/공휴일 정산:' : 'Weekend Settlement:'}</span>
                        <span className="text-slate-500">{isKo ? '불가 (영업일 한정)' : 'Closed'}</span>
                      </div>
                    </div>
                  </div>

                  {/* USDQS */}
                  <div className="p-5 bg-emerald-950/20 rounded-2xl border border-emerald-500/40 space-y-3 relative overflow-hidden">
                    <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
                      <span>{isKo ? 'USDQS 양자내성 전송' : isZh ? 'USDQS 量子安全傳輸' : 'USDQS Quantum Transfer'}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                        FIPS 204
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isKo ? '온체인 수수료:' : 'Protocol & Gas Fee:'}</span>
                        <span className="text-emerald-400 font-bold">&lt; ${usdqsFee} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isKo ? '소요 시간:' : 'Settlement Time:'}</span>
                        <span className="text-cyan-300 font-bold">{isKo ? '0.8초 즉시 완결' : '0.8 Seconds'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{isKo ? '주말/공휴일 정산:' : 'Weekend Settlement:'}</span>
                        <span className="text-emerald-400 font-bold">24/7/365 Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings Highlight Banner */}
                <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">
                        {isKo
                          ? '1회 송금 시 즉시 절약되는 금액'
                          : isZh
                          ? '單次匯款可立即節省之金額'
                          : 'Immediate Savings on This Transfer'}
                      </div>
                      <div className="text-lg font-extrabold text-emerald-400 font-mono">
                        +${savedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD Saved
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenUserPortal}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 text-slate-950 text-xs font-extrabold rounded-xl transition cursor-pointer shrink-0"
                  >
                    {isKo ? '수수료 없이 송금 시작' : isZh ? '立即免費匯款' : 'Send Now'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 flex flex-col justify-between h-full">
                <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-emerald-400 font-bold">LIVE TELEMETRY SIMULATION</span>
                    <span className="text-slate-400">Status: HKMA &amp; PQC Verified</span>
                  </div>

                  <h4 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
                    {currentCase.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentCase.description}
                  </p>

                  <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5">
                    <div className="text-slate-500">// USDQS Quantum Core v2.0 Execution Log</div>
                    <div className="text-cyan-400">&gt; active_module: &quot;{activeTab.toUpperCase()}&quot;</div>
                    <div className="text-emerald-400">&gt; pqc_signature: &quot;ML-DSA-65 (Dilithium3) VALID&quot;</div>
                    <div className="text-teal-300">&gt; reserve_backing_ratio: &quot;102.4% (HK Segregated Trust)&quot;</div>
                    <div className="text-slate-300">&gt; settlement_finality: &quot;&lt; 800ms Guaranteed&quot;</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>NIST FIPS 203/204 &amp; ERC-4337 Audited</span>
                  </span>
                  <button
                    type="button"
                    onClick={onOpenUserPortal}
                    className="text-emerald-400 hover:underline font-bold cursor-pointer"
                  >
                    {isKo ? '포털에서 바로 실행하기 →' : isZh ? '於門戶網站立即執行 →' : 'Launch in Portal →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

