import React, { useState, useEffect } from 'react';
import { Candidate } from '../types';
import { createGoogleCalendarUrl, downloadIcsFile, getEffectiveCalendarEmail } from '../utils/calendar';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  X, 
  Mail, 
  User, 
  Briefcase, 
  Users, 
  Sparkles 
} from 'lucide-react';

interface GoogleCalendarModalProps {
  isOpen: boolean;
  candidate: Candidate | null;
  onClose: () => void;
  onUpdateCandidateCalendarEmail?: (candidateId: string, email: string) => void;
}

export const GoogleCalendarModal: React.FC<GoogleCalendarModalProps> = ({
  isOpen,
  candidate,
  onClose,
  onUpdateCandidateCalendarEmail,
}) => {
  if (!isOpen || !candidate) return null;

  const [calendarEmail, setCalendarEmail] = useState<string>(() => {
    return getEffectiveCalendarEmail(candidate);
  });
  const [copied, setCopied] = useState(false);
  const [saveAsDefault, setSaveAsDefault] = useState(true);

  useEffect(() => {
    if (candidate) {
      setCalendarEmail(getEffectiveCalendarEmail(candidate));
      setCopied(false);
    }
  }, [candidate]);

  const handleApplyPreset = (emailValue: string) => {
    setCalendarEmail(emailValue);
  };

  const handleAppendCandidateEmail = () => {
    if (!candidate.email) return;
    const current = calendarEmail.trim();
    if (!current) {
      setCalendarEmail(candidate.email);
    } else if (!current.includes(candidate.email)) {
      setCalendarEmail(`${current}, ${candidate.email}`);
    }
  };

  const handleOpenGoogleCalendar = () => {
    const finalEmail = calendarEmail.trim() || 'dawy@elkheta.com';
    
    // Save as persistent default if user checked the box
    if (saveAsDefault) {
      try {
        localStorage.setItem('elkheta_user_calendar_email', finalEmail);
      } catch {
        // ignore
      }
    }

    // Save to this specific candidate
    if (onUpdateCandidateCalendarEmail) {
      onUpdateCandidateCalendarEmail(candidate.id, finalEmail);
    }

    const url = createGoogleCalendarUrl(candidate, finalEmail);
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleDownloadIcs = () => {
    const finalEmail = calendarEmail.trim() || 'dawy@elkheta.com';
    downloadIcsFile(candidate, finalEmail);
  };

  const handleCopyLink = () => {
    const finalEmail = calendarEmail.trim() || 'dawy@elkheta.com';
    const url = createGoogleCalendarUrl(candidate, finalEmail);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 text-right animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                ربط موعد المقابلة بمفكرة جوجل (Google Calendar)
              </h3>
              <p className="text-xs text-slate-500">
                حدد الجيميل الذي ترغب في ربط واستقبال موعد المقابلة عليه بحرية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate & Interview Details Card */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <span>المرشح: {candidate.name}</span>
            <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {candidate.specializationRole}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/60">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.interviewDate}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.interviewTime || '11:00 ص'}</span>
            </div>
          </div>
        </div>

        {/* Target Gmail Input Section */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            بريد الجيميل المستهدف لربط الموعد (يمكنك كتابة أي بريد تريده):
          </label>
          <div className="relative">
            <input
              type="text"
              value={calendarEmail}
              onChange={(e) => setCalendarEmail(e.target.value)}
              placeholder="اكتب البريد هنا... مثال: your-email@gmail.com"
              className="w-full pl-3 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-500 font-semibold block">
              أو اختر بنقرة واحدة من الخيارات السريعة:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyPreset('dawy@elkheta.com')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  calendarEmail === 'dawy@elkheta.com'
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <User className="w-3 h-3" />
                <span>أ/ محمد الضوي (dawy@elkheta.com)</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('hr.elkheta@gmail.com')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  calendarEmail === 'hr.elkheta@gmail.com'
                    ? 'bg-blue-700 text-white border-blue-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>الموارد البشرية HR (أ/ حبيبة)</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('dawy@elkheta.com, hr.elkheta@gmail.com')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  calendarEmail.includes('dawy@elkheta.com') && calendarEmail.includes('hr.elkheta@gmail.com')
                    ? 'bg-purple-700 text-white border-purple-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>كلاهما معاً (دعوة مشتركة)</span>
              </button>

              {candidate.email && (
                <button
                  type="button"
                  onClick={handleAppendCandidateEmail}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
                  title="إضافة بريد المرشح لدعوته"
                >
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  <span>+ دعوة المرشح ({candidate.email})</span>
                </button>
              )}
            </div>
          </div>

          {/* Remember as default checkbox */}
          <div className="pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
              <input
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>تثبيت هذا الجيميل كافتراضي للمقابلات القادمة أيضاً</span>
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto"
              title="نسخ رابط مفكرة جوجل"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم نسخ الرابط!' : 'نسخ الرابط'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadIcs}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto"
              title="تحميل ملف مفكرة ICS لجميع الأجهزة"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ملف iCal</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
            >
              إغلاق
            </button>
            <button
              type="button"
              onClick={handleOpenGoogleCalendar}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer w-full sm:w-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>فتح وإضافة في مفكرة جوجل</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
