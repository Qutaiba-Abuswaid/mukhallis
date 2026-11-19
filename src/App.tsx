import { useCallback, useEffect, useState } from 'react';
import { DataIOTab } from './components/DataIOTab';
import { EmployeesTab, NewEmployeeDraft } from './components/EmployeesTab';
import { Header, WorkspaceTabId } from './components/Header';
import { LawsTab } from './components/LawsTab';
import { LeavesTab } from './components/LeavesTab';
import { MorningReminderModal } from './components/MorningReminderModal';
import { SettlementTab } from './components/SettlementTab';
import {
  DEFAULT_EMPLOYEES,
  Employee,
  getDefaultLeaveSim,
  getDefaultSettlement,
  LAW_PROFILES,
  LawId,
  LeaveSimInput,
  normalizeLawId,
  SettlementInput,
} from './utils/qiwaMath';

const STORAGE_KEY = 'mukhallis_hr_workspace_v2';
const LEGACY_STORAGE_KEY = 'mukhallis_hr_workspace_v1';

interface WorkspaceState {
  activeLaw: LawId;
  activeTab: WorkspaceTabId;
  employees: Employee[];
  settlement: SettlementInput;
  leaveSim: LeaveSimInput;
}

const VALID_TABS: WorkspaceTabId[] = ['settlement', 'leaves', 'employees', 'laws', 'io'];

function getDefaultState(): WorkspaceState {
  return {
    activeLaw: 'saudi_citizen',
    activeTab: 'settlement',
    employees: DEFAULT_EMPLOYEES,
    settlement: getDefaultSettlement('saudi_citizen'),
    leaveSim: getDefaultLeaveSim('saudi_citizen'),
  };
}

function loadState(): WorkspaceState {
  const fallback = getDefaultState();
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);

    const activeLaw = normalizeLawId(parsed.activeLaw);
    const activeTab: WorkspaceTabId = VALID_TABS.includes(parsed.activeTab)
      ? parsed.activeTab
      : 'settlement';

    const employees: Employee[] = Array.isArray(parsed.employees)
      ? parsed.employees.map((emp: Record<string, unknown>, idx: number) => ({
          id: String(emp.id || `emp-${idx}`),
          name: String(emp.name || `موظف ${idx + 1}`),
          role: String(emp.role || 'موظف'),
          law: normalizeLawId(String(emp.law || '')),
          department: String(emp.department || 'عام'),
          hireDate: String(emp.hireDate || '2023-01-01'),
          basicSalary: Number(emp.basicSalary) || 0,
          fixedAllowances: Number(emp.fixedAllowances) || 0,
          annualLeaveEntitlement: Number(emp.annualLeaveEntitlement) || 14,
          takenLeaveDays: Number(emp.takenLeaveDays) || 0,
          note: String(emp.note || ''),
          reminderTime: String(emp.reminderTime || '08:30'),
          reminderActive: emp.reminderActive !== undefined ? Boolean(emp.reminderActive) : true,
          lastNotifiedDate: String(emp.lastNotifiedDate || ''),
        }))
      : fallback.employees;

    const parsedSettlement = (parsed.settlement || {}) as Partial<SettlementInput>;
    const mergedSettlement: SettlementInput = {
      ...getDefaultSettlement(activeLaw),
      ...parsedSettlement,
      unauthorizedAbsenceDays:
        parsedSettlement.unauthorizedAbsenceDays ??
        (parsedSettlement.approvedUnpaidLeaveDays === undefined
          ? (parsedSettlement.unpaidDays ?? 0)
          : 0),
      approvedUnpaidLeaveDays: parsedSettlement.approvedUnpaidLeaveDays ?? 0,
      unpaidDays: 0,
    };
    mergedSettlement.law = normalizeLawId(mergedSettlement.law);
    mergedSettlement.saudiContractType =
      mergedSettlement.saudiContractType === 'indefinite' ? 'indefinite' : 'fixed_term';

    const parsedLeaveSim = (parsed.leaveSim || {}) as Partial<LeaveSimInput>;
    const mergedLeaveSim: LeaveSimInput = {
      ...fallback.leaveSim,
      ...parsedLeaveSim,
      unauthorizedAbsenceDaysThisYear:
        parsedLeaveSim.unauthorizedAbsenceDaysThisYear ??
        (parsedLeaveSim.approvedUnpaidLeaveDaysThisYear === undefined
          ? (parsedLeaveSim.unpaidDaysThisYear ?? 0)
          : 0),
      approvedUnpaidLeaveDaysThisYear: parsedLeaveSim.approvedUnpaidLeaveDaysThisYear ?? 0,
      unpaidDaysThisYear: 0,
    };
    mergedLeaveSim.law = normalizeLawId(mergedLeaveSim.law);

    return {
      activeLaw,
      activeTab,
      employees,
      settlement: mergedSettlement,
      leaveSim: mergedLeaveSim,
    };
  } catch {
    return fallback;
  }
}

function getDueMorningNotes(employees: Employee[], includeAllActive = false): Employee[] {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return employees.filter((emp) => {
    if (!emp.reminderActive || !emp.note || !emp.note.trim()) return false;
    if (includeAllActive) return true;
    const targetTime = emp.reminderTime || '08:30';
    return currentHHMM >= targetTime && emp.lastNotifiedDate !== todayStr;
  });
}

function triggerBrowserNotification(notes: Employee[]) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted' || notes.length === 0) return;

  const summaryBody = notes
    .slice(0, 3)
    .map((n) => `• ${n.name}: ${n.note}`)
    .join('\n');

  try {
    new Notification(`مُخلّص HR — تنبيه الملاحظات الصباحية (${notes.length})`, {
      body: summaryBody,
    });
  } catch {
    // Ignore restricted Notification constructor environments
  }
}

export default function App() {
  const [state, setState] = useState<WorkspaceState>(() => loadState());
  const [morningAlertOpen, setMorningAlertOpen] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported',
  );

  // Persist workspace to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Scheduled 08:30 morning reminder checker
  const checkScheduledReminders = useCallback(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setState((prev) => {
      const due = getDueMorningNotes(prev.employees, false);
      if (due.length === 0) return prev;
      triggerBrowserNotification(due);
      setMorningAlertOpen(true);
      const dueIds = new Set(due.map((d) => d.id));
      return {
        ...prev,
        employees: prev.employees.map((emp) =>
          dueIds.has(emp.id) ? { ...emp, lastNotifiedDate: todayStr } : emp,
        ),
      };
    });
  }, []);

  useEffect(() => {
    checkScheduledReminders();
    const interval = window.setInterval(checkScheduledReminders, 30000);
    return () => window.clearInterval(interval);
  }, [checkScheduledReminders]);

  const activeNotes = getDueMorningNotes(state.employees, true);

  const handleSelectLaw = (lawId: LawId) => {
    if (!LAW_PROFILES[lawId]) return;
    const isSaudi = lawId === 'saudi_citizen' || lawId === 'saudi_expat';
    setState((prev) => {
      let terminationType = prev.settlement.terminationType;
      if (isSaudi && !terminationType.startsWith('qiwa_')) {
        terminationType =
          terminationType === 'resignation'
            ? 'qiwa_resignation'
            : terminationType === 'gross_misconduct'
              ? 'qiwa_art80'
              : 'qiwa_art74_2';
      } else if (!isSaudi && terminationType.startsWith('qiwa_')) {
        terminationType =
          terminationType === 'qiwa_resignation'
            ? 'resignation'
            : terminationType === 'qiwa_art80'
              ? 'gross_misconduct'
              : 'termination_without_cause';
      }
      return {
        ...prev,
        activeLaw: lawId,
        settlement: {
          ...prev.settlement,
          law: lawId,
          noticeDays: isSaudi ? 60 : 30,
          terminationType,
        },
        leaveSim: {
          ...prev.leaveSim,
          law: lawId,
        },
      };
    });
  };

  const handleSelectTab = (tabId: WorkspaceTabId) => {
    setState((prev) => ({ ...prev, activeTab: tabId }));
  };

  const handleUpdateSettlementField = <K extends keyof SettlementInput>(
    field: K,
    value: SettlementInput[K],
  ) => {
    if (field === 'law') {
      handleSelectLaw(value as LawId);
      return;
    }
    setState((prev) => ({
      ...prev,
      settlement: {
        ...prev.settlement,
        [field]: value,
      },
    }));
  };

  const handleResetSettlement = () => {
    setState((prev) => ({
      ...prev,
      settlement: getDefaultSettlement(prev.activeLaw),
    }));
  };

  const handleLeaveLawChange = (lawId: LawId) => {
    setState((prev) => ({
      ...prev,
      activeLaw: lawId,
      leaveSim: {
        ...prev.leaveSim,
        law: lawId,
      },
    }));
  };

  const handleLoadEmployeeIntoLeaves = (empId: string) => {
    const emp = state.employees.find((e) => e.id === empId);
    if (!emp) return;
    const totalWage = (Number(emp.basicSalary) || 0) + (Number(emp.fixedAllowances) || 0);
    setState((prev) => ({
      ...prev,
      activeLaw: emp.law,
      leaveSim: {
        ...prev.leaveSim,
        law: emp.law,
        employeeName: emp.name,
        hireDate: emp.hireDate || prev.leaveSim.hireDate,
        takenDays: Number(emp.takenLeaveDays) || 0,
        dailyWageForValuation: Math.round((totalWage / 30) * 100) / 100,
        useLawDefaultEntitlement: true,
      },
    }));
  };

  const handleUpdateLeaveField = <K extends keyof LeaveSimInput>(
    field: K,
    value: LeaveSimInput[K],
  ) => {
    setState((prev) => ({
      ...prev,
      leaveSim: {
        ...prev.leaveSim,
        [field]: value,
      },
    }));
  };

  const handleAddEmployee = (draft: NewEmployeeDraft) => {
    const created: Employee = {
      id: `emp-${Date.now()}`,
      name: draft.name.trim(),
      role: draft.role.trim() || 'موظف',
      law: draft.law,
      department: draft.department.trim() || 'عام',
      hireDate: draft.hireDate || '2023-01-01',
      basicSalary: Number(draft.basicSalary) || 0,
      fixedAllowances: Number(draft.fixedAllowances) || 0,
      annualLeaveEntitlement: Number(draft.annualLeaveEntitlement) || 14,
      takenLeaveDays: Number(draft.takenLeaveDays) || 0,
      note: draft.note.trim(),
      reminderTime: draft.reminderTime || '08:30',
      reminderActive: true,
      lastNotifiedDate: '',
    };

    setState((prev) => ({
      ...prev,
      employees: [created, ...prev.employees],
    }));
    setStatusBanner({ text: `تمت إضافة الموظف "${created.name}" بنجاح.`, type: 'success' });
  };

  const handleUpdateEmployeeNote = (empId: string, note: string) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((emp) =>
        emp.id === empId ? { ...emp, note, lastNotifiedDate: '' } : emp,
      ),
    }));
  };

  const handleUpdateEmployeeReminderTime = (empId: string, reminderTime: string) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((emp) =>
        emp.id === empId
          ? { ...emp, reminderTime: reminderTime || '08:30', lastNotifiedDate: '' }
          : emp,
      ),
    }));
  };

  const handleToggleEmployeeReminder = (empId: string, reminderActive: boolean) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((emp) =>
        emp.id === empId ? { ...emp, reminderActive } : emp,
      ),
    }));
  };

  const handleDeleteEmployee = (empId: string) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp.id !== empId),
    }));
  };

  const handleLoadEmployeeIntoSettlement = (empId: string) => {
    const emp = state.employees.find((e) => e.id === empId);
    if (!emp) return;
    const leaveLeft = Math.max(
      0,
      (Number(emp.annualLeaveEntitlement) || 0) - (Number(emp.takenLeaveDays) || 0),
    );
    const isSaudi = emp.law === 'saudi_citizen' || emp.law === 'saudi_expat';
    setState((prev) => ({
      ...prev,
      activeLaw: emp.law,
      activeTab: 'settlement',
      settlement: {
        ...prev.settlement,
        employeeName: emp.name,
        law: emp.law,
        hireDate: emp.hireDate || '2022-01-01',
        endDate: new Date().toISOString().slice(0, 10),
        basicSalary: Number(emp.basicSalary) || 0,
        fixedAllowances: Number(emp.fixedAllowances) || 0,
        remainingLeaveDays: leaveLeft,
        noticeDays: isSaudi ? 60 : 30,
        terminationType: isSaudi ? 'qiwa_art74_2' : 'termination_without_cause',
      },
    }));
  };

  const handlePreviewMorningAlert = () => {
    setMorningAlertOpen(true);
    if (activeNotes.length > 0) {
      triggerBrowserNotification(activeNotes);
    }
  };

  const handleRequestNotificationPermission = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setStatusBanner({
        text: 'هذا المتصفح لا يدعم إشعارات النظام؛ ستعمل التنبيهات الصباحية داخل التطبيق الساعة 08:30.',
        type: 'error',
      });
      return;
    }
    Notification.requestPermission()
      .then((perm) => {
        setNotifPermission(perm);
        if (perm === 'granted') {
          setStatusBanner({
            text: 'تم تفعيل إشعارات المتصفح لتنبيه الساعة 08:30 صباحاً.',
            type: 'success',
          });
        } else {
          setStatusBanner({
            text: 'لم يتم منح إذن إشعارات المتصفح؛ يمكنك الاعتماد على نافذة التنبيه داخل التطبيق.',
            type: 'error',
          });
        }
      })
      .catch(() => {
        setStatusBanner({
          text: 'تعذر طلب إذن الإشعارات في هذا المتصفح.',
          type: 'error',
        });
      });
  };

  const triggerDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'مُخلّص HR',
      ...state,
    };
    triggerDownload(
      `mukhallis-hr-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(payload, null, 2),
      'application/json;charset=utf-8',
    );
    setStatusBanner({ text: 'تم تصدير النسخة الاحتياطية الكاملة (JSON) بنجاح.', type: 'success' });
  };

  const handleExportCSV = () => {
    const headers = [
      'id',
      'name',
      'role',
      'law',
      'department',
      'hireDate',
      'basicSalary',
      'fixedAllowances',
      'annualLeaveEntitlement',
      'takenLeaveDays',
      'note',
      'reminderTime',
    ];
    const escapeCSV = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = [
      headers.join(','),
      ...state.employees.map((emp) =>
        headers.map((h) => escapeCSV(emp[h as keyof Employee])).join(','),
      ),
    ];
    triggerDownload(
      `mukhallis-hr-employees-${new Date().toISOString().slice(0, 10)}.csv`,
      '\uFEFF' + rows.join('\n'),
      'text/csv;charset=utf-8',
    );
    setStatusBanner({
      text: 'تم تصدير قائمة الموظفين بصيغة CSV متوافقة مع Excel.',
      type: 'success',
    });
  };

  const handleImportParsed = (
    parsed: {
      employees: Employee[];
      settlement: Partial<SettlementInput> | null;
      leaveSim: Partial<LeaveSimInput> | null;
    },
    sourceLabel: string,
  ) => {
    setState((prev) => ({
      ...prev,
      employees: parsed.employees,
      settlement: parsed.settlement ? { ...prev.settlement, ...parsed.settlement } : prev.settlement,
      leaveSim: parsed.leaveSim ? { ...prev.leaveSim, ...parsed.leaveSim } : prev.leaveSim,
    }));
    setStatusBanner({
      text: `تم تحميل ${parsed.employees.length} سجل موظف بنجاح ${sourceLabel}.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeLaw={state.activeLaw}
        activeTab={state.activeTab}
        activeNotesCount={activeNotes.length}
        notifPermission={notifPermission}
        onSelectLaw={handleSelectLaw}
        onSelectTab={handleSelectTab}
        onPreviewMorningAlert={handlePreviewMorningAlert}
        onRequestNotificationPermission={handleRequestNotificationPermission}
      />

      {statusBanner && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 no-print">
          <div
            role="status"
            className={`rounded-xl px-4 py-3 text-xs sm:text-sm font-bold flex items-center justify-between border ${
              statusBanner.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <span>{statusBanner.text}</span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-xs underline cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {state.activeTab === 'settlement' && (
          <SettlementTab
            settlement={state.settlement}
            onUpdateField={handleUpdateSettlementField}
            onReset={handleResetSettlement}
          />
        )}

        {state.activeTab === 'leaves' && (
          <LeavesTab
            leaveSim={state.leaveSim}
            employees={state.employees}
            onChangeLaw={handleLeaveLawChange}
            onUpdateField={handleUpdateLeaveField}
            onLoadEmployee={handleLoadEmployeeIntoLeaves}
          />
        )}

        {state.activeTab === 'employees' && (
          <EmployeesTab
            activeLaw={state.activeLaw}
            employees={state.employees}
            onAddEmployee={handleAddEmployee}
            onUpdateNote={handleUpdateEmployeeNote}
            onUpdateReminderTime={handleUpdateEmployeeReminderTime}
            onToggleReminder={handleToggleEmployeeReminder}
            onDeleteEmployee={handleDeleteEmployee}
            onLoadIntoSettlement={handleLoadEmployeeIntoSettlement}
            onPreviewMorningAlert={handlePreviewMorningAlert}
          />
        )}

        {state.activeTab === 'laws' && (
          <LawsTab activeLaw={state.activeLaw} onSelectLaw={handleSelectLaw} />
        )}

        {state.activeTab === 'io' && (
          <DataIOTab
            employees={state.employees}
            onExportJSON={handleExportJSON}
            onExportCSV={handleExportCSV}
            onImportParsed={handleImportParsed}
            onImportError={(msg) => setStatusBanner({ text: msg, type: 'error' })}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        مُخلّص HR — منصة مستقلة لحساب المخالصات والإجازات ومتابعة الموظفين (الأردن • السعودية للسعوديين
        والأجانب • فلسطين)
      </footer>

      <MorningReminderModal
        open={morningAlertOpen}
        notes={activeNotes}
        onClose={() => setMorningAlertOpen(false)}
      />
    </div>
  );
}
