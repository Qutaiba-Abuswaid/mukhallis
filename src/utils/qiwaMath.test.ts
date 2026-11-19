import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTenure,
  calculateSettlement,
  calculateLeaveSimulation,
  calculateDetailedLeave,
  calculateArticle77Auto,
  computeEffectiveUnpaidDays,
  getDefaultSettlement,
  getDefaultLeaveSim,
  getStatutoryAnnualEntitlement,
  roundHalala,
} from './qiwaMath';

test('Qiwa inclusive tenure handles exact 5-year anniversary without 4y11m30d off-by-one bug', () => {
  const t = calculateTenure('2020-01-01', '2024-12-31', 0);
  assert.equal(t.isValid, true);
  assert.equal(t.years, 5);
  assert.equal(t.months, 0);
  assert.equal(t.days, 0);
  assert.equal(t.totalYearsExact, 5);
  assert.equal(t.totalDays, 1827);
});

test('Qiwa inclusive tenure fixes user default case 2022-01-01 to 2026-11-15 (4y 10m 15d)', () => {
  const t = calculateTenure('2022-01-01', '2026-11-15', 0);
  assert.equal(t.years, 4);
  assert.equal(t.months, 10);
  assert.equal(t.days, 15);
  // 4 + 10/12 + 15/365 = 4.87442922...
  const expectedYears = 4 + 10 / 12 + 15 / 365;
  assert.ok(Math.abs(t.totalYearsExact - expectedYears) < 1e-9);
});

test('Leap year February and month-end borrow decompose without negative days', () => {
  const t1 = calculateTenure('2024-01-31', '2024-02-29', 0);
  assert.equal(t1.years, 0);
  assert.equal(t1.months, 0);
  assert.equal(t1.days, 30);

  const t2 = calculateTenure('2024-02-01', '2024-02-29', 0);
  assert.equal(t2.years, 0);
  assert.equal(t2.months, 1);
  assert.equal(t2.days, 0);
});

test('Saudi resignation at exact 5 years (2020-01-01 to 2024-12-31) yields 2/3, not 1/3', () => {
  const s = getDefaultSettlement('saudi_citizen');
  s.hireDate = '2020-01-01';
  s.endDate = '2024-12-31';
  s.terminationType = 'qiwa_resignation';
  s.basicSalary = 6000;
  s.fixedAllowances = 1500;
  s.twelveMonthCommissionsTotal = 18000; // 1500/mo -> total wage 9000
  s.remainingLeaveDays = 0;
  s.unpaidSalary = 0;
  s.loanBalance = 0;

  const res = calculateSettlement(s);
  assert.equal(res.settlementBaseWage, 9000);
  assert.equal(res.rawGratuity, 22500);
  assert.equal(res.entitlementRatio, 2 / 3);
  assert.equal(res.gratuity, 15000);
  assert.equal(res.netSettlement, 15000);
});

test('Saudi Article 84 splits first 5 years (0.5/yr) and >5 years (1.0/yr) cleanly', () => {
  const s = getDefaultSettlement('saudi_expat');
  s.hireDate = '2018-01-01';
  s.endDate = '2024-04-15'; // 6y 3m 15d inclusive
  s.terminationType = 'qiwa_art74_2';
  s.basicSalary = 6000;
  s.fixedAllowances = 0;
  s.twelveMonthCommissionsTotal = 0;
  s.remainingLeaveDays = 0;
  s.unpaidSalary = 0;
  s.loanBalance = 0;

  const res = calculateSettlement(s);
  const expected = roundHalala((5 * 0.5 + (1 + 3 / 12 + 15 / 365) * 1.0) * 6000);
  assert.equal(res.gratuity, expected);
  assert.equal(res.netSettlement, expected);
});

test('Commission divisor uses exact calendar months when tenure < 12 months', () => {
  const s = getDefaultSettlement('saudi_citizen');
  s.hireDate = '2024-01-01';
  s.endDate = '2024-06-30'; // exactly 6 calendar months inclusive
  s.basicSalary = 5000;
  s.fixedAllowances = 0;
  s.twelveMonthCommissionsTotal = 6000; // 1000/mo over 6 months
  s.remainingLeaveDays = 0;
  s.unpaidSalary = 0;
  s.loanBalance = 0;

  const res = calculateSettlement(s);
  assert.equal(res.tenure.months, 6);
  assert.equal(res.avgMonthlyCommission, 1000);
  assert.equal(res.settlementBaseWage, 6000);
});

test('noticeDays = 0 is respected (no 0 || 60 falsy fallback bug)', () => {
  const s = getDefaultSettlement('saudi_citizen');
  s.applyNoticePay = true;
  s.noticeDays = 0;
  const res = calculateSettlement(s);
  assert.equal(res.noticeAmount, 0);
});

test('Article 77 auto calculation handles fixed-term remaining duration and 2-month floor', () => {
  const fixedLong = calculateArticle77Auto('fixed_term', 8500, 3, '2026-06-30', '2026-12-31');
  // 6 remaining months * 8500 = 51000
  assert.equal(fixedLong.amount, 51000);
  assert.equal(fixedLong.floorApplied, false);

  const fixedShort = calculateArticle77Auto('fixed_term', 8500, 3, '2026-12-01', '2026-12-31');
  // 1 month < 2 month floor -> 17000
  assert.equal(fixedShort.amount, 17000);
  assert.equal(fixedShort.floorApplied, true);

  const indefinite = calculateArticle77Auto('indefinite', 8500, 2, '2026-12-31', '2026-12-31');
  // 2 * 0.5 * 8500 = 8500 < 2 month floor -> 17000
  assert.equal(indefinite.amount, 17000);
  assert.equal(indefinite.floorApplied, true);
});

test('Line items rounded to halala always sum identically to netSettlement', () => {
  const s = getDefaultSettlement('saudi_citizen');
  s.hireDate = '2022-01-01';
  s.endDate = '2026-11-15';
  s.terminationType = 'qiwa_resignation';
  s.basicSalary = 6123;
  s.fixedAllowances = 1411;
  s.twelveMonthCommissionsTotal = 10000;
  s.remainingLeaveDays = 7.5;
  s.applyNoticePay = true;
  s.noticeDays = 60;
  s.unpaidSalary = 333.33;
  s.loanBalance = 111.11;

  const res = calculateSettlement(s);
  const manualSum = roundHalala(
    res.gratuity + res.noticeAmount + res.compensationAmount + res.leavePayout + res.unpaidSal - res.loanBal,
  );
  assert.equal(res.netSettlement, manualSum);
});

test('Unpaid absence days reduce net service duration and bracket', () => {
  const s = getDefaultSettlement('saudi_citizen');
  s.hireDate = '2020-01-01';
  s.endDate = '2024-12-31';
  s.terminationType = 'qiwa_resignation';
  s.unauthorizedAbsenceDays = 5; // drops from 5y0m0d to 4y11m26d -> 1/3 instead of 2/3
  const res = calculateSettlement(s);
  assert.equal(res.tenure.years, 4);
  assert.equal(res.entitlementRatio, 1 / 3);

  // Legacy saved state without split fields falls back to unpaidDays
  const legacyRes = calculateSettlement({
    ...getDefaultSettlement('saudi_citizen'),
    hireDate: '2020-01-01',
    endDate: '2024-12-31',
    terminationType: 'qiwa_resignation',
    unauthorizedAbsenceDays: undefined,
    approvedUnpaidLeaveDays: undefined,
    unpaidDays: 5,
  });
  assert.equal(legacyRes.tenure.years, 4);
  assert.equal(legacyRes.entitlementRatio, 1 / 3);
});

test('Jordan, Palestine, and Leave Simulation compute accurately', () => {
  const jor = getDefaultSettlement('jordan');
  jor.hireDate = '2022-01-01';
  jor.endDate = '2024-12-31'; // exact 3 years inclusive
  jor.socialSecurityCovered = false;
  jor.twelveMonthCommissionsTotal = 0;
  jor.basicSalary = 500;
  jor.fixedAllowances = 100;
  jor.remainingLeaveDays = 0;
  jor.unpaidSalary = 0;
  jor.loanBalance = 0;
  const jorRes = calculateSettlement(jor);
  assert.equal(jorRes.gratuity, 1800);

  const pal = getDefaultSettlement('palestine');
  pal.hireDate = '2022-01-01';
  pal.endDate = '2024-12-31'; // exact 3 years inclusive
  pal.twelveMonthCommissionsTotal = 0;
  pal.basicSalary = 1000;
  pal.fixedAllowances = 0;
  pal.remainingLeaveDays = 0;
  pal.unpaidSalary = 0;
  pal.loanBalance = 0;
  const palRes = calculateSettlement(pal);
  assert.equal(palRes.gratuity, 3000);

  const leave = calculateLeaveSimulation({
    law: 'saudi_citizen',
    employeeName: 'test',
    annualEntitlement: 21,
    takenDays: 10,
    currentMonth: 11,
    currentDayOfMonth: 15,
    useLawDefaultEntitlement: false,
  });
  // (10 * 1.75) + (0.5 * 1.75) = 17.5 + 0.875 = 18.38 rounded
  assert.equal(leave.accruedUpToDate, 18.38);
  assert.equal(leave.remainingAsOfDate, 8.38);
});

test('Statutory annual leave brackets are accurate for Jordan, Saudi, and Palestine', () => {
  assert.equal(getStatutoryAnnualEntitlement('jordan', 3).entitlementDays, 14);
  assert.equal(getStatutoryAnnualEntitlement('jordan', 5).entitlementDays, 21);

  assert.equal(getStatutoryAnnualEntitlement('saudi_citizen', 4).entitlementDays, 21);
  assert.equal(getStatutoryAnnualEntitlement('saudi_citizen', 5).entitlementDays, 30);
  assert.equal(getStatutoryAnnualEntitlement('saudi_expat', 6).entitlementDays, 30);

  assert.equal(getStatutoryAnnualEntitlement('palestine', 2, false).entitlementDays, 14);
  assert.equal(getStatutoryAnnualEntitlement('palestine', 2, true).entitlementDays, 21);
  assert.equal(getStatutoryAnnualEntitlement('palestine', 5, false).entitlementDays, 21);
});

test('Detailed leave projection for 5-year employee shows exact balance today and at year end', () => {
  const sim = getDefaultLeaveSim('saudi_citizen');
  sim.hireDate = '2021-01-01';
  sim.asOfDate = '2026-11-16'; // 320 days of 365 in 2026, >= 5 years full 30 days
  sim.takenDays = 12;
  sim.carriedOverDays = 3;
  sim.unpaidDaysThisYear = 0;
  sim.plannedLeaveDays = 5;

  const saudi = calculateDetailedLeave(sim);
  assert.equal(saudi.currentAnnualRate, 30);
  assert.equal(saudi.activeDaysUpToAsOf, 320);
  assert.equal(saudi.remainingCalendarDaysInCycle, 45);
  assert.equal(saudi.accruedFromCycleUpToAsOf, 26.3); // 320/365 * 30
  assert.equal(saudi.totalAvailableUpToAsOf, 29.3); // 26.3 + 3 carriedOver
  assert.equal(saudi.remainingAsOfDate, 17.3); // 29.3 - 12 taken
  assert.equal(saudi.futureAccrualToCycleEnd, 3.7); // 45/365 * 30
  assert.equal(saudi.fullCycleNetAccrual, 30);
  assert.equal(saudi.projectedRemainingEndOfCycle, 21); // 30 + 3 - 12
  assert.equal(saudi.projectedRemainingAfterPlanned, 16); // 21 - 5

  // Same 5-year tenure in Jordan & Palestine yields 21 days/yr
  const jordan = calculateDetailedLeave({ ...sim, law: 'jordan' });
  assert.equal(jordan.currentAnnualRate, 21);
  assert.equal(jordan.projectedRemainingEndOfCycle, 12); // 21 + 3 - 12

  const palestine = calculateDetailedLeave({ ...sim, law: 'palestine' });
  assert.equal(palestine.currentAnnualRate, 21);
  assert.equal(palestine.projectedRemainingEndOfCycle, 12);
});

test('Detailed leave handles split-year upgrade when employee hits 5 years mid-year', () => {
  const sim = getDefaultLeaveSim('saudi_citizen');
  sim.hireDate = '2021-07-01'; // reaches 5 years on 2026-07-01
  sim.asOfDate = '2026-11-16';
  sim.takenDays = 10;
  sim.carriedOverDays = 0;

  const res = calculateDetailedLeave(sim);
  assert.equal(res.isSplitYear, true);
  assert.equal(res.fiveYearMilestoneDate, '2026-07-01');
  assert.equal(res.splitBeforeDays, 181); // Jan 1 - Jun 30
  assert.equal(res.splitAfterDays, 184); // Jul 1 - Dec 31
  // 181/365*21 + 184/365*30 = 10.4137 + 15.1233 = 25.54
  assert.equal(res.fullCycleNetAccrual, 25.54);
  assert.equal(res.projectedRemainingEndOfCycle, 15.54);
});

test('Saudi Article 116 exempts first 20 approved unpaid leave days while deducting unauthorized absence 100%', () => {
  // 15 approved unpaid days in Saudi -> 0 deducted
  const under20 = computeEffectiveUnpaidDays({
    law: 'saudi_citizen',
    approvedUnpaidLeaveDays: 15,
    unauthorizedAbsenceDays: 0,
    applyArt116Exempt20: true,
  });
  assert.equal(under20.exemptApprovedDays, 15);
  assert.equal(under20.totalEffectiveDeductedDays, 0);

  // 35 approved unpaid days + 3 unauthorized days in Saudi -> 20 exempt, 15+3 = 18 deducted
  const over20 = computeEffectiveUnpaidDays({
    law: 'saudi_expat',
    approvedUnpaidLeaveDays: 35,
    unauthorizedAbsenceDays: 3,
    applyArt116Exempt20: true,
  });
  assert.equal(over20.exemptApprovedDays, 20);
  assert.equal(over20.effectiveApprovedDeductedDays, 15);
  assert.equal(over20.totalEffectiveDeductedDays, 18);

  // With Article 116 disabled (contractual deduction from day 1) -> all 38 deducted
  const strict = computeEffectiveUnpaidDays({
    law: 'saudi_citizen',
    approvedUnpaidLeaveDays: 35,
    unauthorizedAbsenceDays: 3,
    applyArt116Exempt20: false,
  });
  assert.equal(strict.exemptApprovedDays, 0);
  assert.equal(strict.totalEffectiveDeductedDays, 38);

  // Jordan & Palestine do not have Saudi Article 116 20-day rule
  const jordan = computeEffectiveUnpaidDays({
    law: 'jordan',
    approvedUnpaidLeaveDays: 35,
    unauthorizedAbsenceDays: 3,
    applyArt116Exempt20: true,
  });
  assert.equal(jordan.art116Applied, false);
  assert.equal(jordan.exemptApprovedDays, 0);
  assert.equal(jordan.totalEffectiveDeductedDays, 38);

  // Settlement resignation at 5y: 15 approved unpaid days under Art 116 keeps 2/3 bracket intact
  const s = getDefaultSettlement('saudi_citizen');
  s.hireDate = '2020-01-01';
  s.endDate = '2024-12-31';
  s.terminationType = 'qiwa_resignation';
  s.approvedUnpaidLeaveDays = 15;
  s.unauthorizedAbsenceDays = 0;
  s.applyArt116Exempt20 = true;
  const sRes = calculateSettlement(s);
  assert.equal(sRes.tenure.years, 5);
  assert.equal(sRes.entitlementRatio, 2 / 3);

  // Detailed leave with 35 approved unpaid days under Saudi Art 116 deducts 15 * (30/365) = 1.23 days
  const leaveSim = getDefaultLeaveSim('saudi_citizen');
  leaveSim.hireDate = '2020-01-01';
  leaveSim.asOfDate = '2026-11-16';
  leaveSim.takenDays = 0;
  leaveSim.approvedUnpaidLeaveDaysThisYear = 35;
  leaveSim.unauthorizedAbsenceDaysThisYear = 0;
  leaveSim.applyArt116Exempt20ForLeave = true;
  const lRes = calculateDetailedLeave(leaveSim);
  assert.equal(lRes.unpaidBreakdown.totalEffectiveDeductedDays, 15);
  assert.equal(lRes.unpaidDaysDeductedLeave, roundHalala((15 * 30) / 365));
});


