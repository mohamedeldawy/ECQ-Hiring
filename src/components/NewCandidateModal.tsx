import React, { useState } from 'react';
import { Candidate, SpecializationRole, SubjectName, EducationalStage } from '../types';
import { 
  SPECIALIZATION_ROLES, 
  SUBJECT_NAMES, 
  EDUCATIONAL_STAGES, 
  PLATFORM_LOCATION, 
  QUALITY_MANAGER_NAME, 
  HR_NAME,
  USER_CALENDAR_EMAIL,
  DEFAULT_WORK_HOURS,
  DEFAULT_WEEKLY_HOLIDAYS
} from '../data/constants';
import { UserPlus, X, Calendar, Clock, MapPin, ShieldCheck, Briefcase, CalendarDays } from 'lucide-react';

interface NewCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCandidate: (newCandidate: Candidate) => void;
}

export const NewCandidateModal: React.FC<NewCandidateModalProps> = ({
  isOpen,
  onClose,
  onAddCandidate,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specializationRole, setSpecializationRole] = useState<SpecializationRole>('Physics-EN ECQ Specialist');
  const [subject, setSubject] = useState<SubjectName>('Physics-EN');
  const [targetStage, setTargetStage] = useState<EducationalStage>('Senior General');
  const [experienceYears, setExperienceYears] = useState(3);
  const [currentRole, setCurrentRole] = useState('معلم ومعد محتوى تعليمي');
  const [expectedSalary, setExpectedSalary] = useState('12,000 ج.م');
  const [noticePeriod, setNoticePeriod] = useState('أسبوعين');
  const [interviewDate, setInterviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [interviewTime, setInterviewTime] = useState('11:30 ص');

  // HR Logistics
  const [insuranceSuitability, setInsuranceSuitability] = useState<Candidate['insuranceSuitability']>('suitable_immediate');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [workingHoursSchedule, setWorkingHoursSchedule] = useState('From 9 Am To 5 Pm');
  const [workingHoursFlexibility, setWorkingHoursFlexibility] = useState<Candidate['workingHoursFlexibility']>('fully_flexible');
  const [workingHoursNotes, setWorkingHoursNotes] = useState('');
  const [weeklyHolidaysSchedule, setWeeklyHolidaysSchedule] = useState('الجمعة و السبت');
  const [weeklyHolidaysNotes, setWeeklyHolidaysNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCand: Candidate = {
      id: `cand-${Date.now().toString().slice(-4)}`,
      name,
      email: email || `${name.replace(/\s+/g, '.').toLowerCase()}@elkheta.com`,
      phone: phone || '010XXXXXXXX',
      specializationRole,
      subject,
      targetStage,
      experienceYears: Number(experienceYears),
      currentRole,
      expectedSalary,
      noticePeriod,
      interviewDate,
      interviewTime,
      status: 'new',
      recommendation: 'pending',
      scores: {
        curriculum_analysis: 3,
        scientific_accuracy_video_review: 3,
        teacher_diplomacy: 3,
        integrity_honesty: 3,
        commitment_time_pressure: 3,
        ask_teacher_and_assessments: 3
      },
      overallScore: 60,
      qualityManagerNotes: '',
      hrNotes: '',
      strengths: ['استعداد للتعلم والتطوير'],
      redFlags: [],
      practicalTestScore: 80,
      practicalTestNotes: '',
      evaluatedByQualityManager: QUALITY_MANAGER_NAME,
      evaluatedByHr: HR_NAME,
      location: PLATFORM_LOCATION,
      insuranceSuitability,
      insuranceDetails,
      workingHoursSchedule,
      workingHoursFlexibility,
      workingHoursNotes,
      weeklyHolidaysSchedule,
      weeklyHolidaysNotes,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onAddCandidate(newCand);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">تسجيل مرشح جديد للمقابلة الشخصية</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            مقر المقابلة: {PLATFORM_LOCATION}
          </span>
          <span className="text-slate-500">
            المقابلة مع: <strong>{QUALITY_MANAGER_NAME}</strong> & <strong>{HR_NAME}</strong>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">اسم المرشح بالكامل:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: يوسف عادل إبراهيم"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-emerald-600 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم الهاتف:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Role and Subject from User's exact lists */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">التخصص الوظيفي الدقيق (Role):</label>
            <select
              value={specializationRole}
              onChange={(e) => setSpecializationRole(e.target.value as SpecializationRole)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-emerald-900"
            >
              {SPECIALIZATION_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">المادة الدراسية (Subject):</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
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
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              >
                {EDUCATIONAL_STAGES.map((stg) => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time (Item 8) */}
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
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
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
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                سيتم تجهيز رابط إضافة تلقائي لمفكرة جوجل ({USER_CALENDAR_EMAIL})
              </span>
            </div>
          </div>

          {/* HR Logistics Initial Agreement */}
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
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
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
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
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
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">سنوات الخبرة السابقة:</label>
              <input
                type="number"
                min="0"
                max="30"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الوظيفة السابقة / الحالية:</label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="مصحح أو مراجع محتوى"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الراتب المتوقع:</label>
              <input
                type="text"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="مثال: 13,000 ج.م"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              تسجيل وبدء التقييم الحي
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
