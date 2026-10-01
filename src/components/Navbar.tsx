import React, { useState } from 'react';
import { 
  Users, 
  ClipboardCheck, 
  HelpCircle, 
  Award, 
  GitCompare, 
  BookOpen, 
  UserPlus, 
  FileText,
  MapPin
} from 'lucide-react';
import { 
  PLATFORM_NAME,
  PLATFORM_LOGO_URL, 
  PLATFORM_LOGO_FALLBACK, 
  PLATFORM_LOCATION 
} from '../data/constants';

export type NavTab = 
  | 'pipeline' 
  | 'live_scorecard' 
  | 'questions' 
  | 'practical_test' 
  | 'comparison' 
  | 'rubric_guide';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenNewCandidate: () => void;
  onOpenReport: () => void;
  candidatesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewCandidate,
  onOpenReport,
  candidatesCount,
}) => {
  const [logoSrc, setLogoSrc] = useState(PLATFORM_LOGO_URL);

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'pipeline', label: 'المرشحون والتعيينات', icon: Users },
    { id: 'live_scorecard', label: 'نموذج التقييم الحي', icon: ClipboardCheck },
    { id: 'questions', label: 'بنك المواقف والأسئلة', icon: HelpCircle },
    { id: 'practical_test', label: 'المحاكي العملي', icon: Award },
    { id: 'comparison', label: 'مقارنة المرشحين', icon: GitCompare },
    { id: 'rubric_guide', label: 'دليل المعايير والأوزان', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Zone 1: Platform Logo & Title (Single-line, no wrapping) */}
          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab('pipeline'); }}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              {/* Refined App Icon Logo */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 shadow-xs border border-slate-200/80 bg-[#25a9e0] flex items-center justify-center p-0.5">
                <img
                  src={logoSrc}
                  onError={() => {
                    if (logoSrc !== PLATFORM_LOGO_FALLBACK) {
                      setLogoSrc(PLATFORM_LOGO_FALLBACK);
                    }
                  }}
                  alt={PLATFORM_NAME}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Perfectly Aligned Text Lockup */}
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 whitespace-nowrap leading-none">
                    {PLATFORM_NAME}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 whitespace-nowrap">
                    <MapPin className="w-3 h-3 text-emerald-600 inline" />
                    الإسكندرية
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-semibold whitespace-nowrap mt-1 leading-none">
                  قسم جودة المحتوى التعليمي
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.id === 'pipeline' && (
                    <span className="text-xs tabular-nums text-slate-400 font-normal mr-1">
                      ({candidatesCount})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenReport}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title="عرض تقرير التعيين والاعتماد"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>تقرير الاعتماد</span>
            </button>
            <button
              onClick={onOpenNewCandidate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة مرشح</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

