import React from 'react';
import {
  calculateSettlement,
  formatDays,
  formatMoney,
  getRecommendedNoticeDaysForSaudi,
  LAW_PROFILES,
  LawId,
  SaudiCalculationMethod,
  SaudiContractType,
  SettlementInput,
} from '../utils/qiwaMath';
import { LawBanner } from './LawBanner';

interface SettlementTabProps {
  settlement: SettlementInput;
  onUpdateField: <K extends keyof SettlementInput>(field: K, value: SettlementInput[K]) => void;
  onReset: () => void;
}

export const SettlementTab: React.FC<SettlementTabProps> = ({
  settlement: s,
  onUpdateField,
  onReset,
}) => {
  const calc = calculateSettlement(s);
  const law = LAW_PROFILES[s.law];
  const isSaudiLaw = s.law === 'saudi_citizen' || s.law === 'saudi_expat';
  const recommendedNoticeDays = isSaudiLaw
    ? getRecommendedNoticeDaysForSaudi(s.saudiContractType, s.terminationType)
    : law.noticeDays;

  const normalizedTermination =
    isSaudiLaw && s.terminationType === 'resignation'
      ? 'qiwa_resignation'
      : isSaudiLaw && s.terminationType === 'termination_without_cause'
        ? 'qiwa_art75'
        : isSaudiLaw && s.terminationType === 'gross_misconduct'
          ? 'qiwa_art80'
          : s.terminationType;

  return (
    <section>
      <LawBanner lawId={s.law} contractType={isSaudiLaw ? s.saudiContractType : null} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5 no-print">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900">بيانات حساب المخالصة المالية</h2>
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer whitespace-nowrap shrink-0"
            >
              إعادة ضبط القيم
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="st-emp-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم الموظف
              </label>
              <input
                id="st-emp-name"
                type="text"
                value={s.employeeName}
                onChange={(e) => onUpdateField('employeeName', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="مثال: سامي المنصور"
              />
            </div>

            <div>
              <label htmlFor="st-law" className="block text-xs font-bold text-slate-700 mb-1.5">
                القانون المطبق على المخالصة
              </label>
              <select
                id="st-law"
                value={s.law}
                onChange={(e) => onUpdateField('law', e.target.value as LawId)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="saudi_citizen">نظام العمل السعودي — للسعوديين</option>
                <option value="saudi_expat">نظام العمل السعودي — للأجانب</option>
                <option value="jordan">القانون الأردني</option>
                <option value="palestine">قانون العمل الفلسطيني</option>
              </select>
            </div>

            {isSaudiLaw && (
              <div className="sm:col-span-2 bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-3">
                <div>
                  <span className="block text-xs font-extrabold text-blue-950 mb-2">
                    نوع عقد العمل في النظام السعودي (قوى)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      aria-pressed={s.saudiContractType === 'fixed_term'}
                      onClick={() => onUpdateField('saudiContractType', 'fixed_term' as SaudiContractType)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center justify-between cursor-pointer ${
                        s.saudiContractType === 'fixed_term'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>عقد محدد المدة</span>
                      <span className="text-[11px] opacity-85">م. 74/2 • م. 85</span>
                    </button>

                    <button
                      type="button"
                      aria-pressed={s.saudiContractType === 'indefinite'}
                      onClick={() => onUpdateField('saudiContractType', 'indefinite' as SaudiContractType)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center justify-between cursor-pointer ${
                        s.saudiContractType === 'indefinite'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>عقد غير محدد المدة</span>
                      <span className="text-[11px] opacity-85">م. 75 • إشعار</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="st-qiwa-method" className="block text-xs font-bold text-blue-950 mb-1.5">
                    طريقة احتساب كسور السنة في نظام العمل (قوى)
                  </label>
                  <select
                    id="st-qiwa-method"
                    value={s.saudiCalculationMethod || 'qiwa_standard'}
                    onChange={(e) =>
                      onUpdateField('saudiCalculationMethod', e.target.value as SaudiCalculationMethod)
                    }
                    className="w-full rounded-xl border border-blue-200 px-3 py-2 text-xs sm:text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="qiwa_standard">
                      معيار قوى الرسمي (سنوات + أشهر ÷ 12 + أيام ÷ 365، مع شمول يوم النهاية)
                    </option>
                    <option value="days_365">إجمالي الأيام الفعلية ÷ 365 (متضمنة السنوات الكبيسة)</option>
                    <option value="commercial_360">السنة التجارية (سنوات + أشهر ÷ 12 + أيام ÷ 360)</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="st-hire-date" className="block text-xs font-bold text-slate-700 mb-1.5">
                تاريخ المباشرة
              </label>
              <input
                id="st-hire-date"
                type="date"
                value={s.hireDate}
                onChange={(e) => onUpdateField('hireDate', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="st-end-date" className="block text-xs font-bold text-slate-700 mb-1.5">
                تاريخ انتهاء الخدمة (شامل اليوم)
              </label>
              <input
                id="st-end-date"
                type="date"
                value={s.endDate}
                onChange={(e) => onUpdateField('endDate', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {isSaudiLaw && s.saudiContractType === 'fixed_term' && (
              <div className="sm:col-span-2">
                <label htmlFor="st-contract-end-date" className="block text-xs font-bold text-slate-700 mb-1.5">
                  تاريخ نهاية العقد المتفق عليه (للمادة 77)
                </label>
                <input
                  id="st-contract-end-date"
                  type="date"
                  value={s.contractEndDate || '2027-01-01'}
                  onChange={(e) => onUpdateField('contractEndDate', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}

            <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="st-unauth-absence" className="block text-xs font-bold text-slate-700 mb-1">
                    أيام غياب بدون إذن (تُخصم 100%)
                  </label>
                  <input
                    id="st-unauth-absence"
                    type="number"
                    min={0}
                    step={1}
                    value={
                      s.unauthorizedAbsenceDays ??
                      (s.approvedUnpaidLeaveDays === undefined ? (s.unpaidDays ?? 0) : 0)
                    }
                    onChange={(e) =>
                      onUpdateField(
                        'unauthorizedAbsenceDays',
                        Math.max(0, Math.floor(Number(e.target.value) || 0)),
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="st-approved-unpaid" className="block text-xs font-bold text-slate-700 mb-1">
                    إجازة بدون أجر بموافقة الإدارة (أيام)
                  </label>
                  <input
                    id="st-approved-unpaid"
                    type="number"
                    min={0}
                    step={1}
                    value={s.approvedUnpaidLeaveDays ?? 0}
                    onChange={(e) =>
                      onUpdateField(
                        'approvedUnpaidLeaveDays',
                        Math.max(0, Math.floor(Number(e.target.value) || 0)),
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {isSaudiLaw ? (
                <div className="space-y-1.5 pt-1 border-t border-slate-200/80">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-blue-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.applyArt116Exempt20 !== false}
                      onChange={(e) => onUpdateField('applyArt116Exempt20', e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>تطبيق المادة (116) سعودي: إعفاء أول 20 يوماً لإجازة بدون أجر بموافقة وخصم ما زاد فقط</span>
                  </label>
                  {(calc.unpaidBreakdown.approvedUnpaidLeaveDays > 0 ||
                    calc.unpaidBreakdown.unauthorizedAbsenceDays > 0) && (
                    <div className="text-[11px] text-slate-700 tabular-nums">
                      معفى بالمادة (116): <strong>{calc.unpaidBreakdown.exemptApprovedDays} يوم</strong> • مخصوم
                      من الإجازة بدون أجر: <strong>{calc.unpaidBreakdown.effectiveApprovedDeductedDays} يوم</strong>{' '}
                      + غياب بدون إذن: <strong>{calc.unpaidBreakdown.unauthorizedAbsenceDays} يوم</strong> = إجمالي
                      المخصوم: <strong className="text-amber-800">{calc.unpaidBreakdown.totalEffectiveDeductedDays} يوم</strong>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  ملاحظة: قاعدة إعفاء أول 20 يوماً تخص المادة (116) من نظام العمل السعودي فقط؛ في{' '}
                  {law.shortName} تُخصم أيام التوقف بدون أجر المدخلة ما لم ينص العقد على احتسابها.
                </p>
              )}
            </div>
          </div>

          {!calc.tenure.isValid && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-bold text-rose-800">
              تاريخ انتهاء الخدمة يجب أن يكون مساوياً أو لاحقاً لتاريخ المباشرة.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label htmlFor="st-termination-type" className="block text-xs font-bold text-slate-700 mb-1.5">
                {isSaudiLaw ? 'سبب إنهاء العقد (وفق منصة قوى الحكومية)' : 'سبب / طبيعة إنهاء الخدمة'}
              </label>
              <select
                id="st-termination-type"
                value={normalizedTermination}
                onChange={(e) => onUpdateField('terminationType', e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {isSaudiLaw ? (
                  <optgroup label="أسباب انتهاء العقد في منصة قوى (Qiwa)">
                    <option value="qiwa_art74_1">اتفاق الطرفين على إنهاء العقد (المادة 74/1)</option>
                    <option value="qiwa_art74_2">انتهاء مدة العقد المحددة (المادة 74/2)</option>
                    <option value="qiwa_resignation">استقالة العامل (المادتان 74/3 و 85)</option>
                    <option value="qiwa_art75">إنهاء العقد غير محدد المدة بإرادة صاحب العمل (المادة 75)</option>
                    <option value="qiwa_art77_employer">فسخ العقد من صاحب العمل لسبب غير مشروع (المادة 77)</option>
                    <option value="qiwa_art77_employee">فسخ العقد من العامل لسبب غير مشروع (المادة 77)</option>
                    <option value="qiwa_art80">فسخ العقد من صاحب العمل لإحدى حالات المادة (80)</option>
                    <option value="qiwa_art81">ترك العامل العمل لإحدى حالات المادة (81)</option>
                    <option value="qiwa_probation">إنهاء العقد خلال فترة التجربة (المادة 53)</option>
                    <option value="qiwa_art74_4">بلوغ العامل سن التقاعد (المادة 74/4)</option>
                    <option value="qiwa_art74_5">القوة القاهرة (المادة 74/5)</option>
                    <option value="qiwa_art74_6">إغلاق المنشأة نهائياً (المادة 74/6)</option>
                    <option value="qiwa_art74_7">إنهاء النشاط الذي يعمل فيه العامل (المادة 74/7)</option>
                    <option value="qiwa_art87">إنهاء العاملة عقدها بسبب الزواج أو الوضع (المادة 87)</option>
                    <option value="qiwa_death_disability">وفاة العامل أو عجزه الكلي (المادة 79)</option>
                  </optgroup>
                ) : (
                  <>
                    <option value="termination_without_cause">إنهاء خدمة من صاحب العمل / انتهاء عقد</option>
                    <option value="resignation">استقالة الموظف</option>
                    <option value="gross_misconduct">فصل تأديبي / مخالفة جسيمة (بدون مكافأة)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="st-basic-salary" className="block text-xs font-bold text-slate-700 mb-1.5">
                الراتب الأساسي الشهري ({law.currencyCode})
              </label>
              <input
                id="st-basic-salary"
                type="number"
                min={0}
                step="0.01"
                value={s.basicSalary}
                onChange={(e) => onUpdateField('basicSalary', Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="st-fixed-allowances" className="block text-xs font-bold text-slate-700 mb-1.5">
                العلاوات الثابتة / السكن / النقل الثابت ({law.currencyCode})
              </label>
              <input
                id="st-fixed-allowances"
                type="number"
                min={0}
                step="0.01"
                value={s.fixedAllowances}
                onChange={(e) => onUpdateField('fixedAllowances', Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="st-excluded-allowances" className="block text-xs font-bold text-slate-700 mb-1.5">
                بدلات مستثناة (تنقل فعلي / هاتف)
              </label>
              <input
                id="st-excluded-allowances"
                type="number"
                min={0}
                step="0.01"
                value={s.excludedAllowances}
                onChange={(e) => onUpdateField('excludedAllowances', Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="st-commissions" className="block text-xs font-bold text-slate-700 mb-1.5">
                إجمالي العمولات خلال آخر 12 شهراً (المادة 86)
              </label>
              <input
                id="st-commissions"
                type="number"
                min={0}
                step="0.01"
                value={s.twelveMonthCommissionsTotal}
                onChange={(e) => onUpdateField('twelveMonthCommissionsTotal', Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-500 mt-1 tabular-nums">
                متوسط العمولة الشهري المحتسب:{' '}
                <strong className="text-slate-800">{formatMoney(calc.avgMonthlyCommission, s.law)}</strong>
                {calc.tenure.totalMonths > 0 && calc.tenure.totalMonths < 12 && (
                  <span> (موزع على {calc.tenure.totalMonths.toFixed(2)} شهر فعلي)</span>
                )}
              </p>
            </div>

            <div>
              <label htmlFor="st-remaining-leave" className="block text-xs font-bold text-slate-700 mb-1.5">
                رصيد الإجازات السنوية المتبقية (أيام)
              </label>
              <input
                id="st-remaining-leave"
                type="number"
                min={0}
                step="0.5"
                value={s.remainingLeaveDays}
                onChange={(e) => onUpdateField('remainingLeaveDays', Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="st-unpaid-salary" className="block text-xs font-bold text-slate-700 mb-1.5">
                رواتب / مستحقات غير مدفوعة
              </label>
              <input
                id="st-unpaid-salary"
                type="number"
                min={0}
                step="0.01"
                value={s.unpaidSalary}
                onChange={(e) => onUpdateField('unpaidSalary', Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="st-loan-balance" className="block text-xs font-bold text-slate-700 mb-1.5">
                رصيد سلف / قروض مستحقة للخصم
              </label>
              <input
                id="st-loan-balance"
                type="number"
                min={0}
                step="0.01"
                value={s.loanBalance}
                onChange={(e) => onUpdateField('loanBalance', Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-500 mt-1 tabular-nums">
                الحد الأقصى للخصم الشهري من الراتب (10%):{' '}
                <strong className="text-slate-800">{formatMoney(calc.recommendedMonthlyLoanCap, s.law)}</strong>
              </p>
            </div>

            {isSaudiLaw && normalizedTermination === 'qiwa_art77_employer' && (
              <div className="sm:col-span-2 rounded-xl bg-amber-50/70 border border-amber-200 p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-amber-950">
                    تعويض فسخ العقد غير المشروع — المادة (77)
                  </span>
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.art77UseAutoCalculation}
                      onChange={(e) => onUpdateField('art77UseAutoCalculation', e.target.checked)}
                      className="rounded border-amber-400 text-brand-600 focus:ring-brand-500"
                    />
                    <span>احتساب تلقائي وفق المادة (77)</span>
                  </label>
                </div>

                {s.art77UseAutoCalculation && calc.art77AutoInfo ? (
                  <div className="text-xs text-amber-900 space-y-1">
                    <div className="font-bold tabular-nums">
                      التعويض المحتسب تلقائياً: {formatMoney(calc.art77AutoInfo.amount, s.law)}
                    </div>
                    <div className="text-[11px] opacity-90">{calc.art77AutoInfo.remainingDescription}</div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="st-art77-amount" className="block text-xs font-bold text-slate-700 mb-1">
                      مبلغ تعويض المادة (77) المخصص ({law.currencyCode})
                    </label>
                    <input
                      id="st-art77-amount"
                      type="number"
                      min={0}
                      step="0.01"
                      value={s.art77CompensationAmount}
                      onChange={(e) => onUpdateField('art77CompensationAmount', Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.applyNoticePay}
                    onChange={(e) => onUpdateField('applyNoticePay', e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>احتساب بدل فترة الإشعار</span>
                </label>

                <div className="flex items-center gap-2">
                  <label htmlFor="st-notice-days" className="text-xs font-bold text-slate-600">
                    مدة الإشعار (أيام):
                  </label>
                  <input
                    id="st-notice-days"
                    type="number"
                    min={0}
                    max={180}
                    value={s.noticeDays}
                    onChange={(e) =>
                      onUpdateField('noticeDays', Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-bold tabular-nums"
                  />
                </div>
              </div>

              {isSaudiLaw && recommendedNoticeDays > 0 && s.noticeDays !== recommendedNoticeDays && (
                <button
                  type="button"
                  onClick={() => onUpdateField('noticeDays', recommendedNoticeDays)}
                  className="text-xs font-bold text-brand-600 hover:underline cursor-pointer self-start sm:self-center"
                >
                  تطبيق المهلة النظامية ({recommendedNoticeDays} يوم)
                </button>
              )}
            </div>

            {s.law === 'jordan' && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.socialSecurityCovered}
                    onChange={(e) => onUpdateField('socialSecurityCovered', e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>مشمول بالضمان الاجتماعي الأردني</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.customContractGratuity}
                    onChange={(e) => onUpdateField('customContractGratuity', e.target.checked)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>نص عقدي/داخلي بمكافأة إضافية</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Output Summary Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 print-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold text-brand-600">{law.name}</span>
              <h3 className="text-lg font-extrabold text-slate-900">ملخص المخالصة النهائية</h3>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="no-print px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer whitespace-nowrap"
            >
              🖨️ طباعة
            </button>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">الموظف:</span>
              <span className="font-bold text-slate-900">{s.employeeName || 'غير محدد'}</span>
            </div>
            {isSaudiLaw && (
              <div className="flex justify-between gap-2">
                <span className="text-slate-600">نوع العقد في قوى:</span>
                <span className="font-bold text-slate-900">
                  {s.saudiContractType === 'fixed_term' ? 'عقد محدد المدة' : 'عقد غير محدد المدة'}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">مدة الخدمة الفعلية:</span>
              <span className="font-bold text-slate-900 tabular-nums text-left">
                {calc.tenure.years} سنة و {calc.tenure.months} شهر و {calc.tenure.days} يوم (
                {calc.tenure.totalYearsExact.toFixed(4)} سنة)
              </span>
            </div>
            {(calc.tenure.unpaidDays > 0 || calc.unpaidBreakdown.exemptApprovedDays > 0) && (
              <div className="flex justify-between gap-2 text-amber-800 text-xs">
                <span>
                  أيام مستبعدة بدون أجر
                  {calc.unpaidBreakdown.exemptApprovedDays > 0
                    ? ` (معفى ${calc.unpaidBreakdown.exemptApprovedDays} يوم م.116)`
                    : ''}
                  :
                </span>
                <span className="font-bold tabular-nums">{calc.tenure.unpaidDays} يوم</span>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">الأجر الشهري المعتمد للتسوية:</span>
              <span className="font-bold text-brand-700 tabular-nums">
                {formatMoney(calc.settlementBaseWage, s.law)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-slate-600">أجر اليوم الواحد (÷ 30):</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {formatMoney(calc.dailyWage, s.law)}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                مكافأة نهاية الخدمة ({calc.entitlementRatioLabel}):
              </span>
              <span className="font-bold text-slate-900 tabular-nums">
                {formatMoney(calc.gratuity, s.law)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                بدل فترة الإشعار ({s.applyNoticePay ? `${s.noticeDays} يوم` : 'غير مفعّل'}):
              </span>
              <span className="font-bold text-slate-900 tabular-nums">
                {formatMoney(calc.noticeAmount, s.law)}
              </span>
            </div>
            {calc.compensationAmount > 0 && (
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-600">تعويض فسخ العقد (المادة 77):</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {formatMoney(calc.compensationAmount, s.law)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">
                بدل الإجازات المتبقية ({formatDays(s.remainingLeaveDays)}):
              </span>
              <span className="font-bold text-slate-900 tabular-nums">
                {formatMoney(calc.leavePayout, s.law)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">مستحقات / رواتب غير مدفوعة:</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {formatMoney(calc.unpaidSal, s.law)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 text-rose-700">
              <span>خصم السلف / القروض:</span>
              <span className="font-bold tabular-nums">- {formatMoney(calc.loanBal, s.law)}</span>
            </div>
          </div>

          <div
            className={`rounded-2xl p-4 text-white ${
              calc.netSettlement >= 0 ? 'bg-brand-600' : 'bg-rose-600'
            }`}
          >
            <div className="text-xs font-semibold opacity-90">صافي المخالصة المالية المستحقة</div>
            <div className="text-2xl font-extrabold mt-1 tabular-nums" data-testid="net-settlement-value">
              {formatMoney(calc.netSettlement, s.law)}
            </div>
          </div>

          {isSaudiLaw && calc.qiwaComparisons && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5 text-xs">
              <div className="font-extrabold text-slate-900">التفصيل الرياضي لمكافأة قوى (المادتان 84 و85)</div>

              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between gap-2">
                  <span>الشريحة الأولى (أول 5 سنوات × نصف راتب):</span>
                  <span className="font-mono-num font-bold text-slate-900" dir="ltr">
                    {calc.tier1Years.toFixed(4)} × 0.5 = {formatMoney(calc.tier1Amount, s.law)}
                  </span>
                </div>
                {calc.tier2Years > 0 && (
                  <div className="flex justify-between gap-2">
                    <span>الشريحة الثانية (ما زاد عن 5 سنوات × راتب كامل):</span>
                    <span className="font-mono-num font-bold text-slate-900" dir="ltr">
                      {calc.tier2Years.toFixed(4)} × 1.0 = {formatMoney(calc.tier2Amount, s.law)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-2 pt-1 border-t border-slate-200/80">
                  <span>نسبة الاستحقاق المطبقة:</span>
                  <span className="font-bold text-brand-700">{calc.entitlementRatioLabel}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 mb-1.5">
                  مقارنة طرق احتساب الكسور لنفس المدة ({calc.tenure.netCalendarDays} يوم شامل يوم النهاية):
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center tabular-nums">
                  <div
                    className={`rounded-lg p-2 border ${
                      (s.saudiCalculationMethod || 'qiwa_standard') === 'qiwa_standard'
                        ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-[10px]">معيار قوى</div>
                    <div className="mt-0.5">{formatMoney(calc.qiwaComparisons.qiwaStandard, s.law)}</div>
                  </div>
                  <div
                    className={`rounded-lg p-2 border ${
                      s.saudiCalculationMethod === 'days_365'
                        ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-[10px]">أيام ÷ 365</div>
                    <div className="mt-0.5">{formatMoney(calc.qiwaComparisons.days365, s.law)}</div>
                  </div>
                  <div
                    className={`rounded-lg p-2 border ${
                      s.saudiCalculationMethod === 'commercial_360'
                        ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-[10px]">360 يوم</div>
                    <div className="mt-0.5">{formatMoney(calc.qiwaComparisons.commercial360, s.law)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 leading-relaxed">
            <strong>تنويه قانوني ({law.shortName}):</strong> {calc.lawNote}
          </div>
        </div>
      </div>
    </section>
  );
};
