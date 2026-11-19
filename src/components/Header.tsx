import React from 'react';
import { LAW_PROFILES, LawId } from '../utils/qiwaMath';

export type WorkspaceTabId = 'settlement' | 'leaves' | 'employees' | 'laws' | 'io';

interface HeaderProps {
  activeLaw: LawId;
  activeTab: WorkspaceTabId;
  activeNotesCount: number;
  notifPermission: NotificationPermission | 'unsupported';
  onSelectLaw: (lawId: LawId) => void;
  onSelectTab: (tabId: WorkspaceTabId) => void;
  onPreviewMorningAlert: () => void;
  onRequestNotificationPermission: () => void;
}

const TABS: { id: WorkspaceTabId; label: string; icon: string }[] = [
  { id: 'settlement', label: '1. حاسبة المخالصات المالية', icon: '💼' },
  { id: 'leaves', label: '2. حاسبة الإجازات الشهرية', icon: '📅' },
  { id: 'employees', label: '3. الموظفون وتنبيه 8:30 ص', icon: '👥' },
  { id: 'laws', label: '4. مرجع القوانين المنفصلة', icon: '⚖️' },
  { id: 'io', label: '5. تحميل وتصدير البيانات', icon: '📥' },
];

export const Header: React.FC<HeaderProps> = ({
  activeLaw,
  activeTab,
  activeNotesCount,
  notifPermission,
  onSelectLaw,
  onSelectTab,
  onPreviewMorningAlert,
  onRequestNotificationPermission,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 lg:sticky lg:top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-xl shadow-sm shrink-0">
              مُخ
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">مُخلّص HR</h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap">
                  نسخة قوى المدققة + محدد / غير محدد المدة
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                إدارة مستقلة لقوانين العمل (الأردن • السعودية • فلسطين) مع تنبيهات الملاحظات اليومية الساعة 08:30 صباحاً
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onPreviewMorningAlert}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <span aria-hidden="true">⏰</span>
              <span>تنبيه 8:30 ص ({activeNotesCount})</span>
            </button>

            <button
              type="button"
              onClick={onRequestNotificationPermission}
              title="تفعيل إشعارات المتصفح الساعة 8:30 صباحاً"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <span aria-hidden="true">🔔</span>
              <span>{notifPermission === 'granted' ? 'الإشعارات مفعّلة' : 'تفعيل الإشعارات'}</span>
            </button>
          </div>
        </div>

        {/* Separate Law Switcher */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 shrink-0">
            <span>القانون النشط للمرجعية والحسابات:</span>
          </div>
          <div
            className="grid grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-2"
            role="group"
            aria-label="اختيار قانون العمل"
          >
            {Object.values(LAW_PROFILES).map((law) => {
              const selected = activeLaw === law.id;
              return (
                <button
                  key={law.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelectLaw(law.id)}
                  className={`px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer sm:whitespace-nowrap ${
                    selected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ${selected ? 'bg-white' : law.dotClass}`}
                    aria-hidden="true"
                  />
                  <span>{law.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="أقسام المنصة">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="ml-1" aria-hidden="true">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
