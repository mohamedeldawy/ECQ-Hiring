export type CandidateStatus =
  | 'new'
  | 'screening'
  | 'interviewing'
  | 'practical_test'
  | 'strong_hire'
  | 'short_listed'
  | 'conditional_hire'
  | 'rejected';

export type RecommendationType =
  | 'strong_hire' // موصى بالتعيين Strong hire
  | 'short_listed' // تعيين مؤجل عند الاحتياج Short listed
  | 'conditional_hire' // تعيين مشروط ( 3 شهور )
  | 'rejected' // غير مناسب Rejected
  | 'pending';

export type SpecializationRole =
  | 'Biology-EN ECQ Specialist'
  | 'Chemistry-EN ECQ Specialist'
  | 'Chemistry-AR ECQ Specialist'
  | 'Physics-EN ECQ Specialist'
  | 'Physics-AR ECQ Specialist'
  | 'Math-AR ECQ Specialist " Senior "'
  | 'History ECQ Specialist'
  | 'Philosophical Subjects ECQ Specialist'
  | 'Geography ECQ Specialist'
  | 'Arabic ECQ Specialist " Senior "'
  | 'English ECQ Specialist " Senior "'
  | 'Science-EN ECQ Specialist'
  | 'Science-AR ECQ Specialist'
  | 'Math-EN ECQ Specialist " Middle "'
  | 'Math-AR ECQ Specialist " Middle "'
  | 'Social Studies ECQ Specialist'
  | 'Arabic ECQ Specialist " Middle "'
  | 'English ECQ Specialist " Middle "'
  | 'Data Entry ECQ Specialist'
  | 'Math-EN ECQ Specialist " Junior "'
  | 'Arabic ECQ Specialist "Junior "'
  | 'Science-EN ECQ Specialist " Junior "'
  | 'Science-AR ECQ Specialist " Middle "'
  | 'English ECQ Specialist " Junior "'
  | 'Science-AR ECQ Specialist " Junior "'
  | 'Bachelor';

export type SubjectName =
  | 'Biology-EN'
  | 'Biology-AR'
  | 'Chemistry-EN'
  | 'Chemistry-AR'
  | 'Physics-EN'
  | 'Physics-AR'
  | 'Math-EN'
  | 'Math-AR'
  | 'History'
  | 'Philosophical Subjects'
  | 'Geography'
  | 'Arabic'
  | 'English'
  | 'Science-EN'
  | 'Science-AR'
  | 'Social Studies'
  | 'Data Entry';

export type EducationalStage =
  | 'junior'
  | 'Middle'
  | 'Senior General'
  | 'Senior Bachelor';

export interface RubricScoreItem {
  criterionId: string;
  qualityScore: number; // 1 to 5
  hrScore?: number; // 1 to 5
  notes?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  specializationRole: SpecializationRole;
  subject: SubjectName;
  targetStage: EducationalStage;
  experienceYears: number;
  currentRole: string;
  expectedSalary: string;
  noticePeriod: string;
  interviewDate: string; // YYYY-MM-DD
  interviewTime: string; // e.g. "11:30 ص" or "11:30"
  calendarEmail?: string; // بريد الجيميل المستهدف لمفكرة جوجل (يمكن تحديده وتغييره بحرية)
  status: CandidateStatus;
  recommendation: RecommendationType;
  scores: Record<string, number>; // criterionId -> score (1-5)
  overallScore: number; // 0 - 100
  qualityManagerNotes: string;
  hrNotes: string;
  strengths: string[];
  redFlags: string[];
  practicalTestScore?: number; // 0 - 100
  practicalTestNotes?: string;
  evaluatedByQualityManager: string; // أ/ محمد الضوي
  evaluatedByHr: string; // أ/ حبيبة
  location: string; // الإسكندرية - جمهورية مصر العربية
  
  // سجل الموارد البشرية HR (التأمينات الاجتماعية، مواعيد العمل الرسمية، الإجازات الأسبوعية)
  insuranceSuitability: 'suitable_immediate' | 'needs_clearance' | 'has_conflict' | 'not_suitable';
  insuranceDetails?: string;
  workingHoursSchedule: string; // مثلاً: من 9:00 ص إلى 5:00 م
  workingHoursFlexibility: 'fully_flexible' | 'normal' | 'strict';
  workingHoursNotes?: string;
  weeklyHolidaysSchedule: string; // مثلاً: الجمعة والسبت
  weeklyHolidaysNotes?: string;

  updatedAt: string;
}

export interface Criterion {
  id: string;
  title: string;
  category: 'technical_pedagogical' | 'teacher_diplomacy' | 'integrity_honesty' | 'commitment_timeline' | 'student_support_service';
  weight: number; // percentage, sum = 100
  evaluatedBy: 'أ/ محمد الضوي (مدير جودة المحتوى)' | 'أ/ حبيبة (مسؤول الموارد البشرية)' | 'تقييم مشترك';
  description: string;
  rubricGuide: {
    poor: string; // 1 - 2
    acceptable: string; // 3
    excellent: string; // 4 - 5
  };
  sampleScenario: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  criterionId: string;
  title: string;
  scenario: string;
  questionText: string;
  targetInterviewer: 'أ/ محمد الضوي' | 'أ/ حبيبة (HR)' | 'مشترك';
  measurementGoal: string; // الهدف من السؤال
  greenFlags: string[]; // مؤشرات القبول والتميز
  redFlags: string[]; // علامات الخطر والرفض
  followUpQuestions: string[]; // أسئلة تعقيبية عميقة
}

export interface PracticalTask {
  id: string;
  title: string;
  subject: string;
  stage: string;
  type: 'script_audit' | 'timeline_conflict' | 'ask_teacher_case' | 'quiz_design_audit';
  description: string;
  brief: string;
  contentToReview: string;
  hiddenErrors: {
    type: 'علمي' | 'تربوي' | 'مونتاج/عرض' | 'منهجي/وزاري' | 'لغوي';
    description: string;
    location: string;
    correctAction: string;
  }[];
  modelAnswer: string;
}
