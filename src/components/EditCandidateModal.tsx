import React, { useState, useEffect } from 'react';
import { 
  Candidate, 
  SpecializationRole, 
  SubjectName, 
  EducationalStage, 
  RecommendationType,
  CandidateStatus 
} from '../types';
import { 
  SPECIALIZATION_ROLES, 
  SUBJECT_NAMES, 
  EDUCATIONAL_STAGES, 
  PLATFORM_LOCATION, 
  QUALITY_MANAGER_NAME, 
  HR_NAME,
  USER_CALENDAR_EMAIL,
  DEFAULT_WORK_HOURS,
  DEFAULT_WEEKLY_HOLIDAYS,
  HIRING_DECISION_CONFIG
} from '../data/constants';
import { 
  Edit3, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  CalendarDays, 
  Trash2, 
  Save, 
  AlertTriangle 
} from 'lucide-react';

interface EditCandidateModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCandidate: (updated: Candidate) => void;
  onDeleteCandidate?: (id: string) => void;
}

export const EditCandidateModal: React.FC<EditCandidateModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSaveCandidate,
  onDeleteCandidate,
}) => {
  if (!isOpen || !candidate) return null;

  const [name, setName] = useState(candidate.name);
  const [email, setEmail] = useState(candidate.email);
  const [phone, setPhone] = useState(candidate.phone);
  const [specializationRole, setSpecializationRole] = useState<SpecializationRole>(candidate.specializationRole);
  const [subject, setSubject] = useState<SubjectName>(candidate.subject);
  const [targetStage, setTargetStage] = useState<EducationalStage>(candidate.targetStage);
  const [experienceYears, setExperienceYears] = useState(candidate.experienceYears);
  const [currentRole, setCurrentRole] = useState(candidate.currentRole);
  const [expectedSalary, setExpectedSalary] = useState(candidate.expectedSalary);
  const [noticePeriod, setNoticePeriod] = useState(candidate.noticePeriod);
  const [interviewDate, setInterviewDate] = useState(candidate.interviewDate);
  const [interviewTime, setInterviewTime] = useState(candidate.interviewTime);
  const [recommendation, setRecommendation] = useState<RecommendationType>(candidate.recommendation);
  const [status, setStatus] = useState<CandidateStatus>(candidate.status);

  // HR Logistics
  const [insuranceSuitability, setInsuranceSuitability] = useState<Candidate['insuranceSuitability']>(
    candidate.insuranceSuitability || 'suitable_immediate'
  );
  const [insuranceDetails, setInsuranceDetails] = useState(candidate.insuranceDetails || '');
  const [workingHoursSchedule, setWorkingHoursSchedule] = useState(
    candidate.workingHoursSchedule || 'From 9 Am To 5 Pm'
  );
  const [workingHoursFlexibility, setWorkingHoursFlexibility] = useState<Candidate['workingHoursFlexibility']>(
    candidate.workingHoursFlexibility || 'fully_flexible'
  );
  const [workingHoursNotes, setWorkingHoursNotes] = useState(candidate.workingHoursNotes || '');
  const [weeklyHolidaysSchedule, setWeeklyHolidaysSchedule] = useState(
    candidate.weeklyHolidaysSchedule || 'الجمعة و السبت'
  );
  const [weeklyHolidaysNotes, setWeeklyHolidaysNotes] = useState(candidate.weeklyHolidaysNotes || '');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state if candidate prop changes
  useEffect(() => {
    if (candidate) {
      setName(candidate.name);
      setEmail(candidate.email);
      setPhone(candidate.phone);
      setSpecializationRole(candidate.specializationRole);
      setSubject(candidate.subject);
      setTargetStage(candidate.targetStage);
      setExperienceYears(candidate.experienceYears);
      setCurrentRole(candidate.currentRole);
      setExpectedSalary(candidate.expectedSalary);
      setNoticePeriod(candidate.noticePeriod);
      setInterviewDate(candidate.interviewDate);
      setInterviewTime(candidate.interviewTime);
      setRecommendation(candidate.recommendation);
      setStatus(candidate.status);
      setInsuranceSuitability(candidate.insuranceSuitability || 'suitable_immediate');
      setInsuranceDetails(candidate.insuranceDetails || '');
      setWorkingHoursSchedule(candidate.workingHoursSchedule || 'From 9 Am To 5 Pm');
      setWorkingHoursFlexibility(candidate.workingHoursFlexibility || 'fully_flexible');
      setWorkingHoursNotes(candidate.workingHoursNotes || '');
      setWeeklyHolidaysSchedule(candidate.weeklyHolidaysSchedule || 'الجمعة و السبت');
      setWeeklyHolidaysNotes(candidate.weeklyHolidaysNotes || '');
      setShowDeleteConfirm(false);
    }
  }, [candidate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Candidate = {
      ...candidate,
      name,
      email,
      phone,
      specializationRole,
      subject,
      targetStage,
      experienceYears: Number(experienceYears),
      currentRole,
      expectedSalary,
      noticePeriod,
      interviewDate,
      interviewTime,
      recommendation,
      status,
      insuranceSuitability,
      insuranceDetails,
      workingHoursSchedule,
      workingHoursFlexibility,
      workingHoursNotes,
      weeklyHolidaysSchedule,
      weeklyHolidaysNotes,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onSaveCandidate(updated);
    onClose();
  };

  const handleDelete = () => {
    if (onDeleteCandidate) {
      onDeleteCandidate(candidate.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">تعديل بيانات المرشح للمقابلة</h3>
              <p className="text-[11px] text-slate-500">
                تعديل وتحديث بيانات {candidate.name} في منصة الخطة التعليمية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location & Committee Bar */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            مقر المقابلة: {PLATFORM_LOCATION}
          </span>
          <span className="text-slate-500 text-[11px]">
            اللجنة: <strong>{QUALITY_MANAGER_NAME}</strong> & <strong>{HR_NAME}</strong>
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Candidate Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم المرشح بالكامل:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: يوسف عادل إبراهيم"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-blue-600 font-bold text-slate-900"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم الهاتف:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>
          </div>

          {/* Specialization Role */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">التخصص الوظيفي الدقيق (Role):</label>
            <select
              value={specializationRole}
              onChange={(e) => setSpecializationRole(e.target.value as SpecializationRole)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-900 focus:bg-white focus:outline-none focus:border-blue-600"
            >
              {SPECIALIZATION_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Subject & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">المادة الدراسية (Subject):</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
              >
                {SUBJECT_NAMES.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">المرحلة الدراسية (Stage):</label>
              <select
                value={targetStage}
                onChange={(e) => setTargetStage(e.target.value as EducationalStage)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600"
              >
                {EDUCATIONAL_STAGES.map((stg) => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
            <div>
              <label className="block font-bold text-emerald-900 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                تاريخ المقابلة:
              </label>
              <input
                type="date"
                required
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-900 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                ساعة المقابلة (الوقت):
              </label>
              <input
                type="text"
                required
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                placeholder="11:30 ص أو 02:00 م"
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                مربوط تلقائياً بمفكرة جوجل ({USER_CALENDAR_EMAIL})
              </span>
            </div>
          </div>

          {/* Hiring Decision Override */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="block font-bold text-slate-800 mb-1">قرار التعيين المعتمد:</label>
            <select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value as RecommendationType)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="pending">قيد المقابلة والتقييم</option>
              <option value="strong_hire">موصى بالتعيين Strong hire ✓</option>
              <option value="short_listed">تعيين مؤجل عند الاحتياج Short listed</option>
              <option value="conditional_hire">تعيين مشروط ( 3 شهور )</option>
              <option value="rejected">غير مناسب Rejected</option>
            </select>
          </div>

          {/* HR Logistics */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>اتفاق وتسجيل الموارد البشرية HR (التأمينات ومواعيد العمل والإجازات):</span>
              </div>
              <span className="text-[11px] text-blue-800 font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                توثيق أ/ حبيبة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. التأمينات */}
              <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-blue-100">
                <label className="block text-[11px] font-bold text-slate-800">
                  1. موقف التأمينات:
                </label>
                <select
                  value={insuranceSuitability}
                  onChange={(e) => setInsuranceSuitability(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white"
                >
                  <option value="suitable_immediate">مناسبة وجاهز للتأمين فوراً ✓</option>
                  <option value="needs_clearance">مؤمن عليه ويحتاج مهلة إخلاء</option>
                  <option value="has_conflict">ارتباط تأميني قائم</option>
                  <option value="not_suitable">غير مناسبة</option>
                </select>
                <input
                  type="text"
                  value={insuranceDetails}
                  onChange={(e) => setInsuranceDetails(e.target.value)}
                  placeholder="سجل ملاحظات التأمين..."
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:bg-white"
                />
              </div>

              {/* 2. مواعيد العمل */}
              <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-blue-100">
                <label className="block text-[11px] font-bold text-slate-800">
                  2. مواعيد العمل:
                </label>
                <select
                  value={workingHoursSchedule}
                  onChange={(e) => setWorkingHoursSchedule(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white"
                >
                  {DEFAULT_WORK_HOURS.map((hr, i) => (
                    <option key={i} value={hr}>{hr}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={workingHoursNotes}
                  onChange={(e) => setWorkingHoursNotes(e.target.value)}
                  placeholder="سجل ملاحظات مواعيد العمل..."
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:bg-white"
                />
              </div>

              {/* 3. الإجازات الأسبوعية */}
              <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-blue-100">
                <label className="block text-[11px] font-bold text-slate-800">
                  3. الإجازات الأسبوعية:
                </label>
                <select
                  value={weeklyHolidaysSchedule}
                  onChange={(e) => setWeeklyHolidaysSchedule(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white"
                >
                  {DEFAULT_WEEKLY_HOLIDAYS.map((hol, i) => (
                    <option key={i} value={hol}>{hol}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={weeklyHolidaysNotes}
                  onChange={(e) => setWeeklyHolidaysNotes(e.target.value)}
                  placeholder="سجل ملاحظات التفرغ والراحة..."
                  className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Experience, Role, Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">سنوات الخبرة:</label>
              <input
                type="number"
                min="0"
                max="35"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الوظيفة السابقة / الحالية:</label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="معلم أول / مراجع جودة"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الراتب المتوقع:</label>
              <input
                type="text"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="مثال: 13,000 ج.م"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
              />
            </div>
          </div>

          {/* Delete Confirmation Box */}
          {showDeleteConfirm && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>تأكيد حذف بيانات المرشح نهائياً</span>
              </div>
              <p className="text-[11px] text-rose-700">
                هل أنت متأكد من رغبتك في حذف ملف المرشح <strong>"{candidate.name}"</strong>؟ لا يمكن التراجع عن هذا الإجراء بعد الحذف.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  نعم، تأكيد الحذف الآن
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  إلغاء الحذف
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 gap-2">
            <div>
              {onDeleteCandidate && !showDeleteConfirm && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف المرشح</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
