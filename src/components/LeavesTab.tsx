import React from 'react';
import {
  calculateDetailedLeave,
  Employee,
  formatDays,
  formatMoney,
  LAW_PROFILES,
  LawId,
  LeaveAccrualBasis,
  LeaveSimInput,
} from '../utils/qiwaMath';
import { LawBanner } from './LawBanner';

interface LeavesTabProps {
  leaveSim: LeaveSimInput;
  employees: Employee[];
  onChangeLaw: (lawId: LawId) => void;
  onUpdateField: <K extends keyof LeaveSimInput>(field: K, value: LeaveSimInput[K]) => void;
  onLoadEmployee: (empId: string) => void;
}

export const LeavesTab: React.FC<LeavesTabProps> = ({
  leaveSim,
  employees,
  onChangeLaw,
  onUpdateField,
  onLoadEmployee,
}) => {
  const res = calculateDetailedLeave(leaveSim);
  const asOfYear = Number(res.asOfDate.slice(0, 4)) || 2026;

  // Cross-law comparison for the exact same tenure, taken days, and carry-over
  const compareJordan = calculateDetailedLeave({ ...leaveSim, law: 'jordan', useLawDefaultEntitlement: true });
  const compareSaudi = calculateDetailedLeave({ ...leaveSim, law: 'saudi_citizen', useLawDefaultEntitlement: true });
  const comparePalestine = calculateDetailedLeave({ ...leaveSim, law: 'palestine', useLawDefaultEntitlement: true });

  const applyScenario = (yearsBack: number, midYear: boolean) => {
    const todayIso = res.asOfDate;
    const yr = Number(todayIso.slice(0, 4)) || 2026;
    const hireDate = midYear ? `${yr - yearsBack}-07-01` : `${yr - yearsBack}-01-01`;
    onUpdateField('hireDate', hireDate);
    onUpdateField('useLawDefaultEntitlement', true);
    onUpdateField('carriedOverDays', 0);
    onUpdateField('unpaidDaysThisYear', 0);
    onUpdateField('unauthorizedAbsenceDaysThisYear', 0);
    onUpdateField('approvedUnpaidLeaveDaysThisYear', 0);
  };

  return (
    <section>
      <LawBanner lawId={leaveSim.law} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Controls */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              حاسبة الإجازات الشهرية والتفصيلية
            </h2>
            <button
              type="button"
              onClick={() => window.print()}
              className="no-print px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer whitespace-nowrap"
            >
              🖨️ طباعة الكشف
            </button>
          </div>

          {/* Separate 4-Law Selector */}
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-2">
              اختيار القانون المنفصل لحساب الإجازة
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label="قانون حساب الإجازة">
              {Object.values(LAW_PROFILES).map((law) => {
                const selected = leaveSim.law === law.id;
                return (
                  <button
                    key={law.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChangeLaw(law.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center justify-between gap-2 cursor-pointer ${
                      selected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${selected ? 'bg-white' : law.dotClass}`}
                        aria-hidden="true"
                      />
                      <span>{law.shortName}</span>
                    </span>
                    <span className="text-[11px] opacity-85 tabular-nums">
                      {law.annualLeaveUnder5}/{law.annualLeaveOver5} يوم
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Employee Loader + Scenario Presets */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2.5">
            {employees.length > 0 && (
              <div>
                <label htmlFor="leave-load-employee" className="block text-[11px] font-bold text-slate-600 mb-1">
                  تحميل بيانات موظف مسجل:
                </label>
                <select
                  id="leave-load-employee"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) onLoadEmployee(e.target.value);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold"
                >
                  <option value="">-- اختر موظفاً لتعبئة تاريخ مباشرته ورصيده --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({LAW_PROFILES[emp.law].shortName} • مباشر {emp.hireDate})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                أمثلة تطبيقية سريعة لسنوات الخدمة:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyScenario(5, false)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-300 hover:bg-blue-50 hover:border-blue-300 text-slate-700 cursor-pointer"
                >
                  خدم 5 سنوات فأكثر
                </button>
                <button
                  type="button"
                  onClick={() => applyScenario(2, false)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-300 hover:bg-blue-50 hover:border-blue-300 text-slate-700 cursor-pointer"
                >
                  أقل من 5 سنوات
                </button>
                <button
                  type="button"
                  onClick={() => applyScenario(5, true)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-300 hover:bg-blue-50 hover:border-blue-300 text-slate-700 cursor-pointer"
                >
                  أتم 5 سنوات منتصف السنة (1 يوليو)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label htmlFor="leave-emp-name" className="block text-xs font-bold text-slate-700 mb-1">
                اسم الموظف
              </label>
              <input
                id="leave-emp-name"
                type="text"
                value={leaveSim.employeeName}
                onChange={(e) => onUpdateField('employeeName', e.target.value)}
                placeholder="مثال: سامي المنصور"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="leave-hire-date" className="block text-xs font-bold text-slate-700 mb-1">
                تاريخ المباشرة في العمل
              </label>
              <input
                id="leave-hire-date"
                type="date"
                value={res.hireDate}
                onChange={(e) => onUpdateField('hireDate', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="leave-asof-date" className="block text-xs font-bold text-slate-700 mb-1">
                تاريخ الحساب المرجعي (اليوم)
              </label>
              <input
                id="leave-asof-date"
                type="date"
                value={res.asOfDate}
                onChange={(e) => onUpdateField('asOfDate', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="leave-basis-select" className="block text-xs font-bold text-slate-700 mb-1">
                دورة احتساب الإجازة السنوية
              </label>
              <select
                id="leave-basis-select"
                value={res.accrualBasis}
                onChange={(e) => onUpdateField('accrualBasis', e.target.value as LeaveAccrualBasis)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="calendar_year">
                  السنة الميلادية (1 يناير إلى 31 ديسمبر {asOfYear})
                </option>
                <option value="anniversary_year">
                  سنة الخدمة التعاقدية (من ذكرى المباشرة السنوية إلى الذكرى التالية)
                </option>
              </select>
            </div>
          </div>

          {!res.isValidDates && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-800">
              التاريخ المرجعي يجب أن يكون مساوياً أو لاحقاً لتاريخ المباشرة.
            </div>
          )}

          {/* Entitlement rule box */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-2.5">
            <label className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-950 cursor-pointer">
              <input
                type="checkbox"
                checked={leaveSim.useLawDefaultEntitlement !== false}
                onChange={(e) => onUpdateField('useLawDefaultEntitlement', e.target.checked)}
                className="rounded border-blue-400 text-brand-600 focus:ring-brand-500"
              />
              <span>احتساب الاستحقاق تلقائياً حسب القانون ومدة الخدمة</span>
            </label>

            {leaveSim.useLawDefaultEntitlement === false ? (
              <div>
                <label htmlFor="leave-custom-annual" className="block text-xs font-bold text-slate-700 mb-1">
                  الرصيد السنوي التعاقدي المخصص (أيام)
                </label>
                <input
                  id="leave-custom-annual"
                  type="number"
                  min={0}
                  step="0.5"
                  value={leaveSim.annualEntitlement}
                  onChange={(e) => onUpdateField('annualEntitlement', Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm tabular-nums"
                />
              </div>
            ) : (
              <div className="text-xs text-blue-900 space-y-1">
                <div className="font-bold">{res.bracketLabel}</div>
                <div className="text-[11px] opacity-85">{res.legalBasis}</div>
              </div>
            )}

            {leaveSim.law === 'palestine' && leaveSim.useLawDefaultEntitlement !== false && (
              <label className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={Boolean(leaveSim.palestineHazardousWork)}
                  onChange={(e) => onUpdateField('palestineHazardousWork', e.target.checked)}
                  className="rounded border-amber-400 text-brand-600"
                />
                <span>أعمال خطرة / ضارة بالصحة (21 يوماً منذ السنة الأولى — م. 74/2)</span>
              </label>
            )}
          </div>

          {/* Usage & adjustments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
            <div>
              <label htmlFor="leave-taken-days" className="block text-xs font-bold text-slate-700 mb-1">
                الإجازات المأخوذة حتى اليوم (أيام)
              </label>
              <input
                id="leave-taken-days"
                type="number"
                min={0}
                step="0.5"
                value={leaveSim.takenDays}
                onChange={(e) => onUpdateField('takenDays', Math.max(0, Number(e.target.value) || 0))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="leave-carried-over" className="block text-xs font-bold text-slate-700 mb-1">
                رصيد مرحّل من سنوات سابقة (أيام)
              </label>
              <input
                id="leave-carried-over"
                type="number"
                min={0}
                step="0.5"
                value={leaveSim.carriedOverDays ?? 0}
                onChange={(e) =>
                  onUpdateField('carriedOverDays', Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="leave-unauth-absence" className="block text-xs font-bold text-slate-700 mb-1">
                    غياب بدون إذن خلال السنة (خصم 100%)
                  </label>
                  <input
                    id="leave-unauth-absence"
                    type="number"
                    min={0}
                    step="1"
                    value={
                      leaveSim.unauthorizedAbsenceDaysThisYear ??
                      (leaveSim.approvedUnpaidLeaveDaysThisYear === undefined
                        ? (leaveSim.unpaidDaysThisYear ?? 0)
                        : 0)
                    }
                    onChange={(e) =>
                      onUpdateField(
                        'unauthorizedAbsenceDaysThisYear',
                        Math.max(0, Math.floor(Number(e.target.value) || 0)),
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="leave-approved-unpaid" className="block text-xs font-bold text-slate-700 mb-1">
                    إجازة بدون أجر بموافقة الإدارة (أيام)
                  </label>
                  <input
                    id="leave-approved-unpaid"
                    type="number"
                    min={0}
                    step="1"
                    value={leaveSim.approvedUnpaidLeaveDaysThisYear ?? 0}
                    onChange={(e) =>
                      onUpdateField(
                        'approvedUnpaidLeaveDaysThisYear',
                        Math.max(0, Math.floor(Number(e.target.value) || 0)),
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {(leaveSim.law === 'saudi_citizen' || leaveSim.law === 'saudi_expat') ? (
                <div className="space-y-1 pt-1 border-t border-slate-200/80">
                  <label className="inline-flex items-center gap-2 text-[11px] font-bold text-blue-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={leaveSim.applyArt116Exempt20ForLeave !== false}
                      onChange={(e) =>
                        onUpdateField('applyArt116Exempt20ForLeave', e.target.checked)
                      }
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>تطبيق المادة (116) على الإجازة: إعفاء أول 20 يوماً لإجازة بموافقة وخصم ما زاد فقط</span>
                  </label>
                  {(res.unpaidBreakdown.approvedUnpaidLeaveDays > 0 ||
                    res.unpaidBreakdown.unauthorizedAbsenceDays > 0) && (
                    <div className="text-[11px] text-slate-600 tabular-nums">
                      معفى: <strong>{res.unpaidBreakdown.exemptApprovedDays} يوم</strong> • صافي الأيام
                      المخصومة: <strong>{res.unpaidBreakdown.totalEffectiveDeductedDays} يوم</strong>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  قاعدة إعفاء 20 يوماً تخص النظام السعودي (المادة 116) فقط؛ في {res.lawProfile.shortName}{' '}
                  يُخصم ما أدخلته أعلاه تناسبياً (بمعدل{' '}
                  {res.dailyRateCurrent.toFixed(4)} يوم إجازة لكل يوم).
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="leave-planned-days" className="block text-xs font-bold text-slate-700 mb-1">
                إجازات مخطط أخذها قبل نهاية السنة
              </label>
              <input
                id="leave-planned-days"
                type="number"
                min={0}
                step="0.5"
                value={leaveSim.plannedLeaveDays ?? 0}
                onChange={(e) =>
                  onUpdateField('plannedLeaveDays', Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="leave-daily-wage" className="block text-xs font-bold text-slate-700 mb-1">
                أجر اليوم الواحد ({res.lawProfile.currencyCode}) — اختياري لتقدير القيمة المالية للرصيد
              </label>
              <input
                id="leave-daily-wage"
                type="number"
                min={0}
                step="0.01"
                value={leaveSim.dailyWageForValuation ?? 0}
                onChange={(e) =>
                  onUpdateField('dailyWageForValuation', Math.max(0, Number(e.target.value) || 0))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Detailed Output & Schedule */}
        <div className="lg:col-span-7 space-y-5 print-card">
          {/* Tenure & 5-Year Milestone Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <div className="text-xs font-bold text-brand-600">{res.lawProfile.name}</div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  التقرير التفصيلي لرصيد إجازات: {leaveSim.employeeName || 'الموظف'}
                </h3>
              </div>
              <div className="text-left text-xs tabular-nums">
                <div className="text-slate-500">مدة الخدمة حتى {res.asOfDate}:</div>
                <div className="font-extrabold text-slate-900">
                  {res.tenure.years} سنة و {res.tenure.months} شهر و {res.tenure.days} يوم
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3">
                <div className="text-slate-500 font-semibold">فترة الدورة المحتسبة</div>
                <div className="font-bold text-slate-900 mt-0.5 tabular-nums" dir="ltr">
                  {res.cycleStartDate} → {res.cycleEndDate}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                  {res.activeDaysUpToAsOf} يوم عمل منقضٍ • {res.remainingCalendarDaysInCycle} يوم متبقٍ لنهاية الدورة
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3">
                <div className="text-slate-500 font-semibold">معدل الاستحقاق الحالي</div>
                <div className="font-bold text-brand-700 mt-0.5 tabular-nums">
                  {res.currentAnnualRate} يوم/سنة ({res.monthlyRateCurrent.toFixed(2)} يوم/شهر)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                  المعدل اليومي: {res.dailyRateCurrent.toFixed(4)} يوم/يوم
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3">
                <div className="text-slate-500 font-semibold">ترقية الـ 5 سنوات متصلة</div>
                {res.reachedFiveYearsAsOfDate ? (
                  <>
                    <div className="font-bold text-emerald-700 mt-0.5">
                      مكتمل ({res.lawProfile.annualLeaveOver5} يوم/سنة)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                      أتم 5 سنوات بتاريخ {res.fiveYearMilestoneDate}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-amber-800 mt-0.5 tabular-nums">
                      متبقٍ {res.daysUntilFiveYearUpgrade} يوماً
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                      تاريخ الترقية لـ {res.lawProfile.annualLeaveOver5} يوم: {res.fiveYearMilestoneDate}
                    </div>
                  </>
                )}
              </div>
            </div>

            {res.isSplitYear && (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-950 space-y-1">
                <div className="font-extrabold">
                  تنبيه السنة الانتقالية: الموظف أتم 5 سنوات خلال هذه الدورة بتاريخ {res.fiveYearMilestoneDate}
                </div>
                <p className="tabular-nums">
                  • الفترة الأولى ({res.splitBeforeDays} يوماً بمعدل {res.splitBeforeRate} يوم/سنة) ={' '}
                  <strong>{res.splitBeforeAccrual.toFixed(2)} يوم</strong>
                  {'  '}|{'  '}• الفترة الثانية ({res.splitAfterDays} يوماً بمعدل {res.splitAfterRate} يوم/سنة) ={' '}
                  <strong>{res.splitAfterAccrual.toFixed(2)} يوم</strong>
                  {'  '}← الإجمالي النسبي للسنة = <strong>{res.fullCycleNetAccrual.toFixed(2)} يوم</strong>.
                </p>
              </div>
            )}
          </div>

          {/* 4 Main KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs font-bold text-slate-500">المكتسب حتى {res.asOfDate}</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                {formatDays(res.totalAvailableUpToAsOf)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
                من السنة: {res.accruedFromCycleUpToAsOf.toFixed(2)}
                {res.carriedOverDays > 0 ? ` + مرحّل ${res.carriedOverDays.toFixed(2)}` : ''}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs font-bold text-slate-500">المتبقي الفعلي حتى اليوم</div>
              <div
                data-testid="leave-remaining-today"
                className={`text-2xl font-extrabold mt-1 tabular-nums ${
                  res.remainingAsOfDate >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {formatDays(res.remainingAsOfDate)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
                {res.remainingAsOfDate < 0
                  ? `سحب مسبق بـ ${Math.abs(res.remainingAsOfDate).toFixed(2)} يوم`
                  : `بعد خصم ${res.takenDays.toFixed(1)} يوم مأخوذ`}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs font-bold text-slate-500">سيكتسب لنهاية الدورة</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
                + {formatDays(res.futureAccrualToCycleEnd)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
                عن {res.remainingCalendarDaysInCycle} يوماً متبقياً حتى {res.cycleEndDate}
              </div>
            </div>

            <div className="rounded-2xl p-4 shadow-sm bg-brand-600 text-white">
              <div className="text-xs font-semibold opacity-90">الصافي المتبقي لنهاية السنة</div>
              <div
                data-testid="leave-remaining-yearend"
                className="text-2xl font-extrabold mt-1 tabular-nums"
              >
                {formatDays(
                  res.plannedLeaveDays > 0
                    ? res.projectedRemainingAfterPlanned
                    : res.projectedRemainingEndOfCycle,
                )}
              </div>
              <div className="text-[11px] opacity-90 mt-1 tabular-nums">
                {res.plannedLeaveDays > 0
                  ? `قبل المخطط: ${res.projectedRemainingEndOfCycle.toFixed(2)} يوم`
                  : `من إجمالي ${res.projectedTotalPoolEndOfCycle.toFixed(2)} يوم`}
              </div>
            </div>
          </div>

          {/* Step-by-Step Balance Equation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-2.5 text-xs sm:text-sm">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              ملخص المعادلة الحسابية التفصيلية حتى {res.cycleEndDate}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 tabular-nums">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">استحقاق الدورة المنقضي حتى {res.asOfDate}:</span>
                <span className="font-bold text-slate-900">{res.accruedFromCycleUpToAsOf.toFixed(2)} يوم</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">الاستحقاق المتبقي حتى {res.cycleEndDate}:</span>
                <span className="font-bold text-slate-900">+ {res.futureAccrualToCycleEnd.toFixed(2)} يوم</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">الرصيد المرحّل من سنوات سابقة:</span>
                <span className="font-bold text-slate-900">+ {res.carriedOverDays.toFixed(2)} يوم</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                <span>
                  أثر الغياب/بدون أجر ({res.unpaidBreakdown.totalEffectiveDeductedDays} يوم فعلي
                  {res.unpaidBreakdown.exemptApprovedDays > 0
                    ? `، معفى ${res.unpaidBreakdown.exemptApprovedDays}`
                    : ''}
                  ):
                </span>
                <span className="font-bold">- {res.unpaidDaysDeductedLeave.toFixed(2)} يوم</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                <span>الإجازات المأخوذة حتى اليوم:</span>
                <span className="font-bold">- {res.takenDays.toFixed(2)} يوم</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-amber-800">
                <span>الإجازات المخططة قبل نهاية السنة:</span>
                <span className="font-bold">- {res.plannedLeaveDays.toFixed(2)} يوم</span>
              </div>
            </div>

            {Number(leaveSim.dailyWageForValuation) > 0 && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex flex-wrap justify-between gap-2 text-xs text-emerald-950 tabular-nums">
                <span>
                  القيمة المالية للرصيد حتى اليوم:{' '}
                  <strong>{formatMoney(res.valueAsOfDate, leaveSim.law)}</strong>
                </span>
                <span>
                  القيمة المالية للرصيد المتوقع نهاية السنة:{' '}
                  <strong>{formatMoney(res.valueEndOfCycle, leaveSim.law)}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Cross-Law Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              مقارنة الرصيد لنفس الموظف ({res.tenure.years} سنة خدمة) عبر القوانين الثلاثة
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-2 px-3 font-bold">القانون</th>
                    <th className="py-2 px-3 font-bold">الاستحقاق السنوي</th>
                    <th className="py-2 px-3 font-bold">المكتسب حتى اليوم</th>
                    <th className="py-2 px-3 font-bold">المتبقي حتى اليوم</th>
                    <th className="py-2 px-3 font-bold">المتبقي لنهاية السنة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums">
                  {[
                    { id: 'jordan', label: 'الأردني (م. 61)', data: compareJordan },
                    { id: 'saudi_citizen', label: 'السعودي (م. 109)', data: compareSaudi },
                    { id: 'palestine', label: 'الفلسطيني (م. 74)', data: comparePalestine },
                  ].map((item) => {
                    const isCurrent =
                      item.id === leaveSim.law ||
                      (item.id === 'saudi_citizen' && leaveSim.law === 'saudi_expat');
                    return (
                      <tr key={item.id} className={isCurrent ? 'bg-blue-50/70 font-bold' : ''}>
                        <td className="py-2 px-3">{item.label}</td>
                        <td className="py-2 px-3">{item.data.fullCycleNetAccrual.toFixed(2)} يوم</td>
                        <td className="py-2 px-3">{item.data.totalAvailableUpToAsOf.toFixed(2)} يوم</td>
                        <td
                          className={`py-2 px-3 ${
                            item.data.remainingAsOfDate >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {item.data.remainingAsOfDate.toFixed(2)} يوم
                        </td>
                        <td
                          className={`py-2 px-3 ${
                            item.data.projectedRemainingEndOfCycle >= 0 ? 'text-brand-700' : 'text-rose-700'
                          }`}
                        >
                          {item.data.projectedRemainingEndOfCycle.toFixed(2)} يوم
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 12-Month Detailed Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 mb-3">
              جدول الاستحقاق والرصيد التراكمي شهراً بشهر ({res.cycleStartDate} – {res.cycleEndDate})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-2.5 px-2.5 font-bold">الشهر</th>
                    <th className="py-2.5 px-2.5 font-bold">الشريحة</th>
                    <th className="py-2.5 px-2.5 font-bold">استحقاق الشهر</th>
                    <th className="py-2.5 px-2.5 font-bold">التراكمي من الدورة</th>
                    <th className="py-2.5 px-2.5 font-bold">المأخوذ</th>
                    <th className="py-2.5 px-2.5 font-bold">الصافي نهاية الشهر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums">
                  {res.schedule.map((row) => (
                    <tr
                      key={row.index}
                      className={
                        row.status === 'current'
                          ? 'bg-brand-50/80 font-bold'
                          : row.status === 'past'
                            ? 'text-slate-700'
                            : 'text-slate-500 bg-slate-50/40'
                      }
                    >
                      <td className="py-2 px-2.5 whitespace-nowrap">
                        {row.label}
                        {row.status === 'current' && (
                          <span className="mr-1.5 text-[10px] px-1.5 py-0.5 rounded bg-brand-600 text-white">
                            الحالي
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2.5 whitespace-nowrap text-[11px]">{row.rateLabel}</td>
                      <td className="py-2 px-2.5">{row.monthAccrual.toFixed(2)}</td>
                      <td className="py-2 px-2.5 font-semibold">{row.cumulativeYearAccrued.toFixed(2)}</td>
                      <td className="py-2 px-2.5 text-slate-500">{row.takenApplied.toFixed(2)}</td>
                      <td
                        className={`py-2 px-2.5 font-bold ${
                          row.netRemainingEndOfMonth >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {row.netRemainingEndOfMonth.toFixed(2)} يوم
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
