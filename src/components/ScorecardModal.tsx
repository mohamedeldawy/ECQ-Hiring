import React, { useState, useEffect } from 'react';
import { Candidate, RecommendationType } from '../types';
import { EVALUATION_CRITERIA } from '../data/criteriaData';
import { INTERVIEW_QUESTIONS } from '../data/questionsData';
import { 
  HIRING_DECISION_CONFIG, 
  QUALITY_MANAGER_NAME, 
  HR_NAME, 
  USER_CALENDAR_EMAIL,
  INSURANCE_SUITABILITY_CONFIG,
  DEFAULT_WORK_HOURS,
  DEFAULT_WEEKLY_HOLIDAYS
} from '../data/constants';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Save, 
  X, 
  UserCheck, 
  UserX, 
  Award,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  ExternalLink,
  UserPlus,
  ShieldCheck,
  Briefcase,
  CalendarDays,
  Edit3,
  Trash2
} from 'lucide-react';

interface ScorecardModalProps {
  candidate?: Candidate | null;
  allCandidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onSaveCandidate: (updated: Candidate) => void;
  onOpenNewCandidate?: () => void;
  onEditCandidate?: (candidate: Candidate) => void;
  onDeleteCandidate?: (id: string) => void;
  onClose?: () => void;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({
  candidate,
  allCandidates,
  onSelectCandidate,
  onSaveCandidate,
  onOpenNewCandidate,
  onEditCandidate,
  onDeleteCandidate,
  onClose,
}) => {
  if (!candidate) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
          <UserCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">لا يوجد مرشح مسجل حالياً لإجراء التقييم</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            الداشبورد فارغة وجاهزة للبدء في تسجيل وقائع المقابلات الجديدة بواسطة مدير قسم جودة المحتوى ({QUALITY_MANAGER_NAME}) أو مسؤول الموارد البشرية ({HR_NAME}).
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

  // Local working state
  const [scores, setScores] = useState<Record<string, number>>(candidate.scores || {});
  const [qualityManagerNotes, setQualityManagerNotes] = useState(candidate.qualityManagerNotes || '');
  const [hrNotes, setHrNotes] = useState(candidate.hrNotes || '');
  const [practicalScore, setPracticalScore] = useState<number>(candidate.practicalTestScore || 85);
  const [practicalNotes, setPracticalNotes] = useState(candidate.practicalTestNotes || '');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>(candidate.strengths || []);
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>(candidate.redFlags || []);
  const [expandedCriterionId, setExpandedCriterionId] = useState<string | null>(null);
  const [interviewDate, setInterviewDate] = useState(candidate.interviewDate || '2026-10-02');
  const [interviewTime, setInterviewTime] = useState(candidate.interviewTime || '11:30 ص');
  const [customRecommendation, setCustomRecommendation] = useState<RecommendationType | null>(null);
  
  // HR Logistics Record (Insurance, Work Hours, Holidays)
  const [insuranceSuitability, setInsuranceSuitability] = useState<Candidate['insuranceSuitability']>(
    candidate.insuranceSuitability || 'suitable_immediate'
  );
  const [insuranceDetails, setInsuranceDetails] = useState<string>(
    candidate.insuranceDetails || ''
  );
  const [workingHoursSchedule, setWorkingHoursSchedule] = useState<string>(
    candidate.workingHoursSchedule || 'From 9 Am To 5 Pm'
  );
  const [workingHoursFlexibility, setWorkingHoursFlexibility] = useState<Candidate['workingHoursFlexibility']>(
    candidate.workingHoursFlexibility || 'fully_flexible'
  );
  const [workingHoursNotes, setWorkingHoursNotes] = useState<string>(
    candidate.workingHoursNotes || ''
  );
  const [weeklyHolidaysSchedule, setWeeklyHolidaysSchedule] = useState<string>(
    candidate.weeklyHolidaysSchedule || 'الجمعة و السبت'
  );
  const [weeklyHolidaysNotes, setWeeklyHolidaysNotes] = useState<string>(
    candidate.weeklyHolidaysNotes || ''
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever selected candidate changes
  useEffect(() => {
    if (!candidate) return;
    setScores(candidate.scores || {});
    setQualityManagerNotes(candidate.qualityManagerNotes || '');
    setHrNotes(candidate.hrNotes || '');
    setPracticalScore(candidate.practicalTestScore ?? 85);
    setPracticalNotes(candidate.practicalTestNotes || '');
    setSelectedStrengths(candidate.strengths || []);
    setSelectedRedFlags(candidate.redFlags || []);
    setInterviewDate(candidate.interviewDate || '2026-10-02');
    setInterviewTime(candidate.interviewTime || '11:30 ص');
    setCustomRecommendation(null);
    setInsuranceSuitability(candidate.insuranceSuitability || 'suitable_immediate');
    setInsuranceDetails(candidate.insuranceDetails || '');
    setWorkingHoursSchedule(candidate.workingHoursSchedule || 'From 9 Am To 5 Pm');
    setWorkingHoursFlexibility(candidate.workingHoursFlexibility || 'fully_flexible');
    setWorkingHoursNotes(candidate.workingHoursNotes || '');
    setWeeklyHolidaysSchedule(candidate.weeklyHolidaysSchedule || 'الجمعة و السبت');
    setWeeklyHolidaysNotes(candidate.weeklyHolidaysNotes || '');
  }, [candidate?.id]);

  // Common strengths & red flags
  const commonStrengths = [
    'دقة علمية عالية جداً وقوة ملاحظة للأخطاء الخفية',
    'فهم عميق لنواتج التعلم ومصفوفة وزارة التربية والتعليم',
    'أمانة أكاديمية مطلقة واعتراف بالبحث عند الشك',
    'دبلوماسية فائقة في إقناع المدرسين بالبلان',
    'لغة إنجليزية أكاديمية ممتازة لمناهج اللغات EN',
    'موافقة تامة على نظام التأمينات ومواعيد العمل الرسمية بالإسكندرية',
    'صياغة تربوية دافئة ومحفزة في "اسأل مدرس"'
  ];

  const commonRedFlags = [
    'تصلب أو حدة في الحوار مع المعلمين والزملاء',
    'استعداد للتغاضي عن أخطاء الفيديو لتفادي إعادة الشغل',
    'تحفظات على مواعيد العمل الرسمية أو نظام التأمينات',
    'ضعف في التمييز بين أهداف الدرس ونواتج التعلم',
    'عدم الاعتراف بالخطأ والجدال التبريري',
    'تأخر في الحضور أو عدم الجدية في الالتزام'
  ];

  // Calculate live weighted score
  const calculateOverallScore = (currentScores: Record<string, number>) => {
    let totalScore = 0;
    EVALUATION_CRITERIA.forEach((crit) => {
      const score = currentScores[crit.id] || 3;
      const criterionPercentage = (score / 5) * crit.weight;
      totalScore += criterionPercentage;
    });
    return Math.round(totalScore);
  };

  const currentOverallScore = calculateOverallScore(scores);

  // Automatic derive recommendation if not overridden
  const deriveRecommendation = (score: number, redFlagsList: string[]): RecommendationType => {
    if (customRecommendation) return customRecommendation;
    if (redFlagsList.length >= 2 || score < 60) return 'rejected';
    if (score >= 85 && redFlagsList.length === 0) return 'strong_hire';
    if (score >= 75) return 'short_listed';
    if (score >= 65) return 'conditional_hire';
    return 'rejected';
  };

  const currentRecommendation = deriveRecommendation(currentOverallScore, selectedRedFlags);

  const handleScoreChange = (criterionId: string, value: number) => {
    const updated = { ...scores, [criterionId]: value };
    setScores(updated);
  };

  const toggleStrength = (item: string) => {
    setSelectedStrengths(prev => 
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    );
  };

  const toggleRedFlag = (item: string) => {
    setSelectedRedFlags(prev => 
      prev.includes(item) ? prev.filter(r => r !== item) : [...prev, item]
    );
  };

  const handleSave = () => {
    const updatedCandidate: Candidate = {
      ...candidate,
      scores,
      overallScore: currentOverallScore,
      recommendation: currentRecommendation,
      qualityManagerNotes,
      hrNotes,
      interviewDate,
      interviewTime,
      practicalTestScore: practicalScore,
      practicalTestNotes: practicalNotes,
      strengths: selectedStrengths,
      redFlags: selectedRedFlags,
      insuranceSuitability,
      insuranceDetails,
      workingHoursSchedule,
      workingHoursFlexibility,
      workingHoursNotes,
      weeklyHolidaysSchedule,
      weeklyHolidaysNotes,
      status: currentRecommendation === 'strong_hire' 
        ? 'strong_hire' 
        : currentRecommendation === 'short_listed' 
        ? 'short_listed' 
        : currentRecommendation === 'conditional_hire' 
        ? 'conditional_hire' 
        : 'rejected',
      evaluatedByQualityManager: QUALITY_MANAGER_NAME,
      evaluatedByHr: HR_NAME,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onSaveCandidate(updatedCandidate);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const candidateWithCurrentData = {
    ...candidate,
    interviewDate,
    interviewTime
  };
  const calendarUrl = createGoogleCalendarUrl(candidateWithCurrentData);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-1">
            <UserCheck className="w-4 h-4" />
            <span>جلسة المقابلة المشتركة | {QUALITY_MANAGER_NAME} (جودة المحتوى) & {HR_NAME} (الموارد البشرية)</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
            <span className="text-xs text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800 font-semibold">
              {candidate.specializationRole}
            </span>
            <span className="text-xs text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              المادة: {candidate.subject} · المرحلة: {candidate.targetStage}
            </span>
          </div>
        </div>

        {/* Switch Candidate Dropdown & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
          {onEditCandidate && (
            <button
              type="button"
              onClick={() => onEditCandidate(candidate)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs border border-blue-500"
              title="تعديل بيانات المرشح الأساسية"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل البيانات</span>
            </button>
          )}

          {onDeleteCandidate && (
            <button
              type="button"
              onClick={() => onDeleteCandidate(candidate.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-700 hover:border-rose-800"
              title="حذف هذا المرشح"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          )}

          <div className="text-right">
            <label className="block text-[11px] text-slate-400 mb-0.5">تبديل المرشح:</label>
            <select
              value={candidate.id}
              onChange={(e) => {
                const found = allCandidates.find(c => c.id === e.target.value);
                if (found) onSelectCandidate(found);
              }}
              className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-emerald-500 font-semibold"
            >
              {allCandidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.specializationRole}
                </option>
              ))}
            </select>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-6">
        {/* Date & Time Picker + Google Calendar Integration Bar (Item 8) */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-800" />
              <span className="font-bold text-slate-900">تاريخ المقابلة:</span>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-800" />
              <span className="font-bold text-slate-900">الساعة:</span>
              <input
                type="text"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                placeholder="11:30 ص"
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs font-semibold text-slate-800 w-24 text-center"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>إضافة لمفكرة جوجل ({USER_CALENDAR_EMAIL})</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
            <button
              onClick={() => downloadIcsFile(candidateWithCurrentData)}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300"
              title="تحميل ملف .ics لجميع برامج التقويم"
            >
              تحميل .ics
            </button>
          </div>
        </div>

        {/* Live Score & Decision Banner with 4 exact states */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl tabular-nums shadow-xs ${
              currentOverallScore >= 85
                ? 'bg-emerald-600 text-white'
                : currentOverallScore >= 70
                ? 'bg-amber-500 text-white'
                : 'bg-rose-600 text-white'
            }`}>
              {currentOverallScore}%
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">الدرجة الموزونة اللحظية</div>
              <div className="text-xs text-slate-700 font-bold mt-0.5">
                مجموع المعايير الستة المعتمدة
              </div>
            </div>
          </div>

          {/* Hiring Decision Dropdown Selector */}
          <div className="flex flex-col justify-center border-r md:border-r border-slate-200 md:pr-4">
            <label className="text-xs text-slate-500 font-bold mb-1">قرار التعيين المعتمد:</label>
            <select
              value={currentRecommendation}
              onChange={(e) => setCustomRecommendation(e.target.value as RecommendationType)}
              className="bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="strong_hire">موصى بالتعيين Strong hire</option>
              <option value="short_listed">تعيين مؤجل عند الاحتياج Short listed</option>
              <option value="conditional_hire">تعيين مشروط ( 3 شهور )</option>
              <option value="rejected">غير مناسب Rejected</option>
            </select>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
                savedSuccess ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? 'تم حفظ التقييم بنجاح!' : 'اعتماد وحفظ تقييم المقابلة'}</span>
            </button>
          </div>
        </div>

        {/* The 6 Criteria Scoring Rubric */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-base font-bold text-slate-900">
              معايير التقييم الفنية والتربوية والسلوكية الستة
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              مقياس الدرجات: من 1 (ضعيف جداً) إلى 5 (استثنائي محترف)
            </span>
          </div>

          <div className="space-y-3">
            {EVALUATION_CRITERIA.map((crit) => {
              const currentVal = scores[crit.id] || 3;
              const isExpanded = expandedCriterionId === crit.id;
              const relatedQuestion = INTERVIEW_QUESTIONS.find(q => q.criterionId === crit.id);

              return (
                <div
                  key={crit.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-4 transition-all shadow-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{crit.title}</span>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          الوزن: {crit.weight}%
                        </span>
                        <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                          {crit.evaluatedBy}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {crit.description}
                      </p>
                    </div>

                    {/* Interactive 1 to 5 Score selector */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        {[1, 2, 3, 4, 5].map((val) => {
                          const isSelected = currentVal === val;
                          return (
                            <button
                              key={val}
                              onClick={() => handleScoreChange(crit.id, val)}
                              className={`w-8 h-8 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? val >= 4
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : val === 3
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                              title={`درجة ${val}/5`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setExpandedCriterionId(isExpanded ? null : crit.id)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
                        title="عرض دليل المؤشرات وأسئلة المقابلة"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Rubric Guide & Recommended Question */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 bg-slate-50 p-3.5 rounded-lg text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-md">
                          <div className="font-bold text-rose-800 mb-1">مؤشرات الضعف (1 - 2)</div>
                          <p className="text-slate-700 leading-relaxed">{crit.rubricGuide.poor}</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-md">
                          <div className="font-bold text-amber-800 mb-1">المستوى المقبول (3)</div>
                          <p className="text-slate-700 leading-relaxed">{crit.rubricGuide.acceptable}</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-md">
                          <div className="font-bold text-emerald-800 mb-1">المتميز الاستثنائي (4 - 5)</div>
                          <p className="text-slate-700 leading-relaxed">{crit.rubricGuide.excellent}</p>
                        </div>
                      </div>

                      {relatedQuestion && (
                        <div className="bg-white p-3 rounded-md border border-slate-200 mt-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                              سؤال مقترح للاختبار أثناء المقابلة: {relatedQuestion.title}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold">
                              المسؤول: {relatedQuestion.targetInterviewer}
                            </span>
                          </div>
                          <p className="text-slate-800 font-medium bg-slate-50 p-2 rounded border border-slate-100">
                            "{relatedQuestion.questionText}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* HR Logistics Record: Insurance, Work Hours & Weekly Holidays */}
        <div className="bg-white rounded-xl border-2 border-blue-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
                <span>سجل الموارد البشرية HR: التأمينات الاجتماعية ومواعيد العمل والإجازات الأسبوعية</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                توثيق إجابات المرشح على الأسئلة الثلاثة الأساسية للموارد البشرية والاتفاقات الملزمة قبل اتخاذ قرار التعيين
              </p>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
              مسؤول التوثيق والاعتماد: {HR_NAME}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. موقف التأمينات الاجتماعية */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1 text-xs font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>1. التأمينات الاجتماعية</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    HR إلزامية
                  </span>
                </div>

                <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100 text-xs text-blue-950 font-bold">
                  سؤال الـ HR: "هل التأمينات مناسبة معاك ولا لا؟"
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الموقف التأميني العام:
                  </label>
                  <select
                    value={insuranceSuitability}
                    onChange={(e) => setInsuranceSuitability(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="suitable_immediate">مناسبة وجاهز للتسجيل فوراً ✓</option>
                    <option value="needs_clearance">مؤمن عليه حالياً ويحتاج مهلة إخلاء طرف</option>
                    <option value="has_conflict">لديه تأمين خاص أو ارتباط قائم يحتاج تسوية</option>
                    <option value="not_suitable">غير مناسبة أو يرفض التأمين الاجتماعي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    مكان تسجيل تفاصيل وملاحظات التأمين للمرشح:
                  </label>
                  <textarea
                    rows={3}
                    value={insuranceDetails}
                    onChange={(e) => setInsuranceDetails(e.target.value)}
                    placeholder="سجل هنا تفاصيل التأمين: جاهز للتأمين، رقم برنت التأمينات، مهلة إخلاء الطرف من العمل السابق، أو أي تفاصيل خاصة..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600 leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Quick Tags for Insurance */}
              <div className="pt-2 border-t border-slate-200/80">
                <span className="block text-[10px] text-slate-400 font-semibold mb-1">عبارات توثيق سريعة:</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'جاهز للتسجيل والتأمين فوراً',
                    'يحتاج مهلة أسبوعين لإخلاء طرف',
                    'مؤمن عليه حالياً وجاري التسوية'
                  ].map((tag, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInsuranceDetails(prev => prev ? `${prev} - ${tag}` : tag)}
                      className="text-[10px] bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-800 border border-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. مواعيد وساعات العمل الرسمية */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1 text-xs font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-700" />
                    <span>2. مواعيد وساعات العمل</span>
                  </div>
                  <span className="text-[10px] text-blue-700 font-extrabold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    مقر الإسكندرية
                  </span>
                </div>

                <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100 text-xs text-blue-950 font-bold">
                  سؤال الـ HR: "مواعيد العمل هتبقي من كام لكام؟"
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الشفت ومواعيد الحضور المعتمدة:
                  </label>
                  <select
                    value={workingHoursSchedule}
                    onChange={(e) => setWorkingHoursSchedule(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    {DEFAULT_WORK_HOURS.map((hr, i) => (
                      <option key={i} value={hr}>{hr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    المرونة في مواسم الذروة والمراجعات:
                  </label>
                  <select
                    value={workingHoursFlexibility}
                    onChange={(e) => setWorkingHoursFlexibility(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600"
                  >
                    <option value="fully_flexible">مرونة كاملة في مواسم الامتحانات والتصوير</option>
                    <option value="normal">مرونة عادية مع التنسيق المسبق</option>
                    <option value="strict">ملتزم بالشيفت المحدد فقط بدون مرونة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    مكان تسجيل تفاصيل وملاحظات مواعيد العمل للمرشح:
                  </label>
                  <textarea
                    rows={2}
                    value={workingHoursNotes}
                    onChange={(e) => setWorkingHoursNotes(e.target.value)}
                    placeholder="سجل هنا تفاصيل المواعيد: مناسبة خطوط السير، إمكانية التواجد بمقر المنصة بالإسكندرية، استعداد للشيفت المسائي..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600 leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Quick Tags for Working Hours */}
              <div className="pt-2 border-t border-slate-200/80">
                <span className="block text-[10px] text-slate-400 font-semibold mb-1">عبارات توثيق سريعة:</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'مناسبة تماماً وملتزم بالحضور بالإسكندرية',
                    'مرونة تامة في أوقات تصوير الاستوديو',
                    'يفضل الحضور المبكر 8:30 ص'
                  ].map((tag, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setWorkingHoursNotes(prev => prev ? `${prev} - ${tag}` : tag)}
                      className="text-[10px] bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-800 border border-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. الإجازات الأسبوعية وتناوب الراحة */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1 text-xs font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-purple-700" />
                    <span>3. الإجازات الأسبوعية</span>
                  </div>
                  <span className="text-[10px] text-purple-700 font-extrabold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    التفرغ التام
                  </span>
                </div>

                <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100 text-xs text-blue-950 font-bold">
                  سؤال الـ HR: "الاجازات الاسبوعية هتبقي ايه؟"
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    أيام الإجازة والراحة الأسبوعية:
                  </label>
                  <select
                    value={weeklyHolidaysSchedule}
                    onChange={(e) => setWeeklyHolidaysSchedule(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    {DEFAULT_WEEKLY_HOLIDAYS.map((hol, i) => (
                      <option key={i} value={hol}>{hol}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    مكان تسجيل تفاصيل وملاحظات الإجازات للمرشح:
                  </label>
                  <textarea
                    rows={3}
                    value={weeklyHolidaysNotes}
                    onChange={(e) => setWeeklyHolidaysNotes(e.target.value)}
                    placeholder="سجل هنا تفاصيل الإجازات: تأكيد التفرغ التام للمنصة، عدم إعطاء دروس خصوصية أو التواجد بسناتر خارجية، أيام الراحة المتفق عليها..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-600 leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Quick Tags for Holidays & Commitment */}
              <div className="pt-2 border-t border-slate-200/80">
                <span className="block text-[10px] text-slate-400 font-semibold mb-1">عبارات توثيق سريعة:</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'تأكيد التفرغ التام وعدم العمل بسناتر',
                    'موافق على الجمعة والسبت كيومي راحة',
                    'استعداد للتبديل بتنسيق مع أ/ محمد الضوي'
                  ].map((tag, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setWeeklyHolidaysNotes(prev => prev ? `${prev} - ${tag}` : tag)}
                      className="text-[10px] bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-800 border border-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Practical Test Score & Notes */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" />
                درجة الاختبار العملي السريع (المحاكي)
              </h4>
              <p className="text-xs text-slate-500">
                فحص اسكربت الحصة، كشف أخطاء المونتاج والعلمية، أو الرد على استفسار "اسأل مدرس"
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-bold">الدرجة من 100:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={practicalScore}
                onChange={(e) => setPracticalScore(Number(e.target.value))}
                className="w-20 px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm font-bold tabular-nums text-center focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
          <input
            type="text"
            value={practicalNotes}
            onChange={(e) => setPracticalNotes(e.target.value)}
            placeholder="ملاحظات الاختبار العملي..."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Strengths & Red Flags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>نقاط القوة والمزايا المرصودة (Green Flags)</span>
            </div>
            <div className="space-y-1.5">
              {commonStrengths.map((item, idx) => {
                const isChecked = selectedStrengths.includes(item);
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-emerald-50 text-emerald-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStrength(item)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Red Flags */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-rose-800 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>علامات الخطر والتحفظات (Red Flags)</span>
            </div>
            <div className="space-y-1.5">
              {commonRedFlags.map((item, idx) => {
                const isChecked = selectedRedFlags.includes(item);
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-2 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-rose-50 text-rose-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleRedFlag(item)}
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dual Qualitative Notes (أ/ محمد الضوي vs أ/ حبيبة) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900">
              ملاحظات وتوصيات {QUALITY_MANAGER_NAME} (مدير جودة المحتوى):
            </label>
            <textarea
              rows={4}
              value={qualityManagerNotes}
              onChange={(e) => setQualityManagerNotes(e.target.value)}
              placeholder="اكتب انطباعك كمدير قسم: هل المرشح متمكن من المنهج؟ كيف كان أداؤه في موقف المدرس؟ هل أمانته العلمية موثوقة؟..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900">
              ملاحظات وتوصيات {HR_NAME} (مسؤول الموارد البشرية):
            </label>
            <textarea
              rows={4}
              value={hrNotes}
              onChange={(e) => setHrNotes(e.target.value)}
              placeholder="ملاحظات HR: الاتزان النفسي، موقف التأمينات، مواعيد العمل الرسمية، والإجازات الأسبوعية..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            مقر التقييم: <span className="font-bold text-slate-800">الإسكندرية - جمهورية مصر العربية</span>
          </div>

          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
              savedSuccess ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'تم حفظ التقييم بنجاح!' : 'اعتماد التقييم وحفظ القرار'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
