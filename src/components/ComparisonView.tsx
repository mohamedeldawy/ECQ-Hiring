import React, { useState } from 'react';
import { Candidate } from '../types';
import { EVALUATION_CRITERIA } from '../data/criteriaData';
import { HIRING_DECISION_CONFIG, USER_CALENDAR_EMAIL } from '../data/constants';
import { createGoogleCalendarUrl } from '../utils/calendar';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Calendar,
  Clock,
  UserPlus,
  ShieldCheck
} from 'lucide-react';

interface ComparisonViewProps {
  candidates: Candidate[];
  onViewReport: (candidate: Candidate) => void;
  onOpenScorecard: (candidate: Candidate) => void;
  onOpenNewCandidate?: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  candidates,
  onViewReport,
  onOpenScorecard,
  onOpenNewCandidate,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    candidates.slice(0, 3).map(c => c.id)
  );

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto shadow-2xs">
          <GitCompare className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">لا يوجد مرشحون للمقارنة حالياً</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            الداشبورد فارغة وجاهزة لاستقبال أول ملف ترشيح. قم بتسجيل مرشحين جدد للبدء في المفاضلة والمقارنة المباشرة بين الكفاءات.
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

  const toggleSelectCandidate = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedCandidates = candidates.filter(c => selectedIds.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 md:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-1">
              <GitCompare className="w-4 h-4" />
              <span>مصفوفة المفاضلة والمقارنة المباشرة | قسم جودة المحتوى - الإسكندرية</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              مقارنة المرشحين جنباً إلى جنب لاتخاذ قرار التعيين النهائي
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              اختر حتى 4 مرشحين لمقارنة نتائج تقييم المقابلة المشتركة بين أ/ محمد الضوي وأ/ حبيبة، وتحديد الأنسب لتغطية احتياجات الفصل الدراسي ومراجعات الثانوية العامة.
            </p>
          </div>

          {/* Quick Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            {candidates.map((c) => {
              const isSelected = selectedIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleSelectCandidate(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.name.split(' ')[0]} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-4 w-48 text-slate-500 font-bold">المعيار / بيانات المرشح</th>
                {selectedCandidates.map((c) => (
                  <th key={c.id} className="py-4 px-4 min-w-[220px]">
                    <div className="text-sm font-extrabold text-slate-900">{c.name}</div>
                    <div className="text-xs text-emerald-800 font-bold mt-0.5">{c.specializationRole}</div>
                    <div className="text-[11px] text-slate-500 font-medium">المادة: {c.subject} · المرحلة: {c.targetStage}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Overall Score */}
              <tr className="bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">الدرجة الإجمالية (الموزونة)</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-lg font-black text-sm tabular-nums ${
                      c.overallScore >= 85 ? 'bg-emerald-100 text-emerald-900' :
                      c.overallScore >= 70 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {c.overallScore}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Recommendation */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">قرار التعيين المعتمد</td>
                {selectedCandidates.map((c) => {
                  const conf = HIRING_DECISION_CONFIG[c.recommendation] || HIRING_DECISION_CONFIG.pending;
                  return (
                    <td key={c.id} className="py-3 px-4 font-bold">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border ${conf.bg} ${conf.text} ${conf.border}`}>
                        {c.recommendation === 'strong_hire' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {c.recommendation === 'conditional_hire' && <AlertCircle className="w-3.5 h-3.5" />}
                        {c.recommendation === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                        {conf.label}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Interview Date & Time + Calendar Sync */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">موعد المقابلة ومفكرة جوجل</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-slate-800">
                    <div className="font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{c.interviewDate} ({c.interviewTime || '11:00 ص'})</span>
                    </div>
                    <a
                      href={createGoogleCalendarUrl(c)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200"
                    >
                      <Calendar className="w-3 h-3 text-emerald-700" />
                      <span>Google Cal ({USER_CALENDAR_EMAIL.split('@')[0]})</span>
                    </a>
                  </td>
                ))}
              </tr>

              {/* Practical Test */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">درجة الاختبار العملي</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-3 px-4 tabular-nums font-bold text-slate-800">
                    {c.practicalTestScore ? `${c.practicalTestScore} / 100` : 'لم يخضع للاختبار'}
                  </td>
                ))}
              </tr>

              {/* Experience and Target Stage */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">الخبرة والمرحلة</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-slate-700">
                    <div>{c.experienceYears} سنوات خبرة في التدقيق</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{c.currentRole}</div>
                  </td>
                ))}
              </tr>

              {/* Salary & Notice Period */}
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">الراتب المتوقع والبدء</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-slate-700">
                    <div className="font-semibold text-slate-800">{c.expectedSalary}</div>
                    <div className="text-slate-500 text-[11px]">فترة الإخطار: {c.noticePeriod}</div>
                  </td>
                ))}
              </tr>

              {/* HR Logistics Record */}
              <tr className="bg-blue-50/40">
                <td className="py-3 px-4 font-bold text-blue-950">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>سجل الـ HR: التأمينات ومواعيد العمل</span>
                  </div>
                  <div className="text-[10px] text-blue-700 font-semibold">توثيق أ/ حبيبة</div>
                </td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-3 px-4 text-xs">
                    <div className="font-bold text-slate-900">
                      {c.insuranceSuitability === 'suitable_immediate' ? 'جاهز للتأمين فوراً ✓' :
                       c.insuranceSuitability === 'needs_clearance' ? 'يحتاج مهلة إخلاء' :
                       c.insuranceSuitability === 'has_conflict' ? 'ارتباط تأميني قائم' : 'غير مناسبة'}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      مواعيد: {c.workingHoursSchedule}
                    </div>
                    <div className="text-[11px] text-purple-700">
                      إجازات: {c.weeklyHolidaysSchedule}
                    </div>
                    {(c.insuranceDetails || c.workingHoursNotes || c.weeklyHolidaysNotes) && (
                      <div className="text-[10px] text-slate-500 italic mt-1 line-clamp-2">
                        {[c.insuranceDetails, c.workingHoursNotes, c.weeklyHolidaysNotes].filter(Boolean).join(' | ')}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* The 6 Criteria breakdown */}
              {EVALUATION_CRITERIA.map((crit) => (
                <tr key={crit.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{crit.title}</div>
                    <div className="text-[10px] text-slate-400">الوزن: {crit.weight}%</div>
                  </td>
                  {selectedCandidates.map((c) => {
                    const score = c.scores[crit.id] || 3;
                    return (
                      <td key={c.id} className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold tabular-nums text-slate-900 text-sm">
                            {score} / 5
                          </span>
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                score >= 4 ? 'bg-emerald-600' : score === 3 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${(score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Action Rows */}
              <tr className="bg-slate-50">
                <td className="py-4 px-4 font-bold text-slate-900">إجراءات المتابعة</td>
                {selectedCandidates.map((c) => (
                  <td key={c.id} className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenScorecard(c)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                      >
                        فتح التقييم
                      </button>
                      <button
                        onClick={() => onViewReport(c)}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                      >
                        تقرير القرار
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
