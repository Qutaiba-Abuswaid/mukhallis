export type LawId = 'jordan' | 'saudi_citizen' | 'saudi_expat' | 'palestine';
export type SaudiContractType = 'fixed_term' | 'indefinite';
export type SaudiCalculationMethod = 'qiwa_standard' | 'days_365' | 'commercial_360';

export interface LawRule {
  title: string;
  text: string;
}

export interface LawProfile {
  id: LawId;
  name: string;
  shortName: string;
  subtitle: string;
  currency: string;
  currencyCode: string;
  badgeClass: string;
  dotClass: string;
  annualLeaveUnder5: number;
  annualLeaveOver5: number;
  noticeDays: number;
  ssEmployeeRate?: number;
  ssEmployerRate?: number;
  loanMonthlyCapRate: number;
  rules: LawRule[];
}

export const LAW_PROFILES: Record<LawId, LawProfile> = {
  jordan: {
    id: 'jordan',
    name: 'القانون الأردني',
    shortName: 'الأردن',
    subtitle: 'قانون العمل الأردني رقم (8) لسنة 1996 وتعديلاته + قانون الضمان الاجتماعي',
    currency: 'دينار أردني (JOD)',
    currencyCode: 'JOD',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-600',
    annualLeaveUnder5: 14,
    annualLeaveOver5: 21,
    noticeDays: 30,
    ssEmployeeRate: 0.075,
    ssEmployerRate: 0.1425,
    loanMonthlyCapRate: 0.1,
    rules: [
      {
        title: 'مكافأة نهاية الخدمة والضمان الاجتماعي',
        text: 'إذا كان الموظف مشمولاً بالضمان الاجتماعي (7.5% موظف و14.25% منشأة على الأجر الخاضع)، فإن اشتراكات الضمان تقوم مقام مكافأة نهاية الخدمة ما لم ينص العقد أو النظام الداخلي على مكافأة إضافية. أما غير المشمول بالضمان فيستحق أجر شهر عن كل سنة خدمة.',
      },
      {
        title: 'الإجازات السنوية والعمولات والخصومات (المادة 61)',
        text: 'وفق المادة (61) من قانون العمل الأردني: الإجازة السنوية 14 يوماً لمن خدم أقل من 5 سنوات متصلة، وتُزاد إلى 21 يوماً بعد 5 سنوات متصلة لدى صاحب العمل نفسه، ولا تُحتسب العطل الرسمية والأسبوعية من الإجازة إلا باتفاق. وتُدخل العمولات الثابتة/المتغيرة ضمن الأجر الخاضع (بمتوسط 12 شهراً)، وسقف خصم السلفة شهرياً 10%.',
      },
      {
        title: 'فترة الإشعار وإنهاء الخدمة',
        text: 'إشعار خطي قبل شهر واحد (30 يوماً) لإنهاء العقد غير محدد المدة، أو دفع بدل الإشعار. يُستثنى من بدل المكافأة/الإشعار حالات الفصل المشروع المنصوص عليها في المادة (28).',
      },
    ],
  },
  saudi_citizen: {
    id: 'saudi_citizen',
    name: 'نظام العمل السعودي — للسعوديين',
    shortName: 'السعودية (سعودي)',
    subtitle: 'نظام العمل السعودي + منصة قوى (عقود محددة وغير محددة المدة) + التأمينات الاجتماعية',
    currency: 'ريال سعودي (SAR)',
    currencyCode: 'SAR',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-600',
    annualLeaveUnder5: 21,
    annualLeaveOver5: 30,
    noticeDays: 60,
    loanMonthlyCapRate: 0.1,
    rules: [
      {
        title: 'احتساب مكافأة نهاية الخدمة وفق قوى (المادتان 84 و85)',
        text: 'يستحق العامل نصف شهر عن كل سنة من السنوات الخمس الأولى، وشهر كامل عن كل سنة تلي ذلك على أساس الأجر الأخير ومتوسط العمولات خلال السنة الأخيرة (المادة 86)، مع احتساب يوم النهاية ضمن مدة الخدمة.',
      },
      {
        title: 'أثر الاستقالة ومدة الخدمة (المادة 85)',
        text: 'في حال الاستقالة: أقل من سنتين لا يستحق شيئاً؛ من سنتين إلى أقل من 5 سنوات يستحق ثلث المكافأة (1/3)؛ من 5 إلى أقل من 10 سنوات يستحق ثلثي المكافأة (2/3)؛ ومن 10 سنوات فأكثر يستحق المكافأة كاملة.',
      },
      {
        title: 'الإجازات السنوية (المادة 109) والإشعار والمادة (77)',
        text: 'وفق المادة (109) من نظام العمل السعودي: الإجازة السنوية 21 يوماً بأجر كامل وتُزاد إلى 30 يوماً بعد إتمام 5 سنوات متصلة في خدمة صاحب العمل. في العقود غير محددة المدة يُراعى الإشعار (60 يوماً)، وفي المادة (77) يُحتسب 15 يوماً عن كل سنة لغير المحدد أو أجر المدة المتبقية للمحدد بحد أدنى شهرين.',
      },
    ],
  },
  saudi_expat: {
    id: 'saudi_expat',
    name: 'نظام العمل السعودي — للأجانب',
    shortName: 'السعودية (أجنبي)',
    subtitle: 'نظام العمل السعودي لغير السعوديين + منصة قوى (عقود محددة وغير محددة المدة)',
    currency: 'ريال سعودي (SAR)',
    currencyCode: 'SAR',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    dotClass: 'bg-sky-600',
    annualLeaveUnder5: 21,
    annualLeaveOver5: 30,
    noticeDays: 60,
    loanMonthlyCapRate: 0.1,
    rules: [
      {
        title: 'مكافأة نهاية الخدمة للعامل غير السعودي',
        text: 'يستحق العامل نصف شهر عن كل سنة من السنوات الخمس الأولى، وشهر كامل عن كل سنة تلي ذلك وفق الأجر الأخير ومتوسط العمولات في السنة الأخيرة، مع احتساب شمولية يوم نهاية العمل وفق منصة قوى.',
      },
      {
        title: 'العقود محددة وغير محددة المدة وتعويض المادة (77)',
        text: 'يُبرم العقد محدد المدة أو غير محدد المدة وفق الاتفاق والنظام، ويُراعى أثر انتهاء المدة أو الإشعار أو فسخ العقد غير المشروع (المادة 77) بحد أدنى راتب شهرين.',
      },
      {
        title: 'الإجازات السنوية (المادة 109) والخصومات',
        text: 'وفق المادة (109): الإجازة السنوية 21 يوماً لمن أمضى أقل من 5 سنوات، و30 يوماً عند إتمام 5 سنوات متصلة لدى صاحب العمل، ويُحسم بحد أقصى 10% شهرياً لاسترداد القروض أو العهد وفق الضوابط النظامية.',
      },
    ],
  },
  palestine: {
    id: 'palestine',
    name: 'قانون العمل الفلسطيني',
    shortName: 'فلسطين',
    subtitle: 'قانون العمل الفلسطيني رقم (7) لسنة 2000 وتعديلاته',
    currency: 'دينار أردني (JOD)',
    currencyCode: 'JOD',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-600',
    annualLeaveUnder5: 14,
    annualLeaveOver5: 21,
    noticeDays: 30,
    loanMonthlyCapRate: 0.1,
    rules: [
      {
        title: 'مكافأة نهاية الخدمة (المادة 45)',
        text: 'يستحق العامل الذي قضى سنة فأكثر في العمل مكافأة نهاية خدمة بواقع أجر شهر عن كل سنة قضاها في العمل، ولا تحسب له مكافأة عن كسور السنة في السنة الأولى، وتُحتسب على أساس الأجر الأخير (شاملاً العلاوات الثابتة ومتوسط العمولات).',
      },
      {
        title: 'الإجازات السنوية (المادة 74)',
        text: 'وفق المادة (74) من قانون العمل الفلسطيني: يستحق العامل إجازة سنوية بأجر كامل مدتها أسبوعان (14 يوماً) عن كل سنة عمل لمن خدم أقل من 5 سنوات، وتصبح ثلاثة أسابيع (21 يوماً) لمن أمضى 5 سنوات متصلة في المنشأة أو للعاملين في الأعمال الخطرة والضارة بالصحة.',
      },
      {
        title: 'الإشعار وإنهاء الخدمة',
        text: 'يُلزم الطرف الراغب في إنهاء عقد العمل غير محدد المدة بإشعار الطرف الآخر خطياً قبل شهر على الأقل، أو دفع بدل الإشعار، مع مراعاة الحالات الاستثنائية للفصل دون مكافأة وفق القانون.',
      },
    ],
  },
};

export const VALID_LAW_IDS: LawId[] = ['jordan', 'saudi_citizen', 'saudi_expat', 'palestine'];

export function normalizeLawId(rawLaw: string | undefined | null): LawId {
  if (rawLaw === 'saudi') return 'saudi_citizen';
  if (rawLaw && (VALID_LAW_IDS as string[]).includes(rawLaw)) {
    return rawLaw as LawId;
  }
  return 'jordan';
}

export interface Employee {
  id: string;
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
  reminderActive: boolean;
  lastNotifiedDate: string;
}

export interface SettlementInput {
  employeeName: string;
  law: LawId;
  saudiContractType: SaudiContractType;
  saudiCalculationMethod: SaudiCalculationMethod;
  hireDate: string;
  endDate: string;
  contractEndDate: string;
  unpaidDays: number;
  unauthorizedAbsenceDays?: number;
  approvedUnpaidLeaveDays?: number;
  applyArt116Exempt20?: boolean;
  terminationType: string;
  basicSalary: number;
  fixedAllowances: number;
  excludedAllowances: number;
  twelveMonthCommissionsTotal: number;
  remainingLeaveDays: number;
  unpaidSalary: number;
  loanBalance: number;
  noticeDays: number;
  applyNoticePay: boolean;
  art77UseAutoCalculation: boolean;
  art77CompensationAmount: number;
  socialSecurityCovered: boolean;
  customContractGratuity: boolean;
}

export type LeaveAccrualBasis = 'calendar_year' | 'anniversary_year';

export interface LeaveSimInput {
  law: LawId;
  employeeName: string;
  annualEntitlement: number;
  takenDays: number;
  currentMonth: number;
  currentDayOfMonth: number;
  useLawDefaultEntitlement: boolean;
  hireDate?: string;
  asOfDate?: string;
  carriedOverDays?: number;
  unpaidDaysThisYear?: number;
  unauthorizedAbsenceDaysThisYear?: number;
  approvedUnpaidLeaveDaysThisYear?: number;
  applyArt116Exempt20ForLeave?: boolean;
  plannedLeaveDays?: number;
  palestineHazardousWork?: boolean;
  accrualBasis?: LeaveAccrualBasis;
  dailyWageForValuation?: number;
}

export function getDefaultLeaveSim(lawId: LawId | string = 'saudi_citizen'): LeaveSimInput {
  const normalized = normalizeLawId(lawId);
  const profile = LAW_PROFILES[normalized];
  const todayIso = new Date().toISOString().slice(0, 10);
  const yearNum = Number(todayIso.slice(0, 4)) || 2026;
  const monthNum = Number(todayIso.slice(5, 7)) || 11;
  const dayNum = Number(todayIso.slice(8, 10)) || 16;
  const fiveYearsAgo = `${yearNum - 5}-${todayIso.slice(5, 10)}`;

  return {
    law: normalized,
    employeeName: 'سامي المنصور',
    annualEntitlement: profile.annualLeaveOver5,
    takenDays: 10,
    currentMonth: monthNum,
    currentDayOfMonth: dayNum,
    useLawDefaultEntitlement: true,
    hireDate: fiveYearsAgo,
    asOfDate: todayIso,
    carriedOverDays: 0,
    unpaidDaysThisYear: 0,
    unauthorizedAbsenceDaysThisYear: 0,
    approvedUnpaidLeaveDaysThisYear: 0,
    applyArt116Exempt20ForLeave: true,
    plannedLeaveDays: 0,
    palestineHazardousWork: false,
    accrualBasis: 'calendar_year',
    dailyWageForValuation: 0,
  };
}

export const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'أحمد العتيبي',
    role: 'أخصائي مبيعات أول',
    law: 'saudi_citizen',
    department: 'المبيعات',
    hireDate: '2021-03-01',
    basicSalary: 6500,
    fixedAllowances: 1500,
    annualLeaveEntitlement: 30,
    takenLeaveDays: 12,
    note: 'متابعة تسوية مستحقات الإجازة وتأكيد عمولات الربع الرابع مع المالية.',
    reminderTime: '08:30',
    reminderActive: true,
    lastNotifiedDate: '',
  },
  {
    id: 'emp-2',
    name: 'ليلى الخطيب',
    role: 'منسقة عمليات',
    law: 'jordan',
    department: 'العمليات',
    hireDate: '2022-07-15',
    basicSalary: 520,
    fixedAllowances: 130,
    annualLeaveEntitlement: 14,
    takenLeaveDays: 6,
    note: 'مراجعة اشتراك الضمان الاجتماعي وتجديد عقد العمل السنوي.',
    reminderTime: '08:30',
    reminderActive: true,
    lastNotifiedDate: '',
  },
  {
    id: 'emp-3',
    name: 'طارق أبو سمرة',
    role: 'محاسب مشاريع',
    law: 'palestine',
    department: 'المحاسبة',
    hireDate: '2020-01-10',
    basicSalary: 4200,
    fixedAllowances: 600,
    annualLeaveEntitlement: 21,
    takenLeaveDays: 9,
    note: 'تجهيز شهادة الخبرة ومراجعة رصيد الإجازات السنوية المستحقة.',
    reminderTime: '08:30',
    reminderActive: true,
    lastNotifiedDate: '',
  },
];

export function getDefaultSettlement(lawId: LawId | string = 'saudi_citizen'): SettlementInput {
  const normalized = normalizeLawId(lawId);
  const isSaudi = normalized === 'saudi_citizen' || normalized === 'saudi_expat';
  return {
    employeeName: 'سامي المنصور',
    law: normalized,
    saudiContractType: 'fixed_term',
    saudiCalculationMethod: 'qiwa_standard',
    hireDate: '2022-01-01',
    endDate: '2026-11-15',
    contractEndDate: '2027-01-01',
    unpaidDays: 0,
    unauthorizedAbsenceDays: 0,
    approvedUnpaidLeaveDays: 0,
    applyArt116Exempt20: true,
    terminationType: isSaudi ? 'qiwa_art74_2' : 'termination_without_cause',
    basicSalary: isSaudi ? 6000 : 500,
    fixedAllowances: isSaudi ? 1500 : 100,
    excludedAllowances: isSaudi ? 500 : 60,
    twelveMonthCommissionsTotal: isSaudi ? 12000 : 1800,
    remainingLeaveDays: 8,
    unpaidSalary: isSaudi ? 1500 : 250,
    loanBalance: isSaudi ? 500 : 120,
    noticeDays: isSaudi ? 60 : 30,
    applyNoticePay: false,
    art77UseAutoCalculation: true,
    art77CompensationAmount: 0,
    socialSecurityCovered: true,
    customContractGratuity: false,
  };
}

export interface UnpaidDeductionBreakdown {
  unauthorizedAbsenceDays: number;
  approvedUnpaidLeaveDays: number;
  exemptApprovedDays: number;
  effectiveApprovedDeductedDays: number;
  totalEffectiveDeductedDays: number;
  art116Applied: boolean;
}

/**
 * Separates unauthorized absence (100% deducted) from approved unpaid leave.
 * Under Saudi Labor Law Article 116, the first 20 days of approved unpaid leave
 * do not suspend the contract or reduce service duration (unless agreed otherwise).
 */
export function computeEffectiveUnpaidDays(params: {
  law: LawId | string;
  unauthorizedAbsenceDays?: number;
  approvedUnpaidLeaveDays?: number;
  legacyUnpaidDays?: number;
  applyArt116Exempt20?: boolean;
}): UnpaidDeductionBreakdown {
  const normalized = normalizeLawId(params.law);
  const isSaudi = normalized === 'saudi_citizen' || normalized === 'saudi_expat';
  const hasSplitInputs =
    params.unauthorizedAbsenceDays !== undefined || params.approvedUnpaidLeaveDays !== undefined;

  const rawUnauth = hasSplitInputs
    ? Number(params.unauthorizedAbsenceDays ?? 0)
    : Number(params.legacyUnpaidDays ?? 0);
  const rawApproved = Number(params.approvedUnpaidLeaveDays ?? 0);

  const unauthorizedAbsenceDays = Math.max(0, Math.floor(Number.isFinite(rawUnauth) ? rawUnauth : 0));
  const approvedUnpaidLeaveDays = Math.max(0, Math.floor(Number.isFinite(rawApproved) ? rawApproved : 0));
  const art116Applied = isSaudi && params.applyArt116Exempt20 !== false;
  const exemptApprovedDays = art116Applied ? Math.min(20, approvedUnpaidLeaveDays) : 0;
  const effectiveApprovedDeductedDays = approvedUnpaidLeaveDays - exemptApprovedDays;
  const totalEffectiveDeductedDays = unauthorizedAbsenceDays + effectiveApprovedDeductedDays;

  return {
    unauthorizedAbsenceDays,
    approvedUnpaidLeaveDays,
    exemptApprovedDays,
    effectiveApprovedDeductedDays,
    totalEffectiveDeductedDays,
    art116Applied,
  };
}

export function roundHalala(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function parseIsoDateStrict(iso: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso || '').trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() !== month - 1 ||
    dt.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function toEpochDays(y: number, m: number, d: number): number {
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

function fromEpochDays(epochDays: number): { year: number; month: number; day: number } {
  const dt = new Date(epochDays * 86400000);
  return {
    year: dt.getUTCFullYear(),
    month: dt.getUTCMonth() + 1,
    day: dt.getUTCDate(),
  };
}

export interface TenureResult {
  isValid: boolean;
  years: number;
  months: number;
  days: number;
  totalYearsExact: number;
  totalYears365: number;
  totalYears360: number;
  totalMonths: number;
  totalDays: number;
  netCalendarDays: number;
  unpaidDays: number;
}

/**
 * Pure UTC inclusive calendar tenure decomposition matching Qiwa / HRSD:
 * - End date is inclusive (+1 day). E.g. 2020-01-01 to 2024-12-31 = exact 5y 0m 0d.
 * - Unpaid absence days shift effective start forward cleanly.
 * - Multi-month borrow loop handles Feb 28/29 and 31-day boundaries accurately.
 */
export function calculateTenure(
  hireDateStr: string,
  endDateStr: string,
  unpaidDaysInput = 0,
): TenureResult {
  const startParsed = parseIsoDateStrict(hireDateStr);
  const endParsed = parseIsoDateStrict(endDateStr);
  const unpaidDays = Math.max(0, Math.floor(Number.isFinite(Number(unpaidDaysInput)) ? Number(unpaidDaysInput) : 0));

  if (!startParsed || !endParsed) {
    return {
      isValid: false,
      years: 0,
      months: 0,
      days: 0,
      totalYearsExact: 0,
      totalYears365: 0,
      totalYears360: 0,
      totalMonths: 0,
      totalDays: 0,
      netCalendarDays: 0,
      unpaidDays,
    };
  }

  const startEpoch = toEpochDays(startParsed.year, startParsed.month, startParsed.day);
  const endEpoch = toEpochDays(endParsed.year, endParsed.month, endParsed.day);

  if (endEpoch < startEpoch) {
    return {
      isValid: false,
      years: 0,
      months: 0,
      days: 0,
      totalYearsExact: 0,
      totalYears365: 0,
      totalYears360: 0,
      totalMonths: 0,
      totalDays: 0,
      netCalendarDays: 0,
      unpaidDays,
    };
  }

  // Inclusive end date (+1 day)
  const endExclusiveEpoch = endEpoch + 1;
  const totalDays = endExclusiveEpoch - startEpoch;
  const effectiveStartEpoch = startEpoch + unpaidDays;
  const netCalendarDays = Math.max(0, endExclusiveEpoch - effectiveStartEpoch);

  if (netCalendarDays === 0) {
    return {
      isValid: true,
      years: 0,
      months: 0,
      days: 0,
      totalYearsExact: 0,
      totalYears365: 0,
      totalYears360: 0,
      totalMonths: 0,
      totalDays,
      netCalendarDays: 0,
      unpaidDays,
    };
  }

  const s = fromEpochDays(effectiveStartEpoch);
  const e = fromEpochDays(endExclusiveEpoch);

  let years = e.year - s.year;
  let months = e.month - s.month;
  let days = e.day - s.day;

  let borrowYear = e.year;
  let borrowMonth = e.month;

  while (days < 0) {
    months -= 1;
    borrowMonth -= 1;
    if (borrowMonth === 0) {
      borrowMonth = 12;
      borrowYear -= 1;
    }
    const daysInPrevMonth = new Date(Date.UTC(borrowYear, borrowMonth, 0)).getUTCDate();
    days += daysInPrevMonth;
  }

  while (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalYearsExact = years + months / 12 + days / 365;
  const totalYears365 = netCalendarDays / 365;
  const totalYears360 = years + months / 12 + days / 360;
  const totalMonths = years * 12 + months + days / 30;

  return {
    isValid: true,
    years,
    months,
    days,
    totalYearsExact,
    totalYears365,
    totalYears360,
    totalMonths,
    totalDays,
    netCalendarDays,
    unpaidDays,
  };
}

export function calculateSaudiGratuityByYears(yearsValue: number, baseWage: number): number {
  const yrs = Math.max(0, Number(yearsValue) || 0);
  const firstFiveYears = Math.min(yrs, 5);
  const afterFiveYears = Math.max(0, yrs - 5);
  return firstFiveYears * 0.5 * baseWage + afterFiveYears * 1.0 * baseWage;
}

export function getRecommendedNoticeDaysForSaudi(
  contractType: SaudiContractType,
  terminationType: string,
): number {
  if (contractType !== 'indefinite') return 0;
  if (
    terminationType === 'qiwa_art75' ||
    terminationType === 'qiwa_resignation' ||
    terminationType === 'resignation'
  ) {
    return 60;
  }
  return 0;
}

export function calculateArticle77Auto(
  contractType: SaudiContractType,
  settlementBaseWage: number,
  decimalYears: number,
  endDateStr: string,
  contractEndDateStr: string,
): { amount: number; remainingDescription: string; floorApplied: boolean } {
  const minimumTwoMonths = 2 * settlementBaseWage;
  if (contractType === 'indefinite') {
    const raw = 0.5 * settlementBaseWage * Math.max(0, decimalYears);
    const floorApplied = raw < minimumTwoMonths;
    return {
      amount: roundHalala(Math.max(raw, minimumTwoMonths)),
      remainingDescription: `15 يوماً عن كل سنة (${decimalYears.toFixed(2)} سنة) بحد أدنى شهرين`,
      floorApplied,
    };
  }

  // Fixed-term remaining period from (endDate + 1) to contractEndDate inclusive
  const endP = parseIsoDateStrict(endDateStr);
  const contractEndP = parseIsoDateStrict(contractEndDateStr);
  if (!endP || !contractEndP) {
    return {
      amount: roundHalala(minimumTwoMonths),
      remainingDescription: 'الحد الأدنى النظامي (راتب شهرين)',
      floorApplied: true,
    };
  }

  const nextDayEpoch = toEpochDays(endP.year, endP.month, endP.day) + 1;
  const contractEndEpoch = toEpochDays(contractEndP.year, contractEndP.month, contractEndP.day);
  if (contractEndEpoch < nextDayEpoch) {
    return {
      amount: roundHalala(minimumTwoMonths),
      remainingDescription: 'لا توجد مدة متبقية بعد نهاية العقد؛ يطبق الحد الأدنى (راتب شهرين)',
      floorApplied: true,
    };
  }

  const nextIso = fromEpochDays(nextDayEpoch);
  const nextDateStr = `${String(nextIso.year).padStart(4, '0')}-${String(nextIso.month).padStart(2, '0')}-${String(nextIso.day).padStart(2, '0')}`;
  const remTenure = calculateTenure(nextDateStr, contractEndDateStr, 0);
  const remMonthsEquivalent = remTenure.years * 12 + remTenure.months + remTenure.days / 30;
  const raw = remMonthsEquivalent * settlementBaseWage;
  const floorApplied = raw < minimumTwoMonths;

  return {
    amount: roundHalala(Math.max(raw, minimumTwoMonths)),
    remainingDescription: `المتبقي من العقد: ${remTenure.years} سنة و${remTenure.months} شهر و${remTenure.days} يوم (بحد أدنى شهرين)`,
    floorApplied,
  };
}

export interface SettlementBreakdown {
  tenure: TenureResult;
  unpaidBreakdown: UnpaidDeductionBreakdown;
  avgMonthlyCommission: number;
  settlementBaseWage: number;
  dailyWage: number;
  rawGratuity: number;
  entitlementRatio: number;
  entitlementRatioLabel: string;
  tier1Years: number;
  tier2Years: number;
  tier1Amount: number;
  tier2Amount: number;
  gratuity: number;
  noticeAmount: number;
  compensationAmount: number;
  art77AutoInfo: { amount: number; remainingDescription: string; floorApplied: boolean } | null;
  leavePayout: number;
  unpaidSal: number;
  loanBal: number;
  grossEntitlements: number;
  netSettlement: number;
  recommendedMonthlyLoanCap: number;
  qiwaComparisons: {
    qiwaStandard: number;
    days365: number;
    commercial360: number;
  } | null;
  lawNote: string;
}

export function calculateSettlement(s: SettlementInput): SettlementBreakdown {
  const unpaidBreakdown = computeEffectiveUnpaidDays({
    law: s.law,
    unauthorizedAbsenceDays: s.unauthorizedAbsenceDays,
    approvedUnpaidLeaveDays: s.approvedUnpaidLeaveDays,
    legacyUnpaidDays: s.unpaidDays,
    applyArt116Exempt20: s.applyArt116Exempt20,
  });
  const tenure = calculateTenure(s.hireDate, s.endDate, unpaidBreakdown.totalEffectiveDeductedDays);
  const basic = Math.max(0, Number(s.basicSalary) || 0);
  const fixedAllow = Math.max(0, Number(s.fixedAllowances) || 0);
  const commTotal12M = Math.max(0, Number(s.twelveMonthCommissionsTotal) || 0);

  // Exact calendar months divisor (if < 12 months served, average over actual calendar months served)
  const monthsDivisor = tenure.totalMonths > 0 && tenure.totalMonths < 12 ? tenure.totalMonths : 12;
  const avgMonthlyCommissionExact = commTotal12M / monthsDivisor;
  const avgMonthlyCommission = roundHalala(avgMonthlyCommissionExact);

  const settlementBaseWage = basic + fixedAllow + avgMonthlyCommissionExact;
  const dailyWage = settlementBaseWage / 30;

  const remainingLeave = Math.max(0, Number(s.remainingLeaveDays) || 0);
  const leavePayout = roundHalala(remainingLeave * dailyWage);
  const unpaidSal = roundHalala(Math.max(0, Number(s.unpaidSalary) || 0));
  const loanBal = roundHalala(Math.max(0, Number(s.loanBalance) || 0));

  const isSaudiLaw = s.law === 'saudi_citizen' || s.law === 'saudi_expat';
  let gratuityRaw = 0;
  let rawGratuity = 0;
  let entitlementRatio = 1;
  let entitlementRatioLabel = '100% (كاملة)';
  let tier1Years = 0;
  let tier2Years = 0;
  let tier1Amount = 0;
  let tier2Amount = 0;
  let noticeAmountRaw = 0;
  let compensationAmountRaw = 0;
  let art77AutoInfo: SettlementBreakdown['art77AutoInfo'] = null;
  let qiwaComparisons: SettlementBreakdown['qiwaComparisons'] = null;
  let lawNote = '';

  const parsedNotice = Number(s.noticeDays);
  const defaultNotice = isSaudiLaw ? 60 : 30;
  const noticeDays = Math.max(0, Number.isFinite(parsedNotice) ? parsedNotice : defaultNotice);

  if (isSaudiLaw) {
    const isExpat = s.law === 'saudi_expat';
    const categoryLabel = isExpat ? 'العامل غير السعودي' : 'العامل السعودي';
    const contractType: SaudiContractType = s.saudiContractType === 'indefinite' ? 'indefinite' : 'fixed_term';
    const contractLabel = contractType === 'indefinite' ? 'عقد غير محدد المدة' : 'عقد محدد المدة';
    const method: SaudiCalculationMethod = s.saudiCalculationMethod || 'qiwa_standard';

    const selectedYears =
      method === 'days_365'
        ? tenure.totalYears365
        : method === 'commercial_360'
          ? tenure.totalYears360
          : tenure.totalYearsExact;

    tier1Years = Math.min(selectedYears, 5);
    tier2Years = Math.max(0, selectedYears - 5);
    tier1Amount = roundHalala(tier1Years * 0.5 * settlementBaseWage);
    tier2Amount = roundHalala(tier2Years * 1.0 * settlementBaseWage);
    rawGratuity = calculateSaudiGratuityByYears(selectedYears, settlementBaseWage);

    if (s.applyNoticePay && noticeDays > 0) {
      noticeAmountRaw = (settlementBaseWage / 30) * noticeDays;
    }

    switch (s.terminationType) {
      case 'qiwa_art74_1':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `اتفاق الطرفين على إنهاء العقد (المادة 74/1 - قوى) [${contractLabel}]: يستحق ${categoryLabel} مكافأة نهاية الخدمة كاملة (${selectedYears.toFixed(4)} سنة).`;
        break;

      case 'qiwa_art74_2':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        if (contractType === 'indefinite') {
          lawNote = `تنبيه قوى: اخترت "انتهاء مدة العقد المحددة (المادة 74/2)" مع تحديد نوع العقد كـ "غير محدد المدة". يُحتسب الأجر المعتاد للمكافأة (${selectedYears.toFixed(4)} سنة)، ويُفضّل مطابقة نوع العقد وسبب الإنهاء في قوى.`;
        } else {
          lawNote = `انتهاء مدة العقد المحددة (المادة 74/2 - قوى) [${contractLabel}]: يستحق ${categoryLabel} مكافأة نهاية الخدمة كاملة عن كامل مدة الخدمة الشاملة ليوم النهاية.`;
        }
        break;

      case 'qiwa_art75':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `إنهاء العقد غير محدد المدة بإرادة صاحب العمل لسبب مشروع (المادة 75 - قوى) [${contractLabel}]: يستحق ${categoryLabel} مكافأة نهاية الخدمة كاملة مع مراعاة مهلة الإشعار النظامية (${noticeDays} يوماً).`;
        break;

      case 'qiwa_art77_employer': {
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        art77AutoInfo = calculateArticle77Auto(
          contractType,
          settlementBaseWage,
          selectedYears,
          s.endDate,
          s.contractEndDate,
        );
        const customArt77 = Math.max(0, Number(s.art77CompensationAmount) || 0);
        compensationAmountRaw = s.art77UseAutoCalculation ? art77AutoInfo.amount : customArt77;
        lawNote = `فسخ العقد من صاحب العمل لسبب غير مشروع (المادة 77 - قوى) [${contractLabel}]: يستحق ${categoryLabel} مكافأة نهاية الخدمة كاملة + تعويض المادة (77) (${art77AutoInfo.remainingDescription}).`;
        break;
      }

      case 'qiwa_art81':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `ترك العامل العمل لإحدى الحالات الواردة في المادة (81) من نظام العمل (قوى) [${contractLabel}]: يستحق ${categoryLabel} مكافأة نهاية الخدمة كاملة.`;
        break;

      case 'qiwa_art74_4':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `بلوغ العامل سن التقاعد (المادة 74/4 - قوى) [${contractLabel}]: يستحق ${categoryLabel} مكافأة نهاية الخدمة كاملة.`;
        break;

      case 'qiwa_art74_5':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `القوة القاهرة (المادة 74/5 - قوى) [${contractLabel}]: يستحق ${categoryLabel} مكافأة نهاية الخدمة كاملة.`;
        break;

      case 'qiwa_art74_6':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `إغلاق المنشأة نهائياً (المادة 74/6 - قوى) [${contractLabel}]: يستحق ${categoryLabel} مكافأة نهاية الخدمة كاملة.`;
        break;

      case 'qiwa_art74_7':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `إنهاء النشاط الذي يعمل فيه العامل (المادة 74/7 - قوى) [${contractLabel}]: يستحق ${categoryLabel} مكافأة نهاية الخدمة كاملة.`;
        break;

      case 'qiwa_art87':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `إنهاء العاملة عقد العمل خلال 6 أشهر من الزواج أو 3 أشهر من الوضع (المادة 87 - قوى) [${contractLabel}]: تستحق مكافأة نهاية الخدمة كاملة.`;
        break;

      case 'qiwa_death_disability':
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `وفاة العامل أو عجزه الكلي عن العمل (المادة 79 - قوى) [${contractLabel}]: تُستحق مكافأة نهاية الخدمة كاملة.`;
        break;

      case 'qiwa_probation':
        entitlementRatio = 0;
        entitlementRatioLabel = '0% (فترة تجربة)';
        gratuityRaw = 0;
        noticeAmountRaw = 0;
        compensationAmountRaw = 0;
        lawNote = `إنهاء العقد خلال فترة التجربة (المادة 53 - قوى) [${contractLabel}]: لا يستحق أي من الطرفين مكافأة نهاية خدمة أو تعويضاً.`;
        break;

      case 'qiwa_art80':
      case 'gross_misconduct':
        entitlementRatio = 0;
        entitlementRatioLabel = '0% (المادة 80)';
        gratuityRaw = 0;
        noticeAmountRaw = 0;
        compensationAmountRaw = 0;
        lawNote = `فسخ العقد من صاحب العمل لإحدى حالات المادة (80) من نظام العمل (قوى) [${contractLabel}]: لا يستحق العامل مكافأة نهاية خدمة أو بدل إشعار أو تعويضاً.`;
        break;

      case 'qiwa_art77_employee':
        entitlementRatio = 0;
        entitlementRatioLabel = '0% (فسخ من العامل)';
        gratuityRaw = 0;
        noticeAmountRaw = 0;
        compensationAmountRaw = 0;
        lawNote = `فسخ العقد من العامل لسبب غير مشروع (المادة 77 - قوى) [${contractLabel}]: لا يستحق مكافأة نهاية خدمة، ويُراعى التعويض المستحق لصاحب العمل وفق المادة (77) إن وُجد.`;
        break;

      case 'qiwa_resignation':
      case 'resignation':
        // Exact calendar integer years for Article 85 boundary thresholds
        if (tenure.years < 2) {
          entitlementRatio = 0;
          entitlementRatioLabel = '0% (أقل من سنتين)';
          gratuityRaw = 0;
          lawNote = `استقالة العامل (المادتان 74/3 و85 - قوى) [${contractLabel} - ${categoryLabel}] ومدة الخدمة أقل من سنتين (${tenure.years} سنة و${tenure.months} شهر و${tenure.days} يوم): لا يستحق مكافأة نهاية خدمة.`;
        } else if (tenure.years < 5) {
          entitlementRatio = 1 / 3;
          entitlementRatioLabel = '1/3 (ثلث المكافأة)';
          gratuityRaw = rawGratuity * (1 / 3);
          lawNote = `استقالة العامل (المادتان 74/3 و85 - قوى) [${contractLabel} - ${categoryLabel}] ومدة الخدمة من سنتين إلى أقل من 5 سنوات (${tenure.years} سنة و${tenure.months} شهر و${tenure.days} يوم): يستحق ثلث (1/3) المكافأة.`;
        } else if (tenure.years < 10) {
          entitlementRatio = 2 / 3;
          entitlementRatioLabel = '2/3 (ثلثا المكافأة)';
          gratuityRaw = rawGratuity * (2 / 3);
          lawNote = `استقالة العامل (المادتان 74/3 و85 - قوى) [${contractLabel} - ${categoryLabel}] ومدة الخدمة من 5 إلى أقل من 10 سنوات (${tenure.years} سنة و${tenure.months} شهر و${tenure.days} يوم): يستحق ثلثي (2/3) المكافأة.`;
        } else {
          entitlementRatio = 1;
          entitlementRatioLabel = '100% (10 سنوات فأكثر)';
          gratuityRaw = rawGratuity;
          lawNote = `استقالة العامل (المادتان 74/3 و85 - قوى) [${contractLabel} - ${categoryLabel}] ومدة الخدمة 10 سنوات فأكثر (${tenure.years} سنة و${tenure.months} شهر و${tenure.days} يوم): يستحق المكافأة كاملة.`;
        }
        break;

      default:
        entitlementRatio = 1;
        entitlementRatioLabel = '100% (كاملة)';
        gratuityRaw = rawGratuity;
        lawNote = `إنهاء الخدمة [${contractLabel} - ${categoryLabel}] وفق نظام العمل السعودي ومنصة قوى.`;
        break;
    }

    qiwaComparisons = {
      qiwaStandard: roundHalala(
        calculateSaudiGratuityByYears(tenure.totalYearsExact, settlementBaseWage) * entitlementRatio,
      ),
      days365: roundHalala(
        calculateSaudiGratuityByYears(tenure.totalYears365, settlementBaseWage) * entitlementRatio,
      ),
      commercial360: roundHalala(
        calculateSaudiGratuityByYears(tenure.totalYears360, settlementBaseWage) * entitlementRatio,
      ),
    };
  } else if (s.terminationType === 'gross_misconduct') {
    entitlementRatio = 0;
    entitlementRatioLabel = '0% (فصل تأديبي)';
    gratuityRaw = 0;
    noticeAmountRaw = 0;
    compensationAmountRaw = 0;
    lawNote = 'تم اختيار حالة مخالفة جسيمة/فصل بدون إشعار أو مكافأة؛ يُراعى التحقق القانوني وحصر الحالات حسب القانون المعمول به.';
  } else {
    if (s.applyNoticePay && noticeDays > 0) {
      noticeAmountRaw = (settlementBaseWage / 30) * noticeDays;
    }

    if (s.law === 'jordan') {
      if (s.socialSecurityCovered && !s.customContractGratuity) {
        entitlementRatio = 0;
        entitlementRatioLabel = '0% (مشمول بالضمان)';
        gratuityRaw = 0;
        lawNote = 'الموظف مشمول بالضمان الاجتماعي الأردني (7.5% موظف / 14.25% منشأة)، لذا لا تُحتسب مكافأة نهاية خدمة إضافية من المنشأة ما لم ينص العقد أو النظام الداخلي على خلاف ذلك.';
      } else {
        gratuityRaw = settlementBaseWage * tenure.totalYearsExact;
        lawNote = s.customContractGratuity
          ? 'تم تفعيل نص عقدي/نظام داخلي يمنح مكافأة نهاية خدمة إضافية بواقع شهر عن كل سنة خدمة.'
          : 'الموظف غير مشمول بالضمان الاجتماعي، وتُحتسب مكافأة نهاية الخدمة بواقع أجر شهر عن كل سنة خدمة.';
      }
    } else if (s.law === 'palestine') {
      if (tenure.years < 1) {
        entitlementRatio = 0;
        entitlementRatioLabel = '0% (أقل من سنة)';
        gratuityRaw = 0;
        lawNote = 'مدة الخدمة أقل من سنة كاملة؛ وفق قانون العمل الفلسطيني تُستحق مكافأة نهاية الخدمة عن السنوات الكاملة (أجر شهر عن كل سنة).';
      } else {
        const fullYears = tenure.years;
        gratuityRaw = fullYears * settlementBaseWage;
        lawNote = `احتساب مكافأة نهاية الخدمة وفق قانون العمل الفلسطيني بواقع أجر شهر عن كل سنة خدمة كاملة (${fullYears} سنة).`;
      }
    }
  }

  const gratuity = roundHalala(gratuityRaw);
  const noticeAmount = roundHalala(noticeAmountRaw);
  const compensationAmount = roundHalala(compensationAmountRaw);

  const grossEntitlements = roundHalala(
    gratuity + noticeAmount + compensationAmount + leavePayout + unpaidSal,
  );
  const netSettlement = roundHalala(grossEntitlements - loanBal);
  const recommendedMonthlyLoanCap = roundHalala(settlementBaseWage * 0.1);

  return {
    tenure,
    unpaidBreakdown,
    avgMonthlyCommission,
    settlementBaseWage: roundHalala(settlementBaseWage),
    dailyWage: roundHalala(dailyWage),
    rawGratuity: roundHalala(rawGratuity),
    entitlementRatio,
    entitlementRatioLabel,
    tier1Years,
    tier2Years,
    tier1Amount,
    tier2Amount,
    gratuity,
    noticeAmount,
    compensationAmount,
    art77AutoInfo,
    leavePayout,
    unpaidSal,
    loanBal,
    grossEntitlements,
    netSettlement,
    recommendedMonthlyLoanCap,
    qiwaComparisons,
    lawNote,
  };
}

export const MONTH_NAMES_AR = [
  'يناير (1)',
  'فبراير (2)',
  'مارس (3)',
  'أبريل (4)',
  'مايو (5)',
  'يونيو (6)',
  'يوليو (7)',
  'أغسطس (8)',
  'سبتمبر (9)',
  'أكتوبر (10)',
  'نوفمبر (11)',
  'ديسمبر (12)',
];

export interface LeaveMonthRow {
  month: number;
  label: string;
  monthlyAccrual: number;
  cumulativeAccrued: number;
  taken: number;
  remainingAfterTaken: number;
}

export interface LeaveSimResult {
  annual: number;
  taken: number;
  monthIdx: number;
  dayOfMonth: number;
  monthlyAccrual: number;
  accruedUpToDate: number;
  accruedEndOfSelectedMonth: number;
  remainingAsOfDate: number;
  remainingEndOfYear: number;
  schedule: LeaveMonthRow[];
}

export function calculateLeaveSimulation(sim: LeaveSimInput): LeaveSimResult {
  const annual = Math.max(0, Number(sim.annualEntitlement) || 0);
  const taken = Math.max(0, Number(sim.takenDays) || 0);
  const monthIdx = Math.min(12, Math.max(1, Number(sim.currentMonth) || 1));
  const dayOfMonth = Math.min(31, Math.max(1, Number(sim.currentDayOfMonth) || 1));

  const monthlyAccrual = annual / 12;
  const currentMonthFraction = Math.min(1, dayOfMonth / 30);
  const accruedUpToDate = roundHalala((monthIdx - 1) * monthlyAccrual + currentMonthFraction * monthlyAccrual);
  const accruedEndOfSelectedMonth = roundHalala(monthIdx * monthlyAccrual);

  const remainingAsOfDate = roundHalala(accruedUpToDate - taken);
  const remainingEndOfYear = roundHalala(annual - taken);

  const schedule: LeaveMonthRow[] = [];
  for (let m = 1; m <= 12; m++) {
    const cumulativeAccrued = roundHalala(m * monthlyAccrual);
    const remainingAfterTaken = roundHalala(cumulativeAccrued - taken);
    schedule.push({
      month: m,
      label: MONTH_NAMES_AR[m - 1],
      monthlyAccrual: roundHalala(monthlyAccrual),
      cumulativeAccrued,
      taken,
      remainingAfterTaken,
    });
  }

  return {
    annual,
    taken,
    monthIdx,
    dayOfMonth,
    monthlyAccrual: roundHalala(monthlyAccrual),
    accruedUpToDate,
    accruedEndOfSelectedMonth,
    remainingAsOfDate,
    remainingEndOfYear,
    schedule,
  };
}

function formatIsoFromEpoch(epochDays: number): string {
  const { year, month, day } = fromEpochDays(epochDays);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function addYearsIso(isoStr: string, addYears: number): string {
  const p = parseIsoDateStrict(isoStr);
  if (!p) return isoStr;
  const targetYear = p.year + addYears;
  const maxDayInMonth = new Date(Date.UTC(targetYear, p.month, 0)).getUTCDate();
  const clampedDay = Math.min(p.day, maxDayInMonth);
  return `${String(targetYear).padStart(4, '0')}-${String(p.month).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;
}

export function getStatutoryAnnualEntitlement(
  lawId: LawId | string,
  completedYears: number,
  palestineHazardousWork = false,
): { entitlementDays: number; bracketLabel: string; legalBasis: string } {
  const normalized = normalizeLawId(lawId);
  const profile = LAW_PROFILES[normalized];
  const isOver5 = completedYears >= 5;

  if (normalized === 'palestine') {
    if (isOver5 || palestineHazardousWork) {
      return {
        entitlementDays: profile.annualLeaveOver5,
        bracketLabel: isOver5
          ? '5 سنوات خدمة متصلة فأكثر (21 يوماً)'
          : 'أعمال خطرة / ضارة بالصحة (21 يوماً)',
        legalBasis: 'المادة (74/2) من قانون العمل الفلسطيني رقم 7 لسنة 2000',
      };
    }
    return {
      entitlementDays: profile.annualLeaveUnder5,
      bracketLabel: 'أقل من 5 سنوات خدمة (14 يوماً)',
      legalBasis: 'المادة (74/1) من قانون العمل الفلسطيني رقم 7 لسنة 2000',
    };
  }

  if (normalized === 'jordan') {
    return {
      entitlementDays: isOver5 ? profile.annualLeaveOver5 : profile.annualLeaveUnder5,
      bracketLabel: isOver5 ? '5 سنوات خدمة متصلة فأكثر (21 يوماً)' : 'أقل من 5 سنوات خدمة (14 يوماً)',
      legalBasis: 'المادة (61) من قانون العمل الأردني رقم 8 لسنة 1996 وتعديلاته',
    };
  }

  return {
    entitlementDays: isOver5 ? profile.annualLeaveOver5 : profile.annualLeaveUnder5,
    bracketLabel: isOver5 ? '5 سنوات خدمة متصلة فأكثر (30 يوماً)' : 'أقل من 5 سنوات خدمة (21 يوماً)',
    legalBasis: 'المادة (109) من نظام العمل السعودي',
  };
}

export interface DetailedLeaveMonthRow {
  index: number;
  label: string;
  startDate: string;
  endDate: string;
  monthAccrual: number;
  cumulativeYearAccrued: number;
  totalAvailableWithCarryOver: number;
  takenApplied: number;
  netRemainingEndOfMonth: number;
  rateLabel: string;
  status: 'past' | 'current' | 'future';
}

export interface DetailedLeaveResult {
  isValidDates: boolean;
  lawProfile: LawProfile;
  tenure: TenureResult;
  accrualBasis: LeaveAccrualBasis;
  hireDate: string;
  asOfDate: string;
  cycleStartDate: string;
  cycleEndDate: string;
  cycleTotalDays: number;
  activeDaysUpToAsOf: number;
  remainingCalendarDaysInCycle: number;
  fiveYearMilestoneDate: string;
  reachedFiveYearsBeforeCycle: boolean;
  crossesFiveYearsDuringCycle: boolean;
  reachedFiveYearsAsOfDate: boolean;
  daysUntilFiveYearUpgrade: number;
  currentAnnualRate: number;
  monthlyRateCurrent: number;
  dailyRateCurrent: number;
  bracketLabel: string;
  legalBasis: string;
  isSplitYear: boolean;
  splitBeforeDays: number;
  splitBeforeAccrual: number;
  splitBeforeRate: number;
  splitAfterDays: number;
  splitAfterAccrual: number;
  splitAfterRate: number;
  carriedOverDays: number;
  unpaidBreakdown: UnpaidDeductionBreakdown;
  unpaidDaysDeductedLeave: number;
  accruedFromCycleUpToAsOf: number;
  totalAvailableUpToAsOf: number;
  takenDays: number;
  plannedLeaveDays: number;
  remainingAsOfDate: number;
  futureAccrualToCycleEnd: number;
  fullCycleNetAccrual: number;
  projectedTotalPoolEndOfCycle: number;
  projectedRemainingEndOfCycle: number;
  projectedRemainingAfterPlanned: number;
  valueAsOfDate: number;
  valueEndOfCycle: number;
  schedule: DetailedLeaveMonthRow[];
}

export function calculateDetailedLeave(sim: LeaveSimInput): DetailedLeaveResult {
  const lawProfile = LAW_PROFILES[normalizeLawId(sim.law)];
  const todayIso = new Date().toISOString().slice(0, 10);
  const asOfDateStr = parseIsoDateStrict(sim.asOfDate || '') ? (sim.asOfDate as string) : todayIso;
  const asOfP = parseIsoDateStrict(asOfDateStr)!;

  const hireDateStr = parseIsoDateStrict(sim.hireDate || '')
    ? (sim.hireDate as string)
    : `${asOfP.year - 5}-${String(asOfP.month).padStart(2, '0')}-${String(Math.min(asOfP.day, 28)).padStart(2, '0')}`;
  const hireP = parseIsoDateStrict(hireDateStr)!;

  const hireEpoch = toEpochDays(hireP.year, hireP.month, hireP.day);
  const asOfEpoch = toEpochDays(asOfP.year, asOfP.month, asOfP.day);
  const isValidDates = asOfEpoch >= hireEpoch;

  const tenure = calculateTenure(hireDateStr, asOfDateStr, 0);
  const basis: LeaveAccrualBasis = sim.accrualBasis === 'anniversary_year' ? 'anniversary_year' : 'calendar_year';

  // Determine 12-month leave cycle bounds
  let cycleStartStr: string;
  let cycleEndStr: string;

  if (basis === 'anniversary_year') {
    const annivThisYear = addYearsIso(hireDateStr, asOfP.year - hireP.year);
    const annivP = parseIsoDateStrict(annivThisYear)!;
    const annivEpoch = toEpochDays(annivP.year, annivP.month, annivP.day);
    if (asOfEpoch >= annivEpoch) {
      cycleStartStr = annivThisYear;
      const nextAnniv = addYearsIso(hireDateStr, asOfP.year - hireP.year + 1);
      const nextP = parseIsoDateStrict(nextAnniv)!;
      cycleEndStr = formatIsoFromEpoch(toEpochDays(nextP.year, nextP.month, nextP.day) - 1);
    } else {
      const prevAnniv = addYearsIso(hireDateStr, Math.max(0, asOfP.year - hireP.year - 1));
      cycleStartStr = prevAnniv;
      cycleEndStr = formatIsoFromEpoch(annivEpoch - 1);
    }
  } else {
    cycleStartStr = `${asOfP.year}-01-01`;
    cycleEndStr = `${asOfP.year}-12-31`;
  }

  const cycleStartP = parseIsoDateStrict(cycleStartStr)!;
  const cycleEndP = parseIsoDateStrict(cycleEndStr)!;
  const cycleStartEpoch = toEpochDays(cycleStartP.year, cycleStartP.month, cycleStartP.day);
  const cycleEndEpoch = toEpochDays(cycleEndP.year, cycleEndP.month, cycleEndP.day);
  const cycleTotalDays = Math.max(1, cycleEndEpoch - cycleStartEpoch + 1);

  const fiveYearMilestoneDate = addYearsIso(hireDateStr, 5);
  const fiveYearP = parseIsoDateStrict(fiveYearMilestoneDate)!;
  const fiveYearEpoch = toEpochDays(fiveYearP.year, fiveYearP.month, fiveYearP.day);

  const customAnnual = Math.max(0, Number(sim.annualEntitlement) || 0);
  const useDefault = sim.useLawDefaultEntitlement !== false;
  const hazardous = Boolean(sim.palestineHazardousWork && lawProfile.id === 'palestine');

  const rateForDay = (dayEpoch: number): number => {
    if (dayEpoch < hireEpoch) return 0;
    if (!useDefault) return customAnnual;
    if (hazardous) return lawProfile.annualLeaveOver5;
    return dayEpoch >= fiveYearEpoch ? lawProfile.annualLeaveOver5 : lawProfile.annualLeaveUnder5;
  };

  let rawAccruedUpToAsOf = 0;
  let rawFutureAccrual = 0;
  let activeDaysUpToAsOf = 0;
  let remainingCalendarDaysInCycle = 0;

  let splitBeforeDays = 0;
  let splitBeforeAccrualRaw = 0;
  let splitAfterDays = 0;
  let splitAfterAccrualRaw = 0;

  for (let d = cycleStartEpoch; d <= cycleEndEpoch; d++) {
    const annualRateForDay = rateForDay(d);
    const dailyIncrement = annualRateForDay / cycleTotalDays;

    if (d >= hireEpoch) {
      if (d < fiveYearEpoch) {
        splitBeforeDays++;
        splitBeforeAccrualRaw += dailyIncrement;
      } else {
        splitAfterDays++;
        splitAfterAccrualRaw += dailyIncrement;
      }
    }

    if (d <= asOfEpoch) {
      if (d >= hireEpoch) {
        activeDaysUpToAsOf++;
        rawAccruedUpToAsOf += dailyIncrement;
      }
    } else {
      remainingCalendarDaysInCycle++;
      if (d >= hireEpoch) {
        rawFutureAccrual += dailyIncrement;
      }
    }
  }

  const reachedFiveYearsBeforeCycle = cycleStartEpoch >= fiveYearEpoch;
  const reachedFiveYearsAsOfDate = asOfEpoch >= fiveYearEpoch;
  const crossesFiveYearsDuringCycle =
    useDefault && !hazardous && fiveYearEpoch > cycleStartEpoch && fiveYearEpoch <= cycleEndEpoch;
  const daysUntilFiveYearUpgrade = Math.max(0, fiveYearEpoch - asOfEpoch);

  const currentStatutory = getStatutoryAnnualEntitlement(
    lawProfile.id,
    tenure.isValid ? tenure.years : 0,
    hazardous,
  );
  const currentAnnualRate = useDefault ? currentStatutory.entitlementDays : customAnnual;
  const monthlyRateCurrent = roundHalala(currentAnnualRate / 12);
  const dailyRateCurrent = currentAnnualRate / cycleTotalDays;

  const unpaidBreakdown = computeEffectiveUnpaidDays({
    law: lawProfile.id,
    unauthorizedAbsenceDays: sim.unauthorizedAbsenceDaysThisYear,
    approvedUnpaidLeaveDays: sim.approvedUnpaidLeaveDaysThisYear,
    legacyUnpaidDays: sim.unpaidDaysThisYear,
    applyArt116Exempt20: sim.applyArt116Exempt20ForLeave,
  });
  const unpaidThisYear = unpaidBreakdown.totalEffectiveDeductedDays;
  const unpaidLeaveImpact = unpaidThisYear * dailyRateCurrent;
  const unpaidDaysDeductedLeave = roundHalala(unpaidLeaveImpact);

  const accruedFromCycleUpToAsOf = roundHalala(Math.max(0, rawAccruedUpToAsOf - unpaidLeaveImpact));
  const futureAccrualToCycleEnd = roundHalala(rawFutureAccrual);
  const fullCycleNetAccrual = roundHalala(
    Math.max(0, rawAccruedUpToAsOf + rawFutureAccrual - unpaidLeaveImpact),
  );

  const carriedOverDays = Math.max(0, Number(sim.carriedOverDays) || 0);
  const takenDays = Math.max(0, Number(sim.takenDays) || 0);
  const plannedLeaveDays = Math.max(0, Number(sim.plannedLeaveDays) || 0);

  const totalAvailableUpToAsOf = roundHalala(accruedFromCycleUpToAsOf + carriedOverDays);
  const remainingAsOfDate = roundHalala(totalAvailableUpToAsOf - takenDays);
  const projectedTotalPoolEndOfCycle = roundHalala(fullCycleNetAccrual + carriedOverDays);
  const projectedRemainingEndOfCycle = roundHalala(projectedTotalPoolEndOfCycle - takenDays);
  const projectedRemainingAfterPlanned = roundHalala(projectedRemainingEndOfCycle - plannedLeaveDays);

  // Build 12 monthly buckets across the cycle
  const schedule: DetailedLeaveMonthRow[] = [];
  let runningCumulativeYear = 0;

  for (let idx = 0; idx < 12; idx++) {
    let mStartEpoch: number;
    let mEndEpoch: number;
    let label: string;

    if (basis === 'calendar_year') {
      const m = idx + 1;
      mStartEpoch = toEpochDays(asOfP.year, m, 1);
      const lastDay = new Date(Date.UTC(asOfP.year, m, 0)).getUTCDate();
      mEndEpoch = toEpochDays(asOfP.year, m, lastDay);
      label = MONTH_NAMES_AR[idx];
    } else {
      const startMonth0 = cycleStartP.month - 1 + idx;
      const y = cycleStartP.year + Math.floor(startMonth0 / 12);
      const m = (startMonth0 % 12) + 1;
      const maxD = new Date(Date.UTC(y, m, 0)).getUTCDate();
      const startD = Math.min(cycleStartP.day, maxD);
      mStartEpoch = toEpochDays(y, m, startD);
      const nextMonth0 = startMonth0 + 1;
      const ny = cycleStartP.year + Math.floor(nextMonth0 / 12);
      const nm = (nextMonth0 % 12) + 1;
      const maxND = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
      const nextStartD = Math.min(cycleStartP.day, maxND);
      mEndEpoch = toEpochDays(ny, nm, nextStartD) - 1;
      label = `${MONTH_NAMES_AR[m - 1]} ${y}`;
    }

    let mRaw = 0;
    let rateLowCount = 0;
    let rateHighCount = 0;
    for (let d = mStartEpoch; d <= mEndEpoch; d++) {
      const r = rateForDay(d);
      if (r > 0) {
        mRaw += r / cycleTotalDays;
        if (r === lawProfile.annualLeaveOver5) rateHighCount++;
        else rateLowCount++;
      }
    }

    // Apply unpaid deduction proportionally on the cycle's cumulative basis at the end
    const monthAccrual = roundHalala(mRaw);
    runningCumulativeYear += mRaw;
    const adjustedCum = Math.max(0, runningCumulativeYear - (mEndEpoch >= asOfEpoch ? unpaidLeaveImpact : 0));
    const cumulativeYearAccrued = roundHalala(adjustedCum);
    const totalAvailableWithCarryOver = roundHalala(cumulativeYearAccrued + carriedOverDays);
    const netRemainingEndOfMonth = roundHalala(totalAvailableWithCarryOver - takenDays);

    let status: 'past' | 'current' | 'future' = 'future';
    if (mEndEpoch < asOfEpoch) status = 'past';
    else if (mStartEpoch <= asOfEpoch && asOfEpoch <= mEndEpoch) status = 'current';

    let rateLabel = `${currentAnnualRate} يوم/سنة`;
    if (useDefault && !hazardous) {
      if (rateLowCount > 0 && rateHighCount > 0) {
        rateLabel = `انتقالي (${lawProfile.annualLeaveUnder5} ← ${lawProfile.annualLeaveOver5})`;
      } else if (rateHighCount > 0) {
        rateLabel = `${lawProfile.annualLeaveOver5} يوم/سنة`;
      } else if (rateLowCount > 0) {
        rateLabel = `${lawProfile.annualLeaveUnder5} يوم/سنة`;
      } else {
        rateLabel = 'قبل المباشرة';
      }
    }

    schedule.push({
      index: idx + 1,
      label,
      startDate: formatIsoFromEpoch(mStartEpoch),
      endDate: formatIsoFromEpoch(mEndEpoch),
      monthAccrual,
      cumulativeYearAccrued,
      totalAvailableWithCarryOver,
      takenApplied: takenDays,
      netRemainingEndOfMonth,
      rateLabel,
      status,
    });
  }

  const dailyWage = Math.max(0, Number(sim.dailyWageForValuation) || 0);
  const valueAsOfDate = roundHalala(remainingAsOfDate * dailyWage);
  const valueEndOfCycle = roundHalala(projectedRemainingAfterPlanned * dailyWage);

  return {
    isValidDates,
    lawProfile,
    tenure,
    accrualBasis: basis,
    hireDate: hireDateStr,
    asOfDate: asOfDateStr,
    cycleStartDate: cycleStartStr,
    cycleEndDate: cycleEndStr,
    cycleTotalDays,
    activeDaysUpToAsOf,
    remainingCalendarDaysInCycle,
    fiveYearMilestoneDate,
    reachedFiveYearsBeforeCycle,
    crossesFiveYearsDuringCycle,
    reachedFiveYearsAsOfDate,
    daysUntilFiveYearUpgrade,
    currentAnnualRate,
    monthlyRateCurrent,
    dailyRateCurrent,
    bracketLabel: useDefault ? currentStatutory.bracketLabel : `معدل مخصص (${customAnnual} يوماً سنوياً)`,
    legalBasis: useDefault ? currentStatutory.legalBasis : 'استحقاق تعاقدي مخصص أعلى من الحد الأدنى النظامي',
    isSplitYear: crossesFiveYearsDuringCycle && splitBeforeDays > 0 && splitAfterDays > 0,
    splitBeforeDays,
    splitBeforeAccrual: roundHalala(splitBeforeAccrualRaw),
    splitBeforeRate: lawProfile.annualLeaveUnder5,
    splitAfterDays,
    splitAfterAccrual: roundHalala(splitAfterAccrualRaw),
    splitAfterRate: lawProfile.annualLeaveOver5,
    carriedOverDays: roundHalala(carriedOverDays),
    unpaidBreakdown,
    unpaidDaysDeductedLeave,
    accruedFromCycleUpToAsOf,
    totalAvailableUpToAsOf,
    takenDays: roundHalala(takenDays),
    plannedLeaveDays: roundHalala(plannedLeaveDays),
    remainingAsOfDate,
    futureAccrualToCycleEnd,
    fullCycleNetAccrual,
    projectedTotalPoolEndOfCycle,
    projectedRemainingEndOfCycle,
    projectedRemainingAfterPlanned,
    valueAsOfDate,
    valueEndOfCycle,
    schedule,
  };
}

export function formatMoney(val: number, lawId: LawId | string): string {
  const num = Number(val) || 0;
  const code = LAW_PROFILES[normalizeLawId(lawId)]?.currencyCode || 'SAR';
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${code}`;
}

export function formatDays(val: number): string {
  const num = Number(val) || 0;
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} يوم`;
}

export function parseImportedData(text: string): {
  employees: Employee[];
  settlement: Partial<SettlementInput> | null;
  leaveSim: Partial<LeaveSimInput> | null;
} {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('النص المدخل فارغ');

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const json = JSON.parse(trimmed);
    const list = Array.isArray(json) ? json : Array.isArray(json.employees) ? json.employees : null;
    if (!list) throw new Error('ملف JSON لا يحتوي على قائمة موظفين صالحة');
    return {
      employees: list.map((item: Record<string, unknown>, idx: number) => ({
        id: String(item.id || `emp-imp-${Date.now()}-${idx}`),
        name: String(item.name || `موظف ${idx + 1}`),
        role: String(item.role || 'موظف'),
        law: normalizeLawId(String(item.law || '')),
        department: String(item.department || 'عام'),
        hireDate: String(item.hireDate || '2023-01-01'),
        basicSalary: Number(item.basicSalary) || 0,
        fixedAllowances: Number(item.fixedAllowances) || 0,
        annualLeaveEntitlement: Number(item.annualLeaveEntitlement) || 14,
        takenLeaveDays: Number(item.takenLeaveDays) || 0,
        note: String(item.note || ''),
        reminderTime: String(item.reminderTime || '08:30'),
        reminderActive: item.reminderActive !== undefined ? Boolean(item.reminderActive) : true,
        lastNotifiedDate: '',
      })),
      settlement: json.settlement || null,
      leaveSim: json.leaveSim || null,
    };
  }

  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new Error('ملف CSV يجب أن يحتوي على رأس جدول وصف بيانات واحد على الأقل');

  const splitCSVLine = (line: string) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = splitCSVLine(lines[0]).map((h) => h.replace(/^\uFEFF/, ''));
  const employees: Employee[] = lines.slice(1).map((line, idx) => {
    const cols = splitCSVLine(line);
    const rec: Record<string, string> = {};
    headers.forEach((h, i) => {
      rec[h] = cols[i] ?? '';
    });
    return {
      id: rec.id || `emp-csv-${Date.now()}-${idx}`,
      name: rec.name || `موظف ${idx + 1}`,
      role: rec.role || 'موظف',
      law: normalizeLawId(rec.law),
      department: rec.department || 'عام',
      hireDate: rec.hireDate || '2023-01-01',
      basicSalary: Number(rec.basicSalary) || 0,
      fixedAllowances: Number(rec.fixedAllowances) || 0,
      annualLeaveEntitlement: Number(rec.annualLeaveEntitlement) || 14,
      takenLeaveDays: Number(rec.takenLeaveDays) || 0,
      note: rec.note || '',
      reminderTime: rec.reminderTime || '08:30',
      reminderActive: true,
      lastNotifiedDate: '',
    };
  });

  return { employees, settlement: null, leaveSim: null };
}
