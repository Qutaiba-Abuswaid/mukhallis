import React from 'react';
import { LAW_PROFILES, LawId, SaudiContractType } from '../utils/qiwaMath';

interface LawBannerProps {
  lawId: LawId;
  contractType?: SaudiContractType | null;
}

export const LawBanner: React.FC<LawBannerProps> = ({ lawId, contractType = null }) => {
  const law = LAW_PROFILES[lawId];
  const isSaudi = lawId === 'saudi_citizen' || lawId === 'saudi_expat';

  return (
    <div
      className={`rounded-2xl border p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${law.badgeClass}`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold tracking-wide opacity-80">إطار العمل القانوني المنفصل</span>
          {isSaudi && contractType && (
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
              {contractType === 'fixed_term' ? 'عقد محدد المدة' : 'عقد غير محدد المدة'}
            </span>
          )}
        </div>
        <div className="text-base sm:text-lg font-extrabold mt-0.5">
          {law.name} — {law.subtitle}
        </div>
      </div>
      <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/80 text-slate-800 border border-black/10 self-start sm:self-center shrink-0">
        العملة المرجعية: {law.currency}
      </div>
    </div>
  );
};
