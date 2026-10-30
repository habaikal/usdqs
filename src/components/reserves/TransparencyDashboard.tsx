import React, { useState } from 'react';
import { ReserveBreakdownChart } from './ReserveBreakdownChart';
import { ShieldCheck, ExternalLink, Lock, CheckCircle, Database, Eye, Building2, Clock } from 'lucide-react';
import { TRANSPARENCY_METRICS, HISTORICAL_ATTESTATIONS } from '../../data/reservesData';
import { useTranslation } from '../../context/LanguageContext';

interface TransparencyDashboardProps {
  onOpenAttestation: () => void;
  currentCap?: number;
}

export const TransparencyDashboard: React.FC<TransparencyDashboardProps> = ({
  onOpenAttestation,
  currentCap = TRANSPARENCY_METRICS.currentCap
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  return (
    <section id="reserves" className="py-24 relative overflow-hidden bg-[#070c18] border-y border-emerald-950/40">
      
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.reserves.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            {t.reserves.title}
          </h2>

          <p className="text-base text-slate-300 leading-relaxed font-sans">
            {t.reserves.description}
          </p>
        </div>

        {/* Real-Time Solvency Balance Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pb-8 border-b border-slate-800/80">
            
            {/* Total Reserves Held */}
            <div className="flex flex-col space-y-1">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> {t.reserves.verifiedReserves}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                ${(TRANSPARENCY_METRICS.totalReserves).toLocaleString('en-US')}
              </div>
              <span className="text-xs text-slate-400">
                {t.reserves.auditedBy}
              </span>
            </div>

            {/* Total USDQS in Circulation & Initial Cap */}
            <div className="flex flex-col space-y-1">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> {t.reserves.circulatingSupply}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-100 font-mono flex items-baseline gap-2">
                <span>${(TRANSPARENCY_METRICS.totalSupply).toLocaleString('en-US')}</span>
                <span className="text-xs text-slate-400 font-normal">/ ${(currentCap).toLocaleString('en-US')} Cap</span>
              </div>
              <span className="text-xs text-cyan-300 font-mono">
                {t.reserves.sumActive}
              </span>
            </div>

            {/* Net Excess Cushion */}
            <div className="flex flex-col space-y-1 lg:border-l lg:border-slate-800 lg:pl-8">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400" /> {t.reserves.excessBuffer}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
                +${(TRANSPARENCY_METRICS.netExcessReserves).toLocaleString('en-US')}
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold font-mono">
                <span>{t.reserves.coverageRatio}</span>
              </div>
            </div>

          </div>

          {/* Regulatory Trust Signals */}
          <div className="py-4 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>수탁 기관: {TRANSPARENCY_METRICS.custodianBank}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>상환 SLA: {TRANSPARENCY_METRICS.redemptionSLA}</span>
            </div>
          </div>

          {/* Action Tabs & Attestation Trigger */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'current'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.reserves.tabCurrent}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.reserves.tabHistory}
              </button>
            </div>

            <button
              onClick={onOpenAttestation}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/50 border border-emerald-500/40 hover:bg-emerald-900/40 hover:border-emerald-400 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>{t.reserves.inspectReport}</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          {/* Content Area Based on Tab */}
          <div className="mt-6">
            {activeTab === 'current' ? (
              <ReserveBreakdownChart />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4">Attestation Date</th>
                      <th className="py-3 px-4">Net Excess Cushion</th>
                      <th className="py-3 px-4">Opinion Status</th>
                      <th className="py-3 px-4 text-right">Verification ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {HISTORICAL_ATTESTATIONS.map((row) => (
                      <tr key={row.reportId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">{row.period}</td>
                        <td className="py-3 px-4 text-slate-300">{row.attestationDate}</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">{row.excessReserves}</td>
                        <td className="py-3 px-4 text-slate-300">{row.auditorReport}</td>
                        <td className="py-3 px-4 text-right text-cyan-400">{row.reportId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
