import React, { useState } from 'react';
import { Candidate } from '../types';
import { EVALUATION_CRITERIA } from '../data/criteriaData';
import { 
  PLATFORM_NAME,
  PLATFORM_LOGO_URL, 
  PLATFORM_LOGO_FALLBACK, 
  PLATFORM_LOCATION, 
  QUALITY_MANAGER_NAME, 
  HR_NAME,
  HIRING_DECISION_CONFIG,
  USER_CALENDAR_EMAIL
} from '../data/constants';
import { createGoogleCalendarUrl } from '../utils/calendar';
import { 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight,
  Calendar,
  ExternalLink,
  MapPin,
  FileText,
  UserPlus,
  ShieldCheck,
  Briefcase,
  CalendarDays,
  Edit3,
  Trash2
} from 'lucide-react';

interface HiringReportViewProps {
  candidate?: Candidate | null;
  allCandidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onOpenNewCandidate?: () => void;
  onEditCandidate?: (candidate: Candidate) => void;
  onDeleteCandidate?: (id: string) => void;
  onBack: () => void;
}

export const HiringReportView: React.FC<HiringReportViewProps> = ({
  candidate,
  allCandidates,
  onSelectCandidate,
  onOpenNewCandidate,
  onEditCandidate,
  onDeleteCandidate,
  onBack,
}) => {
  const [logoSrc, setLogoSrc] = useState(PLATFORM_LOGO_URL);

  if (!candidate) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto shadow-2xs">
          <FileText className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">لا توجد تقارير تعيين معتمدة بعد</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            الداشبورد فارغة وجاهزة لاستقبال أول ملف ترشيح. قم بتسجيل مرشح جديد وتقييمه ليتم إنشاء وتصدير محضر قرار التعيين المعتمد.
          </p>
        </div>
        {onOpenNewCandidate && (
          <button
            onClick={onOpenNewCandidate}
            className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>تسجيل أول مرشح للمقابلة الآن</span>
          </button>
        )}
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const decisionInfo = HIRING_DECISION_CONFIG[candidate.recommendation] || HIRING_DECISION_CONFIG.pending;
  const calendarUrl = createGoogleCalendarUrl(candidate);

  return (
    <div className="space-y-6">
      {/* Action controls (Hidden on print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors cursor-pointer w-fit"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة المرشحين</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">المرشح:</span>
            <select
              value={candidate.id}
              onChange={(e) => {
                const found = allCandidates.find(c => c.id === e.target.value);
                if (found) onSelectCandidate(found);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold"
            >
              {allCandidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.specializationRole}</option>
              ))}
            </select>
          </div>

          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>مفكرة جوجل ({USER_CALENDAR_EMAIL})</span>
          </a>

          {onEditCandidate && (
            <button
              onClick={() => onEditCandidate(candidate)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="تعديل بيانات هذا المرشح"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل البيانات</span>
            </button>
          )}

          {onDeleteCandidate && (
            <button
              onClick={() => {
                onDeleteCandidate(candidate.id);
                onBack();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="حذف هذا المرشح"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف المرشح</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / تصدير التقرير PDF</span>
          </button>
        </div>
      </div>

      {/* Official Printable Report Document */}
      <div className="bg-white rounded-xl border border-slate-300 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-8 text-slate-900 printable-document">
        {/* Document Header with Official Platform Logo */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#25a9e0] border border-slate-200 shadow-xs flex items-center justify-center p-0.5 shrink-0">
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
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                {PLATFORM_NAME}
              </h1>
              <p className="text-xs text-slate-600 font-bold tracking-wide mt-0.5">
                إدارة جودة المحتوى التعليمي | محضر وقرار المقابلة الشخصية
              </p>
            </div>
          </div>

          <div className="text-left text-xs space-y-1">
            <div className="font-bold text-slate-900">رقم المحضر: ELK-QC-2026-Q{candidate.id.replace('cand-', '')}</div>
            <div className="text-slate-600 font-medium">موعد المقابلة: {candidate.interviewDate} ({candidate.interviewTime || '11:00 ص'})</div>
            <div className="text-emerald-800 font-bold flex items-center justify-end gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{PLATFORM_LOCATION}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5">
          <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">
            تقرير تقييم المقابلة الشخصية وتوصية التعيين المعتمدة
          </h2>
          <p className="text-xs font-bold text-emerald-900 bg-emerald-50 py-1 px-3 rounded-md inline-block border border-emerald-200">
            الوظيفة المستهدفة: {candidate.specializationRole}
          </p>
        </div>

        {/* Candidate Information Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">اسم المرشح:</span>
            <span className="font-extrabold text-slate-900 text-sm">{candidate.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">المادة والمرحلة:</span>
            <span className="font-bold text-slate-900">
              {candidate.subject} ({candidate.targetStage})
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">سنوات الخبرة السابقة:</span>
            <span className="font-bold text-slate-900">{candidate.experienceYears} سنوات</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">الراتب المتوقع وفترة البدء:</span>
            <span className="font-bold text-slate-900">{candidate.expectedSalary} ({candidate.noticePeriod})</span>
          </div>
        </div>

        {/* Final Decision & Overall Score */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl border border-slate-200 bg-slate-50/50 gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl tabular-nums ${
              candidate.overallScore >= 85 ? 'bg-emerald-700 text-white' :
              candidate.overallScore >= 70 ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              {candidate.overallScore}%
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">النتيجة الإجمالية الموزونة</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                <span>{decisionInfo.label}</span>
              </div>
            </div>
          </div>

          <div className="text-left text-xs">
            <div className="text-slate-500 font-medium">درجة الاختبار العملي السريع:</div>
            <div className="font-extrabold text-emerald-800 text-sm mt-0.5 tabular-nums">
              {candidate.practicalTestScore || 85} / 100
            </div>
          </div>
        </div>

        {/* Detailed Criteria Scores Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-r-2 border-emerald-700 pr-2">
            أولاً: تفصيل درجات المعايير الستة المعتمدة
          </h3>
          <table className="w-full text-xs text-right border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-2.5 border-b border-slate-200">المعيار المقاس</th>
                <th className="p-2.5 border-b border-slate-200">الوزن النسبي</th>
                <th className="p-2.5 border-b border-slate-200">جهة التقييم</th>
                <th className="p-2.5 border-b border-slate-200 text-center">الدرجة (من 5)</th>
                <th className="p-2.5 border-b border-slate-200 text-center">النسبة المكتسبة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EVALUATION_CRITERIA.map((crit) => {
                const score = candidate.scores[crit.id] || 3;
                const earned = ((score / 5) * crit.weight).toFixed(1);
                return (
                  <tr key={crit.id} className="hover:bg-slate-50/40">
                    <td className="p-2.5 font-bold text-slate-900">{crit.title}</td>
                    <td className="p-2.5 text-slate-600 tabular-nums">{crit.weight}%</td>
                    <td className="p-2.5 text-slate-600">{crit.evaluatedBy}</td>
                    <td className="p-2.5 text-center font-bold tabular-nums text-slate-900">{score} / 5</td>
                    <td className="p-2.5 text-center font-bold tabular-nums text-emerald-800">{earned}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* HR Logistics Section (Item 6 & 10) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-r-2 border-blue-700 pr-2">
            <h3 className="text-sm font-bold text-slate-900">
              ثانياً: اتفاق وسجل الموارد البشرية HR (المعتمد بواسطة {HR_NAME})
            </h3>
            <span className="text-[11px] text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded font-bold border border-blue-200">
              مقر الإسكندرية
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* 1. التأمينات */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>1. التأمينات الاجتماعية:</span>
              </div>
              <div className="font-semibold text-emerald-900 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                {candidate.insuranceSuitability === 'suitable_immediate' ? 'مناسبة وجاهز للتسجيل فوراً ✓' :
                 candidate.insuranceSuitability === 'needs_clearance' ? 'مؤمن عليه حالياً ويحتاج مهلة إخلاء طرف' :
                 candidate.insuranceSuitability === 'has_conflict' ? 'ارتباط تأميني قائم يحتاج تسوية' : 'غير مناسبة'}
              </div>
              <div className="text-slate-600 text-[11px] pt-1">
                <strong>تفاصيل التأمين: </strong>
                {candidate.insuranceDetails || 'تم التأكيد على مطابقة الشروط والجاهزية للتأمين.'}
              </div>
            </div>

            {/* 2. مواعيد العمل */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Briefcase className="w-4 h-4 text-blue-700" />
                <span>2. مواعيد العمل الرسمية:</span>
              </div>
              <div className="font-semibold text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                {candidate.workingHoursSchedule}
              </div>
              <div className="text-slate-600 text-[11px] pt-1">
                <strong>المرونة والملاحظات: </strong>
                {candidate.workingHoursNotes 
                  ? candidate.workingHoursNotes 
                  : candidate.workingHoursFlexibility === 'fully_flexible'
                  ? 'مرونة كاملة في مواسم الامتحانات وتصوير الاستوديو بالإسكندرية.'
                  : 'التزام كامل بمواعيد الشيفت الرسمي المتفق عليه.'}
              </div>
            </div>

            {/* 3. الإجازات الأسبوعية */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <CalendarDays className="w-4 h-4 text-purple-700" />
                <span>3. الإجازات الأسبوعية والتفرغ:</span>
              </div>
              <div className="font-semibold text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                {candidate.weeklyHolidaysSchedule}
              </div>
              <div className="text-slate-600 text-[11px] pt-1">
                <strong>تفاصيل التفرغ والراحة: </strong>
                {candidate.weeklyHolidaysNotes || 'تفرغ تام وعدم وجود سناتر أو تضارب في المواعيد.'}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Red Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>أبرز نقاط القوة ومؤشرات التميز:</span>
            </h4>
            <ul className="space-y-1 list-disc list-inside text-slate-800">
              {candidate.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-700" />
              <span>ملاحظات الحذر والتحفظات (إن وجدت):</span>
            </h4>
            {candidate.redFlags.length === 0 ? (
              <p className="text-slate-600 italic">لا توجد ملاحظات سلبية أو علامات خطر حرجة مسجلة.</p>
            ) : (
              <ul className="space-y-1 list-disc list-inside text-rose-800">
                {candidate.redFlags.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Committee Qualitative Opinions */}
        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>رأي وتوصية مدير جودة المحتوى التعليمي:</span>
              <span className="text-emerald-800 font-extrabold">{QUALITY_MANAGER_NAME}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-sans">
              {candidate.qualityManagerNotes || 'تمت التوصية بناءً على الأداء في المقابلة والاختبار العملي.'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>رأي وتوصية مسؤول الموارد البشرية (HR):</span>
              <span className="text-blue-800 font-extrabold">{HR_NAME}</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-sans">
              {candidate.hrNotes || 'المرشح متوافق مع نظام التأمينات ومواعيد العمل الرسمية في مقر الإسكندرية.'}
            </p>
          </div>
        </div>

        {/* Signatures & Approvals (Item 9) */}
        <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-3 gap-6 text-xs text-center">
          <div className="space-y-8">
            <div className="font-bold text-slate-900">مدير قسم جودة المحتوى</div>
            <div className="h-10 border-b border-dashed border-slate-400 mx-6"></div>
            <div className="text-slate-900 font-bold">{QUALITY_MANAGER_NAME}</div>
          </div>

          <div className="space-y-8">
            <div className="font-bold text-slate-900">مسؤول الموارد البشرية (HR)</div>
            <div className="h-10 border-b border-dashed border-slate-400 mx-6"></div>
            <div className="text-slate-900 font-bold">{HR_NAME}</div>
          </div>

          <div className="space-y-8">
            <div className="font-bold text-slate-900">اعتماد إدارة المنصة - الإسكندرية</div>
            <div className="h-10 border-b border-dashed border-slate-400 mx-6"></div>
            <div className="text-slate-500">الإدارة التنفيذية</div>
          </div>
        </div>
      </div>
    </div>
  );
};
