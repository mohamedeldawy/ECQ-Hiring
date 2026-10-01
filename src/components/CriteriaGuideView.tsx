import React from 'react';
import { EVALUATION_CRITERIA } from '../data/criteriaData';
import { QUALITY_MANAGER_NAME, HR_NAME, PLATFORM_LOCATION } from '../data/constants';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  MapPin
} from 'lucide-react';

export const CriteriaGuideView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 md:p-6 shadow-sm border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-1">
          <BookOpen className="w-4 h-4" />
          <span>الدستور المهني ومعايير الاختيار | قسم جودة المحتوى</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {PLATFORM_LOCATION}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">
          دليل معايير وأوزان تقييم أخصائيي ومراجعي جودة المحتوى التعليمي
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          إطار معياري مدروس بين {QUALITY_MANAGER_NAME} و {HR_NAME} يضمن اختيار الكوادر التي تجمع بين التفوق العلمي الصارم، الأمانة التامة، الدبلوماسية العالية مع كبار المدرسين، والالتزام بمواعيد العمل والتأمينات الرسمية.
        </p>
      </div>

      {/* Role Distribution Guide (أ/ محمد الضوي vs أ/ حبيبة) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quality Manager Role */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <GraduationCap className="w-5 h-5" />
            <span>مسؤوليات {QUALITY_MANAGER_NAME} (مدير جودة المحتوى):</span>
          </div>
          <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed font-sans">
            <li>
              <strong>اختبار قوة الملاحظة الأكاديمية:</strong> هل يكتشف المرشح الأخطاء العلمية والرياضية في اسكربتات وفيديوهات الاستوديو؟
            </li>
            <li>
              <strong>قياس فهم نواتج التعلم:</strong> هل يستطيع تفكيك المنهج لجميع المراحل (Junior, Middle, Senior General, Senior Bachelor) وتوزيع الحصص بدقة؟
            </li>
            <li>
              <strong>اختبار الدبلوماسية مع المدرس:</strong> هل يمتلك مهارة إقناع المدرس الكبير بالبلان دون صدام ودون تفريط في المعايير؟
            </li>
            <li>
              <strong>كفاءة "اسأل مدرس" وإعداد الاختبارات:</strong> هل يصوغ أسئلة تقيس الفهم وترسل تقارير موثوقة لأولياء الأمور؟
            </li>
          </ul>
        </div>

        {/* HR Role */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
            <Users className="w-5 h-5" />
            <span>مسؤوليات {HR_NAME} (الموارد البشرية HR):</span>
          </div>
          <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed font-sans">
            <li>
              <strong>نظام التأمينات الاجتماعية:</strong> التأكد من ملاءمة التأمينات واستعداد المرشح للتعاقد الرسمي فوراً.
            </li>
            <li>
              <strong>مواعيد العمل الرسمية:</strong> التزام المرشح بمواعيد الحضور والانصراف المقررة في مقر الإسكندرية ومرونة الشيفت في مواسم الامتحانات.
            </li>
            <li>
              <strong>الإجازات الأسبوعية:</strong> التوافق على جدول أيام الراحة الأسبوعية وتناوب التيم لتأمين خدمة الطلاب.
            </li>
            <li>
              <strong>الأمانة والصدق والانضباط:</strong> كشف المبالغات، ومدى اعتراف المرشح بأخطائه السابقة واستعداده للتعلم.
            </li>
          </ul>
        </div>
      </div>

      {/* Criteria Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-r-2 border-emerald-700 pr-2">
          تفاصيل المعايير الستة ومستويات التقييم (Rubric)
        </h3>

        {EVALUATION_CRITERIA.map((criterion, idx) => {
          return (
            <div
              key={criterion.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{criterion.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                    الوزن: {criterion.weight}%
                  </span>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-semibold">
                    التقييم: {criterion.evaluatedBy}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {criterion.description}
              </p>

              {/* Rubric Levels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg">
                  <div className="font-bold text-rose-800 mb-1">المستوى الضعيف (1 - 2):</div>
                  <p className="text-slate-700 leading-relaxed">{criterion.rubricGuide.poor}</p>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                  <div className="font-bold text-amber-800 mb-1">المستوى المقبول (3):</div>
                  <p className="text-slate-700 leading-relaxed">{criterion.rubricGuide.acceptable}</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                  <div className="font-bold text-emerald-800 mb-1">المستوى المتميز الاستثنائي (4 - 5):</div>
                  <p className="text-slate-700 leading-relaxed">{criterion.rubricGuide.excellent}</p>
                </div>
              </div>

              {/* Scenario example */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                <span className="font-bold text-slate-900">سؤال / سيناريو مقترح للاختبار: </span>
                <span className="text-slate-700 font-medium">"{criterion.sampleScenario}"</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
