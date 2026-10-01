import React, { useState, useMemo } from 'react';
import { Candidate, EducationalStage, RecommendationType } from '../types';
import { 
  SPECIALIZATION_ROLES, 
  SUBJECT_NAMES, 
  EDUCATIONAL_STAGES, 
  HIRING_DECISION_CONFIG,
  PLATFORM_LOCATION,
  USER_CALENDAR_EMAIL
} from '../data/constants';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  ArrowUpRight,
  UserCheck,
  Calendar,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Briefcase,
  CalendarDays,
  Edit3,
  Trash2
} from 'lucide-react';

interface CandidatePipelineProps {
  candidates: Candidate[];
  onSelectCandidateForRubric: (candidate: Candidate) => void;
  onViewReport: (candidate: Candidate) => void;
  onOpenNewCandidate: () => void;
  onDeleteCandidate: (id: string) => void;
  onEditCandidate: (candidate: Candidate) => void;
}

export const CandidatePipeline: React.FC<CandidatePipelineProps> = ({
  candidates,
  onSelectCandidateForRubric,
  onViewReport,
  onOpenNewCandidate,
  onDeleteCandidate,
  onEditCandidate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [selectedDecisionFilter, setSelectedDecisionFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.specializationRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.currentRole.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject = 
        selectedSubjectFilter === 'all' || c.subject === selectedSubjectFilter;

      const matchesStage = 
        selectedStageFilter === 'all' || c.targetStage === selectedStageFilter;

      const matchesDecision = 
        selectedDecisionFilter === 'all' || c.recommendation === selectedDecisionFilter;

      return matchesSearch && matchesSubject && matchesStage && matchesDecision;
    });
  }, [candidates, searchQuery, selectedSubjectFilter, selectedStageFilter, selectedDecisionFilter]);

  // High-level statistics
  const stats = useMemo(() => {
    const total = candidates.length;
    const strongHires = candidates.filter(c => c.recommendation === 'strong_hire').length;
    const shortListed = candidates.filter(c => c.recommendation === 'short_listed').length;
    const conditionalHires = candidates.filter(c => c.recommendation === 'conditional_hire').length;
    const avgScore = total > 0 ? Math.round(candidates.reduce((acc, c) => acc + c.overallScore, 0) / total) : 0;
    return { total, strongHires, shortListed, conditionalHires, avgScore };
  }, [candidates]);

  const getDecisionBadge = (rec: RecommendationType) => {
    const conf = HIRING_DECISION_CONFIG[rec] || HIRING_DECISION_CONFIG.pending;
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md border ${conf.bg} ${conf.text} ${conf.border}`}>
        {rec === 'strong_hire' && <CheckCircle2 className="w-3.5 h-3.5" />}
        {rec === 'conditional_hire' && <AlertCircle className="w-3.5 h-3.5" />}
        {rec === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
        {conf.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Paragraph removed per Item 6 */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white rounded-xl p-5 md:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold tracking-wide">
              <span>قسم جودة المحتوى التعليمي</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <MapPin className="w-3.5 h-3.5" />
                {PLATFORM_LOCATION}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              داشبورد تعيينات ومقابلات أخصائيي جودة المحتوى | منصة الخطة
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
              <span>مدير قسم جودة المحتوى: <strong className="text-white">أ/ محمد الضوي</strong></span>
              <span>·</span>
              <span>الموارد البشرية: <strong className="text-white">أ/ حبيبة</strong></span>
              <span>·</span>
              <span className="text-emerald-400 font-mono">dawy@elkheta.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNewCandidate}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>إجراء مقابلة لمرشح جديد</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
            <div className="text-xs text-slate-400">إجمالي المرشحين</div>
            <div className="text-xl font-bold tabular-nums text-white mt-0.5">{stats.total}</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
            <div className="text-xs text-emerald-400">موصى بالتعيين (Strong Hire)</div>
            <div className="text-xl font-bold tabular-nums text-emerald-300 mt-0.5">{stats.strongHires}</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
            <div className="text-xs text-blue-400">مؤجل عند الاحتياج (Short Listed)</div>
            <div className="text-xl font-bold tabular-nums text-blue-300 mt-0.5">{stats.shortListed}</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
            <div className="text-xs text-amber-400">تعيين مشروط ( 3 شهور )</div>
            <div className="text-xl font-bold tabular-nums text-amber-300 mt-0.5">{stats.conditionalHires}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المرشح، التخصص (Physics-EN, Math-AR Senior...)، المادة، أو الوظيفة..."
              className="w-full pr-9 pl-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-end md:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              بطاقات تفصيلية
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جدول المقارنة
            </button>
          </div>
        </div>

        {/* Dropdown Filters according to user's exact lists */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            تصفية:
          </span>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-emerald-600 font-medium"
          >
            <option value="all">كل المواد ({SUBJECT_NAMES.length})</option>
            {SUBJECT_NAMES.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-emerald-600 font-medium"
          >
            <option value="all">كل المراحل الدراسية</option>
            {EDUCATIONAL_STAGES.map((stg) => (
              <option key={stg} value={stg}>{stg}</option>
            ))}
          </select>

          {/* Hiring Decision Filter */}
          <select
            value={selectedDecisionFilter}
            onChange={(e) => setSelectedDecisionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-emerald-600 font-medium"
          >
            <option value="all">كل قرارات التعيين</option>
            <option value="strong_hire">موصى بالتعيين Strong hire</option>
            <option value="short_listed">تعيين مؤجل عند الاحتياج Short listed</option>
            <option value="conditional_hire">تعيين مشروط ( 3 شهور )</option>
            <option value="rejected">غير مناسب Rejected</option>
          </select>

          {(searchQuery || selectedSubjectFilter !== 'all' || selectedStageFilter !== 'all' || selectedDecisionFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubjectFilter('all');
                setSelectedStageFilter('all');
                setSelectedDecisionFilter('all');
              }}
              className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Candidates List or Table */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          {candidates.length === 0 ? (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                <UserCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">الداشبورد فارغة وجاهزة لتسجيل المرشحين الجدد</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  لم يتم تسجيل أي بيانات حتى الآن. يمكنك أنت أو مسؤول الموارد البشرية البدء فوراً في تسجيل أول مرشح للمقابلة الشخصية.
                </p>
              </div>
              <button
                onClick={onOpenNewCandidate}
                className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>تسجيل أول مرشح للمقابلة الآن</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">لا يوجد مرشحون يطابقون خيارات البحث</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                قم بتعديل خيارات التصفية أو أضف مرشحاً جديداً لبدء المقابلة والتقييم المشترك.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubjectFilter('all');
                  setSelectedStageFilter('all');
                  setSelectedDecisionFilter('all');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                إلغاء كل الفلاتر
              </button>
            </div>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCandidates.map((candidate) => {
            const scoreColor =
              candidate.overallScore >= 85
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : candidate.overallScore >= 70
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : 'text-rose-700 bg-rose-50 border-rose-200';

            const calendarUrl = createGoogleCalendarUrl(candidate);

            return (
              <div
                key={candidate.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {candidate.name}
                        </h3>
                        {getDecisionBadge(candidate.recommendation)}
                      </div>
                      <div className="text-xs font-bold text-emerald-800 mt-1">
                        {candidate.specializationRole}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700">{candidate.subject}</span>
                        <span>·</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                          المرحلة: {candidate.targetStage}
                        </span>
                        <span>·</span>
                        <span>{candidate.experienceYears} سنوات خبرة</span>
                      </div>
                    </div>

                    {/* Overall Score Badge */}
                    <div className={`px-2.5 py-1.5 rounded-lg border text-center shrink-0 ${scoreColor}`}>
                      <div className="text-[10px] font-bold text-slate-500 leading-none">التقييم الكلي</div>
                      <div className="text-lg font-extrabold tabular-nums leading-tight mt-0.5">
                        {candidate.overallScore}%
                      </div>
                    </div>
                  </div>

                  {/* Interview Date & Time Bar + Calendar Button (Item 8) */}
                  <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-lg p-2.5 my-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>موعد المقابلة: <strong>{candidate.interviewDate}</strong> الساعة <strong>{candidate.interviewTime || '11:00 ص'}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold rounded border border-emerald-300 transition-colors shadow-2xs cursor-pointer text-[11px]"
                        title={`إضافة الموعد لمفكرة Google Calendar على حساب ${USER_CALENDAR_EMAIL}`}
                      >
                        <Calendar className="w-3 h-3 text-emerald-700" />
                        <span>إضافة لمفكرة جوجل ({USER_CALENDAR_EMAIL.split('@')[0]})</span>
                      </a>
                      <button
                        onClick={() => downloadIcsFile(candidate)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 rounded border border-slate-200 text-[11px] font-medium"
                        title="تحميل ملف تقويم .ics لـ Apple Calendar و Outlook"
                      >
                        .ics
                      </button>
                    </div>
                  </div>

                  {/* Competency Mini Scores */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 my-2 text-xs">
                    <div>
                      <div className="text-slate-400">التدقيق العلمي</div>
                      <div className="font-bold text-slate-800 tabular-nums">
                        {candidate.scores.scientific_accuracy_video_review || 4} / 5
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">إدارة المعلمين</div>
                      <div className="font-bold text-slate-800 tabular-nums">
                        {candidate.scores.teacher_diplomacy || 3} / 5
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">الأمانة والالتزام</div>
                      <div className="font-bold text-slate-800 tabular-nums">
                        {candidate.scores.integrity_honesty || 5} / 5
                      </div>
                    </div>
                  </div>

                  {/* Quality Manager Notes Snippet */}
                  <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2">
                    <span className="font-bold text-emerald-900">رأي أ/ محمد الضوي: </span>
                    {candidate.qualityManagerNotes || 'لم تدون ملاحظات بعد.'}
                  </div>

                  {/* HR Agreement Summary Strip */}
                  <div className="bg-blue-50/60 border border-blue-200/80 rounded-lg p-2.5 mb-2 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                        <span>اتفاق الموارد البشرية HR (أ/ حبيبة):</span>
                      </div>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800 font-extrabold">
                        {candidate.insuranceSuitability === 'suitable_immediate' ? 'جاهز للتأمين فوراً ✓' :
                         candidate.insuranceSuitability === 'needs_clearance' ? 'يحتاج مهلة إخلاء طرف' :
                         candidate.insuranceSuitability === 'has_conflict' ? 'ارتباط تأميني قائم' : 'غير مناسبة'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700 pt-1 border-t border-blue-100/70">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{candidate.workingHoursSchedule}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{candidate.weeklyHolidaysSchedule}</span>
                      </div>
                    </div>
                    {(candidate.insuranceDetails || candidate.workingHoursNotes || candidate.weeklyHolidaysNotes) && (
                      <div className="text-[10px] text-slate-500 pt-0.5 line-clamp-1">
                        <span className="font-bold text-blue-950">تفاصيل: </span>
                        {[candidate.insuranceDetails, candidate.workingHoursNotes, candidate.weeklyHolidaysNotes].filter(Boolean).join(' | ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-2 mt-2">
                  <div className="text-[11px] text-slate-400">
                    الراتب المتوقع: <span className="font-semibold text-slate-700">{candidate.expectedSalary}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCandidate(candidate);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer border border-blue-100"
                      title="تعديل بيانات المرشح"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCandidate(candidate.id);
                      }}
                      className="inline-flex items-center gap-1 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                      title="حذف هذا المرشح"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewReport(candidate);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                      title="عرض تقرير قرار التعيين المعتمد"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>التقرير</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCandidateForRubric(candidate);
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      <span>التقييم الحي</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Data Grid / Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">اسم المرشح</th>
                  <th className="py-3 px-3">التخصص المعتمد</th>
                  <th className="py-3 px-3">المادة</th>
                  <th className="py-3 px-3">المرحلة</th>
                  <th className="py-3 px-3">موعد المقابلة</th>
                  <th className="py-3 px-3 text-center">التقييم الكلي</th>
                  <th className="py-3 px-3">قرار التعيين</th>
                  <th className="py-3 px-3">سجل الـ HR (التأمينات والمواعيد)</th>
                  <th className="py-3 px-3">التقويم (Calendar)</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{candidate.name}</div>
                      <div className="text-[11px] font-normal text-slate-400">{candidate.email}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-900">{candidate.specializationRole}</td>
                    <td className="py-3 px-3 font-medium text-slate-700">{candidate.subject}</td>
                    <td className="py-3 px-3 text-slate-600 font-semibold">{candidate.targetStage}</td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      <div>{candidate.interviewDate}</div>
                      <div className="text-[11px] text-slate-400">{candidate.interviewTime || '11:00 ص'}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold tabular-nums text-sm">
                      <span className={
                        candidate.overallScore >= 85 ? 'text-emerald-700 font-extrabold' :
                        candidate.overallScore >= 70 ? 'text-amber-700 font-extrabold' : 'text-rose-700 font-extrabold'
                      }>
                        {candidate.overallScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {getDecisionBadge(candidate.recommendation)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">
                        {candidate.insuranceSuitability === 'suitable_immediate' ? 'جاهز للتأمين ✓' :
                         candidate.insuranceSuitability === 'needs_clearance' ? 'مهلة إخلاء' :
                         candidate.insuranceSuitability === 'has_conflict' ? 'ارتباط قائم' : 'غير مناسب'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {candidate.workingHoursSchedule}
                      </div>
                      <div className="text-[10px] text-purple-700">
                        {candidate.weeklyHolidaysSchedule}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={createGoogleCalendarUrl(candidate)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200"
                        title="إضافة لمفكرة جوجل dawy@elkheta.com"
                      >
                        <Calendar className="w-3 h-3 text-emerald-700" />
                        <span>Google Cal</span>
                      </a>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCandidateForRubric(candidate);
                          }}
                          className="px-2 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
                          title="بدء التقييم الحي"
                        >
                          تقييم
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCandidate(candidate);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="تعديل بيانات المرشح"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewReport(candidate);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="عرض تقرير التعيين"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCandidate(candidate.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="حذف المرشح"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
