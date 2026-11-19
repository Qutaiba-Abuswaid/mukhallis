import React from 'react';
import { LAW_PROFILES, LawId } from '../utils/qiwaMath';

interface LawsTabProps {
  activeLaw: LawId;
  onSelectLaw: (lawId: LawId) => void;
}

export const LawsTab: React.FC<LawsTabProps> = ({ activeLaw, onSelectLaw }) => {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(LAW_PROFILES).map((law) => {
          const isSelected = law.id === activeLaw;
          return (
            <div
              key={law.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 ${
                isSelected ? 'border-brand-500 ring-2 ring-brand-100' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md border ${law.badgeClass}`}>
                    {law.shortName}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectLaw(law.id)}
                    className="text-xs font-bold text-brand-600 hover:underline cursor-pointer"
                  >
                    {isSelected ? '✓ القانون النشط حالياً' : 'اعتماد كقانون نشط'}
                  </button>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">{law.name}</h2>
                <p className="text-xs text-slate-500">{law.subtitle}</p>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {law.rules.map((r) => (
                    <div key={r.title} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="text-xs font-extrabold text-slate-800 mb-1">{r.title}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between tabular-nums">
                <span>
                  الإجازة السنوية: {law.annualLeaveUnder5} / {law.annualLeaveOver5} يوم
                </span>
                <span>العملة: {law.currencyCode}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-amber-950">
        <strong>ملاحظة مرجعية لفرق HR:</strong> يفصل التطبيق حسابات ومعايير الأردن، ونظام العمل السعودي
        للسعوديين مقابل الأجانب (مع خيار عقد محدد أو غير محدد المدة واحتساب يوم النهاية وفق قوى)، وفلسطين بشكل
        مستقل؛ يُنصح دائماً بمراجعة اللوائح الداخلية المعتمدة وعقود العمل الفردية في الحالات التعاقدية الخاصة.
      </div>
    </section>
  );
};
