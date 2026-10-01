import { SpecializationRole, SubjectName, EducationalStage, RecommendationType } from '../types';

export const SPECIALIZATION_ROLES: SpecializationRole[] = [
  'Biology-EN ECQ Specialist',
  'Chemistry-EN ECQ Specialist',
  'Chemistry-AR ECQ Specialist',
  'Physics-EN ECQ Specialist',
  'Physics-AR ECQ Specialist',
  'Math-AR ECQ Specialist " Senior "',
  'History ECQ Specialist',
  'Philosophical Subjects ECQ Specialist',
  'Geography ECQ Specialist',
  'Arabic ECQ Specialist " Senior "',
  'English ECQ Specialist " Senior "',
  'Science-EN ECQ Specialist',
  'Science-AR ECQ Specialist',
  'Math-EN ECQ Specialist " Middle "',
  'Math-AR ECQ Specialist " Middle "',
  'Social Studies ECQ Specialist',
  'Arabic ECQ Specialist " Middle "',
  'English ECQ Specialist " Middle "',
  'Data Entry ECQ Specialist',
  'Math-EN ECQ Specialist " Junior "',
  'Arabic ECQ Specialist "Junior "',
  'Science-EN ECQ Specialist " Junior "',
  'Science-AR ECQ Specialist " Middle "',
  'English ECQ Specialist " Junior "',
  'Science-AR ECQ Specialist " Junior "',
  'Bachelor'
];

export const SUBJECT_NAMES: SubjectName[] = [
  'Biology-EN',
  'Biology-AR',
  'Chemistry-EN',
  'Chemistry-AR',
  'Physics-EN',
  'Physics-AR',
  'Math-EN',
  'Math-AR',
  'History',
  'Philosophical Subjects',
  'Geography',
  'Arabic',
  'English',
  'Science-EN',
  'Science-AR',
  'Social Studies',
  'Data Entry'
];

export const EDUCATIONAL_STAGES: EducationalStage[] = [
  'junior',
  'Middle',
  'Senior General',
  'Senior Bachelor'
];

export const HIRING_DECISION_CONFIG: Record<
  RecommendationType,
  { label: string; bg: string; text: string; border: string }
> = {
  strong_hire: {
    label: 'موصى بالتعيين Strong hire',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  short_listed: {
    label: 'تعيين مؤجل عند الاحتياج Short listed',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  conditional_hire: {
    label: 'تعيين مشروط ( 3 شهور )',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  rejected: {
    label: 'غير مناسب Rejected',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200'
  },
  pending: {
    label: 'قيد المقابلة والتقييم',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200'
  }
};

export const PLATFORM_NAME = 'منصة الخطة';
export const PLATFORM_LOGO_URL = '/logo.png';
export const PLATFORM_LOGO_FALLBACK = 'https://logopng-omega.vercel.app/file.png';
export const PLATFORM_LOCATION = 'الإسكندرية - جمهورية مصر العربية';
export const QUALITY_MANAGER_NAME = 'أ/ محمد الضوي';
export const HR_NAME = 'أ/ حبيبة';
export const USER_CALENDAR_EMAIL = 'dawy@elkheta.com';

export const INSURANCE_SUITABILITY_CONFIG: Record<
  string,
  { label: string; badge: string; color: string }
> = {
  suitable_immediate: {
    label: 'مناسبة ومستعد للتسجيل فوراً (جاهز للتأمين ✓)',
    badge: 'جاهز للتأمين فوراً',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  needs_clearance: {
    label: 'مؤمن عليه حالياً ويحتاج مهلة إخلاء طرف',
    badge: 'يحتاج مهلة إخلاء طرف',
    color: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  has_conflict: {
    label: 'لديه تأمين خاص أو ارتباط قائم يحتاج تسوية',
    badge: 'ارتباط تأميني قائم',
    color: 'text-blue-700 bg-blue-50 border-blue-200'
  },
  not_suitable: {
    label: 'غير مناسبة أو يرفض التأمين الاجتماعي',
    badge: 'يرفض التأمين الاجتماعي',
    color: 'text-rose-700 bg-rose-50 border-rose-200'
  }
};

export const DEFAULT_WORK_HOURS = [
  'From 9 Am To 5 Pm',
  'From 10 Am To 6 Pm',
  'From 12 Pm To 8 Pm',
  'From 4 Pm To 8 am',
  'From 10 Am To 2 Pm',
  'From 12 Pm To 4 Pm',
  'From 6 Pm To 10 Pm'
];

export const DEFAULT_WEEKLY_HOLIDAYS = [
  'الجمعة و السبت',
  'الخميس و الجمعة',
  'يومان بالتناوب وفقا لجدول تشغيل الفريق',
  'يوم الجمعة + يوم بالتنسيق مع أ/ محمد الضوي'
];

