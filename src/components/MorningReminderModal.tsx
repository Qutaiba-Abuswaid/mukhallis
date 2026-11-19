import React from 'react';
import { Employee, LAW_PROFILES } from '../utils/qiwaMath';

interface MorningReminderModalProps {
  open: boolean;
  notes: Employee[];
  onClose: () => void;
}

export const MorningReminderModal: React.FC<MorningReminderModalProps> = ({
  open,
  notes,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="morning-alert-title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg font-bold shrink-0"
              aria-hidden="true"
            >
              ⏰
            </span>
            <div>
              <h3 id="morning-alert-title" className="text-base sm:text-lg font-extrabold text-slate-900">
                إيجاز الملاحظات الصباحية — 08:30 صباحاً
              </h3>
              <p className="text-xs text-slate-500">تذكير يومي بملاحظات الموظفين المسجلة في المنصة</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة التنبيه الصباحي"
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2.5">
          {notes.length === 0 ? (
            <div className="text-sm text-slate-500 text-center py-6">
              لا توجد ملاحظات تذكير نشطة حالياً. أضف ملاحظة لأي موظف من تبويب الموظفين.
            </div>
          ) : (
            notes.map((emp) => {
              const empLaw = LAW_PROFILES[emp.law] || LAW_PROFILES.jordan;
              return (
                <div
                  key={emp.id}
                  className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-extrabold text-slate-900">{emp.name}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-md border ${empLaw.badgeClass}`}>
                      {empLaw.shortName} • {emp.reminderTime || '08:30'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{emp.note}</p>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold cursor-pointer"
          >
            تم الاطلاع
          </button>
        </div>
      </div>
    </div>
  );
};
