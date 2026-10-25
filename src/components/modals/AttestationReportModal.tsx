import React from 'react';
import { X, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { TRANSPARENCY_METRICS, RESERVE_BREAKDOWN } from '../../data/reservesData';

interface AttestationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttestationReportModal: React.FC<AttestationReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#090e1c] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <span>Independent Accountant's Attestation Report</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Clean
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Conducted by BDO Global & Cryptographic Proof-of-Reserves Oracle
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Report Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          
          {/* Executive Statement */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Unqualified Independent Practitioner's Opinion</span>
            </div>
            <p className="text-slate-300">
              "We have examined the management assertion of USDQS Protocol Foundation as of October 24, 2026, that the total consolidated assets held in the USDQS Reserves strictly exceed the consolidated liabilities (token supply) issued on all connected blockchains."
            </p>
          </div>

          {/* Key Balance Sheet Summary */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Consolidated Reserves Statement (USD)
            </h4>
            
            <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800 bg-slate-950/60">
              <div className="p-3.5 flex justify-between items-center bg-slate-900/60 font-bold">
                <span className="text-white">Total Reserves Collateral Held (A):</span>
                <span className="text-emerald-400 text-sm">
                  ${TRANSPARENCY_METRICS.totalReserves.toLocaleString('en-US')}
                </span>
              </div>
              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-300">Total USDQS Tokens in Circulation (B):</span>
                <span className="text-white">
                  ${TRANSPARENCY_METRICS.totalSupply.toLocaleString('en-US')}
                </span>
              </div>
              <div className="p-3.5 flex justify-between items-center bg-emerald-950/20 text-emerald-400 font-bold">
                <span>Net Excess Reserves Cushion (A - B):</span>
                <span className="text-sm">
                  +${TRANSPARENCY_METRICS.netExcessReserves.toLocaleString('en-US')}
                </span>
              </div>
              <div className="p-3.5 flex justify-between items-center text-cyan-300">
                <span>Effective Reserve Solvency Ratio:</span>
                <span className="font-bold">{TRANSPARENCY_METRICS.reserveRatio}%</span>
              </div>
            </div>
          </div>

          {/* Breakdown Assets */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider">
              Schedule of Liquid Assets
            </h4>
            <div className="space-y-2">
              {RESERVE_BREAKDOWN.map((asset) => (
                <div key={asset.category} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex justify-between items-center font-mono">
                  <div>
                    <span className="text-white font-semibold block">{asset.name}</span>
                    <span className="text-[11px] text-slate-500">{asset.description}</span>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-emerald-400 font-bold">${(asset.amountUSD / 1e9).toFixed(2)}B</span>
                    <span className="text-[11px] text-slate-400 block">{asset.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Verification Stamp */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div>
              <span className="block text-slate-300 font-semibold">Report Reference: ATT-2026-Q3-0941</span>
              <span>Signed at Geneva, Switzerland / New York, USA</span>
            </div>
            <div className="text-emerald-400 font-bold border border-emerald-500/40 px-3 py-1.5 rounded-lg bg-emerald-950/40">
              CRYPTOGRAPHICALLY SEALED
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Updated continuously via Chainlink & Pyth Oracles
          </span>

          <button
            onClick={() => {
              alert('Downloading Attestation Statement PDF (Simulation)...');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certified PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
