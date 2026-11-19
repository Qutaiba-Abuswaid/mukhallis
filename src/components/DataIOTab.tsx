import React, { useState } from 'react';
import { Employee, LeaveSimInput, parseImportedData, SettlementInput } from '../utils/qiwaMath';

interface DataIOTabProps {
  employees: Employee[];
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImportParsed: (parsed: {
    employees: Employee[];
    settlement: Partial<SettlementInput> | null;
    leaveSim: Partial<LeaveSimInput> | null;
  }, sourceLabel: string) => void;
  onImportError: (msg: string) => void;
}

const SAMPLE_CSV = [
  'name,role,law,basicSalary,fixedAllowances,annualLeaveEntitlement,takenLeaveDays,note',
  'رنا منصور,أخصائية موارد بشرية,jordan,600,100,14,4,متابعة تسجيل الضمان وتحديث ملف الموظف',
  'فيصل القحطاني,مدير مبيعات,saudi_citizen,9000,2000,21,7,مراجعة عمولات الربع الحالي وتصفية الإجازة',
].join('\n');

export const DataIOTab: React.FC<DataIOTabProps> = ({
  onExportJSON,
  onExportCSV,
  onImportParsed,
  onImportError,
}) => {
  const [importDraftText, setImportDraftText] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        setImportDraftText(text);
        const parsed = parseImportedData(text);
        onImportParsed(parsed, 'من الملف');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'صيغة غير صالحة';
        onImportError(`تعذر قراءة الملف: ${message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyPasted = () => {
    try {
      const parsed = parseImportedData(importDraftText);
      onImportParsed(parsed, 'بالاستيراد المباشر');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'صيغة غير صالحة';
      onImportError(`خطأ في صيغة البيانات: ${message}`);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
          تصدير وتحميل البيانات
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          احفظ نسخة احتياطية كاملة من بيانات الموظفين والملاحظات والحسابات بصيغة JSON، أو صدّر قائمة
          الموظفين بصيغة CSV لفتحها في Excel.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onExportJSON}
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap"
          >
            ⬇️ تصدير نسخة JSON كاملة
          </button>
          <button
            type="button"
            onClick={onExportCSV}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap"
          >
            📊 تصدير الموظفين CSV
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label htmlFor="io-file-upload" className="block text-xs font-bold text-slate-700 mb-2">
            رفع ملف JSON أو CSV من جهازك
          </label>
          <input
            id="io-file-upload"
            type="file"
            accept=".json,.csv,text/csv,application/json"
            onChange={handleFileUpload}
            className="block w-full text-xs text-slate-600 file:ml-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
          />
        </div>
      </div>

      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold text-slate-900">استيراد ولصق بيانات (JSON / CSV)</h2>
          <button
            type="button"
            onClick={() => setImportDraftText(SAMPLE_CSV)}
            className="text-xs font-bold text-brand-600 hover:underline cursor-pointer whitespace-nowrap"
          >
            إدراج نموذج CSV جاهز
          </button>
        </div>

        <label htmlFor="io-paste-textarea" className="sr-only">
          حقل لصق بيانات JSON أو CSV
        </label>
        <textarea
          id="io-paste-textarea"
          rows={8}
          value={importDraftText}
          onChange={(e) => setImportDraftText(e.target.value)}
          placeholder={`الصق هنا بيانات JSON أو CSV مثل:\nname,role,law,basicSalary,fixedAllowances,annualLeaveEntitlement,takenLeaveDays,note\nرنا منصور,أخصائية موارد بشرية,jordan,600,100,14,4,مراجعة عقود العمل`}
          className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleApplyPasted}
            className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            ✓ اعتماد وتحميل البيانات إلى المنصة
          </button>
        </div>
      </div>
    </section>
  );
};
