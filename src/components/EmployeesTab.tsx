import React, { useState } from 'react';
import {
  calculateTenure,
  Employee,
  formatMoney,
  LAW_PROFILES,
  LawId,
} from '../utils/qiwaMath';
import { LawBanner } from './LawBanner';

export interface NewEmployeeDraft {
  name: string;
  role: string;
  law: LawId;
  department: string;
  hireDate: string;
  basicSalary: number;
  fixedAllowances: number;
  annualLeaveEntitlement: number;
  takenLeaveDays: number;
  note: string;
  reminderTime: string;
}

interface EmployeesTabProps {
  activeLaw: LawId;
  employees: Employee[];
  onAddEmployee: (draft: NewEmployeeDraft) => void;
  onUpdateNote: (empId: string, note: string) => void;
  onUpdateReminderTime: (empId: string, time: string) => void;
  onToggleReminder: (empId: string, active: boolean) => void;
  onDeleteEmployee: (empId: string) => void;
  onLoadIntoSettlement: (empId: string) => void;
  onPreviewMorningAlert: () => void;
}

export const EmployeesTab: React.FC<EmployeesTabProps> = ({
  activeLaw,
  employees,
  onAddEmployee,
  onUpdateNote,
  onUpdateReminderTime,
  onToggleReminder,
  onDeleteEmployee,
  onLoadIntoSettlement,
  onPreviewMorningAlert,
}) => {
  const [form, setForm] = useState<NewEmployeeDraft>({
    name: '',
    role: '',
    law: activeLaw,
    department: 'عام',
    hireDate: '2023-01-01',
    basicSalary: 600,
    fixedAllowances: 100,
    annualLeaveEntitlement: 21,
    takenLeaveDays: 0,
    note: '',
    reminderTime: '08:30',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAddEmployee(form);
    setForm((prev) => ({
      ...prev,
      name: '',
      role: '',
      note: '',
    }));
  };

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <section className="space-y-6">
      <LawBanner lawId={activeLaw} />

      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              إضافة موظف وملاحظة تنبيه الساعة 08:30 صباحاً
            </h2>
            <p className="text-xs text-slate-500">
              سيصلك تنبيه يومي تلقائياً الساعة 08:30 صباحاً بالملاحظات النشطة للموظفين
            </p>
          </div>
          <button
            type="button"
            onClick={onPreviewMorningAlert}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition cursor-pointer self-start whitespace-nowrap"
          >
            محاكاة تنبيه 8:30 صباحاً الآن
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="new-emp-name" className="block text-xs font-bold text-slate-700 mb-1">
              اسم الموظف *
            </label>
            <input
              id="new-emp-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="الاسم الكامل"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="new-emp-role" className="block text-xs font-bold text-slate-700 mb-1">
              المسمى الوظيفي
            </label>
            <input
              id="new-emp-role"
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="مثال: محاسب / HR"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="new-emp-law" className="block text-xs font-bold text-slate-700 mb-1">
              القانون التابع له
            </label>
            <select
              id="new-emp-law"
              value={form.law}
              onChange={(e) => setForm({ ...form, law: e.target.value as LawId })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold bg-white"
            >
              <option value="saudi_citizen">نظام العمل السعودي — للسعوديين</option>
              <option value="saudi_expat">نظام العمل السعودي — للأجانب</option>
              <option value="jordan">القانون الأردني</option>
              <option value="palestine">قانون العمل الفلسطيني</option>
            </select>
          </div>

          <div>
            <label htmlFor="new-emp-hire" className="block text-xs font-bold text-slate-700 mb-1">
              تاريخ المباشرة
            </label>
            <input
              id="new-emp-hire"
              type="date"
              value={form.hireDate}
              onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="new-emp-basic" className="block text-xs font-bold text-slate-700 mb-1">
              الراتب الأساسي
            </label>
            <input
              id="new-emp-basic"
              type="number"
              min={0}
              step="0.01"
              value={form.basicSalary}
              onChange={(e) => setForm({ ...form, basicSalary: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="new-emp-allowances" className="block text-xs font-bold text-slate-700 mb-1">
              العلاوات الثابتة
            </label>
            <input
              id="new-emp-allowances"
              type="number"
              min={0}
              step="0.01"
              value={form.fixedAllowances}
              onChange={(e) => setForm({ ...form, fixedAllowances: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="new-emp-leave" className="block text-xs font-bold text-slate-700 mb-1">
              الرصيد السنوي للإجازات
            </label>
            <input
              id="new-emp-leave"
              type="number"
              min={0}
              step="0.5"
              value={form.annualLeaveEntitlement}
              onChange={(e) => setForm({ ...form, annualLeaveEntitlement: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="new-emp-time" className="block text-xs font-bold text-slate-700 mb-1">
              وقت التذكير اليومي
            </label>
            <input
              id="new-emp-time"
              type="time"
              value={form.reminderTime}
              onChange={(e) => setForm({ ...form, reminderTime: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="new-emp-note" className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظة المتابعة اليومية (تظهر الساعة 8:30 صباحاً)
            </label>
            <input
              id="new-emp-note"
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="اكتب ملاحظة للموظف ليصلك تنبيه بها صباح اليوم التالي الساعة 8:30..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition cursor-pointer"
            >
              + إضافة الموظف
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            سجل الموظفين والملاحظات اليومية ({employees.length})
          </h3>
          <span className="text-xs text-slate-500">
            يمكنك تعديل الملاحظة أو تحميل أي موظف مباشرة إلى حاسبة المخالصة
          </span>
        </div>

        <div className="space-y-4">
          {employees.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              لا يوجد موظفون مسجلون حالياً. أضف موظفاً أو استورد ملفاً من قسم البيانات.
            </div>
          ) : (
            employees.map((emp) => {
              const empLaw = LAW_PROFILES[emp.law] || LAW_PROFILES.jordan;
              const tenure = calculateTenure(emp.hireDate, todayIso);
              const leaveLeft =
                (Number(emp.annualLeaveEntitlement) || 0) - (Number(emp.takenLeaveDays) || 0);

              return (
                <div
                  key={emp.id}
                  className="rounded-2xl border border-slate-200 p-4 hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-extrabold text-slate-900">{emp.name}</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${empLaw.badgeClass}`}>
                          {empLaw.shortName}
                        </span>
                        <span className="text-xs text-slate-500">{emp.role || 'موظف'}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 tabular-nums">
                        الأساسي: <strong>{formatMoney(emp.basicSalary, emp.law)}</strong> • العلاوات الثابتة:{' '}
                        <strong>{formatMoney(emp.fixedAllowances, emp.law)}</strong> • الخدمة:{' '}
                        <strong>
                          {tenure.years} سنة و {tenure.months} شهر
                        </strong>{' '}
                        • متبقي الإجازة: <strong>{leaveLeft} يوم</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onLoadIntoSettlement(emp.id)}
                        aria-label={`حساب مخالصة للموظف ${emp.name}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 transition cursor-pointer whitespace-nowrap"
                      >
                        حساب مخالصة
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEmployee(emp.id)}
                        aria-label={`حذف الموظف ${emp.name}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer whitespace-nowrap"
                      >
                        حذف
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center pt-2 border-t border-slate-100">
                    <div className="md:col-span-7">
                      <label htmlFor={`emp-note-${emp.id}`} className="sr-only">
                        ملاحظة الموظف {emp.name}
                      </label>
                      <input
                        id={`emp-note-${emp.id}`}
                        type="text"
                        value={emp.note || ''}
                        onChange={(e) => onUpdateNote(emp.id, e.target.value)}
                        placeholder="اكتب ملاحظة لهذا الموظف للتذكير الساعة 8:30 صباحاً..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor={`emp-time-${emp.id}`} className="sr-only">
                        وقت التذكير للموظف {emp.name}
                      </label>
                      <input
                        id={`emp-time-${emp.id}`}
                        type="time"
                        value={emp.reminderTime || '08:30'}
                        onChange={(e) => onUpdateReminderTime(emp.id, e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs tabular-nums"
                      />
                    </div>
                    <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-2">
                      <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emp.reminderActive}
                          onChange={(e) => onToggleReminder(emp.id, e.target.checked)}
                          className="rounded border-slate-300 text-brand-600"
                        />
                        <span>تذكير يومي (08:30)</span>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
