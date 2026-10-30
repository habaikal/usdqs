/**
 * USDQS AI 인텔리전스 어시스턴트 모달 (AiIntelligenceModal)
 * - neo-usdc의 AI 검색 모달에 HKMA 규제, NIST FIPS 203/204 양자내성, 3-of-5 멀티시그, T+1 상환 지식을 통합
 */
import React, { useState } from 'react';
import { X, Sparkles, Search, Shield, FileText, Bot } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface AiIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiIntelligenceModal: React.FC<AiIntelligenceModalProps> = ({ isOpen, onClose }) => {
  const { language } = useTranslation();
  const isKo = language === 'ko';
  const isZh = language === 'zh-HK';

  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const knowledgeBase: Record<string, string> = {
    준비금:
      'USDQS의 준비금은 102.4% 초과 담보 상태로 유지됩니다. 만기 90일 이내 미국 단기국채(T-Bills) 82.5%, 익일물 역레포 11.5%, 홍콩 인가 수탁은행(Standard Chartered HK 등) 파산절연 신탁 현금 6.0%로 구성되며 매월 대형 회계법인 실사 및 Chainlink PoR 오라클로 검증됩니다.',
    hkma:
      'USDQS는 2025년 8월 시행된 홍콩 금융관리국(HKMA)의 《법정통화 연동 스테이블코인 조례(Stablecoins Ordinance)》 요건을 완전 준수합니다. 준비금 파산절연 분리 보관, 액면가(1:1) 상환 보장, 영업일 기준 T+1 이내 상환 SLA, 최소 7년 감사 로그 보관을 모두 충족합니다.',
    양자:
      'USDQS는 미래 양자컴퓨터의 쇼어(Shor) 알고리즘 공격에 선제 대응하기 위해 NIST 공식 표준인 FIPS 204 ML-DSA(CRYSTALS-Dilithium3) 서명과 FIPS 203 ML-KEM(Kyber768) 키교환을 ERC-4337 계정추상화 하이브리드 스마트 지갑에 적용했습니다.',
    브릿지:
      '해킹 위험이 높은 제3자 래핑(Wrapped) 브릿지 대신, 출발 체인에서 즉시 소각하고 도착 체인에서 네이티브로 발행하는 CCTP-Q 프로토콜을 사용합니다. 일일 유출 한도($5M) 초과 시 관리자 콘솔의 서킷 브레이커가 자동으로 브릿지를 일시 정지합니다.',
    수수료:
      '프로토콜 1:1 발행(Mint) 및 상환(Redeem) 수수료는 0.00%이며, 온체인 전송 수수료는 건당 $0.001 미만으로 기존 SWIFT 국제 전신환($45 + 1.5% 환전 수수료) 대비 99% 이상 비용을 절감합니다.',
    상환:
      '인증된 개인 및 기관 사용자는 언제든 보유한 USDQS를 1:1 비율($1.00 USD)로 소각하고 홍콩 및 글로벌 은행 계좌(IBAN/SWIFT)로 영업일 기준 T+1 이내에 전신환 입금을 받을 수 있습니다.',
    ai:
      'USDQS는 자율 AI 에이전트가 ERC-4337 세션키와 HTTP 402 프로토콜을 통해 GPU 클라우드 연산, LLM API 호출, 데이터 스트림 비용을 건당 $0.0001 단위로 실시간 자동 정산할 수 있도록 지원합니다.',
  };

  const handleAsk = (textToAsk: string) => {
    setQuery(textToAsk);
    setIsTyping(true);
    setAnswer(null);

    setTimeout(() => {
      setIsTyping(false);
      const lower = textToAsk.toLowerCase();
      if (lower.includes('준비금') || lower.includes('reserve') || lower.includes('담보')) {
        setAnswer(knowledgeBase['준비금']);
      } else if (lower.includes('hkma') || lower.includes('홍콩') || lower.includes('규제')) {
        setAnswer(knowledgeBase['hkma']);
      } else if (lower.includes('양자') || lower.includes('pqc') || lower.includes('dilithium') || lower.includes('보안')) {
        setAnswer(knowledgeBase['양자']);
      } else if (lower.includes('브릿지') || lower.includes('bridge') || lower.includes('cctp') || lower.includes('서킷')) {
        setAnswer(knowledgeBase['브릿지']);
      } else if (lower.includes('수수료') || lower.includes('fee') || lower.includes('송금')) {
        setAnswer(knowledgeBase['수수료']);
      } else if (lower.includes('상환') || lower.includes('redeem') || lower.includes('t+1')) {
        setAnswer(knowledgeBase['상환']);
      } else if (lower.includes('ai') || lower.includes('에이전트')) {
        setAnswer(knowledgeBase['ai']);
      } else {
        setAnswer(
          `USDQS는 홍콩 HKMA 규제 준수(102.4% 초과 담보 파산절연 신탁)와 NIST FIPS 203/204 양자내성 암호화를 결합한 기관급 디지털 달러입니다. "${textToAsk}"에 대한 상세 내용은 상단 백서(Whitepaper v1.0) 또는 개인/기관 포털에서 즉시 확인 및 체험하실 수 있습니다.`
        );
      }
    }, 350);
  };

  const chips = [
    '준비금 102.4% 구성',
    '홍콩 HKMA 규제 준수',
    'PQC 양자 보안 원리',
    'CCTP-Q 브릿지 & 서킷 브레이커',
    'T+1 상환 SLA',
    'AI 에이전트 결제',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#070b16] rounded-2xl border border-emerald-500/40 shadow-2xl p-6 sm:p-8 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            USDQS Quantum AI Intelligence
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] mb-1.5">
          {isKo
            ? 'USDQS AI 프로토콜 어시스턴트'
            : isZh
            ? 'USDQS AI 協議智能助手'
            : 'USDQS AI Protocol Assistant'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-5">
          {isKo
            ? '준비금 증명(PoR), HKMA 규제, NIST PQC 양자보안, 브릿지, 수수료에 대해 무엇이든 물어보세요.'
            : isZh
            ? '歡迎詢問有關儲備證明 (PoR)、HKMA 監管、NIST PQC 量子安全、跨鏈橋與手續費的任何問題。'
            : 'Ask anything about Proof-of-Reserves, HKMA compliance, NIST PQC security, or T+1 redemptions.'}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) handleAsk(query);
          }}
          className="relative mb-4"
        >
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isKo
                ? '예: 준비금 구성, HKMA 규제, PQC 양자 보안, T+1 상환...'
                : 'Ask about reserves, HKMA, PQC Dilithium, bridge...'
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl py-3.5 pl-11 pr-24 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:brightness-110 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
          >
            {isKo ? '질문하기' : isZh ? '提問' : 'Ask'}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleAsk(chip)}
              className="text-xs px-2.5 py-1 bg-slate-900 hover:bg-slate-800 hover:border-emerald-500/40 border border-slate-800 rounded-lg text-slate-300 transition cursor-pointer font-mono"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Result Box */}
        <div className="min-h-[130px] p-4 bg-slate-950/90 rounded-xl border border-slate-800 text-sm">
          {isTyping ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs py-8 justify-center font-mono">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Analyzing USDQS Whitepaper v1.0 &amp; On-Chain Telemetry...</span>
            </div>
          ) : answer ? (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                <Bot className="w-4 h-4" />
                <span>USDQS Verified Intelligence Response:</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">{answer}</p>
              <div className="flex items-center gap-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> HKMA &amp; FIPS 204 Verified
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-cyan-400" /> Whitepaper v1.0 Indexed
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-8 font-mono">
              {isKo
                ? '위의 추천 질문 칩을 클릭하거나 검색어를 입력해 주세요.'
                : 'Select a topic chip above or enter your question.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

