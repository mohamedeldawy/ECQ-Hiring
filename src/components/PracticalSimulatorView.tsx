import React, { useState } from 'react';
import { PRACTICAL_TASKS } from '../data/practicalTasksData';
import { PracticalTask } from '../types';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  FileText, 
  Send, 
  Check, 
  Clock, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const PracticalSimulatorView: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<PracticalTask>(PRACTICAL_TASKS[0]);
  const [revealedErrors, setRevealedErrors] = useState<number[]>([]);
  const [candidateNotes, setCandidateNotes] = useState('');
  const [testScore, setTestScore] = useState<number>(0);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Student inquiry interactive response simulator
  const [studentReplyText, setStudentReplyText] = useState('');
  const [replyFeedback, setReplyFeedback] = useState<string | null>(null);

  const toggleRevealError = (index: number) => {
    setRevealedErrors(prev => {
      const next = prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index];
      // calculate score: (revealed / total) * 100
      const score = Math.round((next.length / (selectedTask.hiddenErrors.length || 1)) * 100);
      setTestScore(score);
      return next;
    });
  };

  const handleSimulateReply = () => {
    if (!studentReplyText.trim()) return;

    let scorePoints = 0;
    const notes: string[] = [];

    // Check for empathetic tone
    if (studentReplyText.includes('طبيعي') || studentReplyText.includes('متوتر') || studentReplyText.includes('أهلاً') || studentReplyText.includes('بطل') || studentReplyText.includes('عمر')) {
      scorePoints += 30;
      notes.push('✓ أسلوب تربوي وتشجيع نفسي رائع لكسر التوتر.');
    } else {
      notes.push('⚠️ ينقصه الدعم النفسي للطالب المتوتر قبل الامتحانات.');
    }

    // Check for conceptual clarity
    if (studentReplyText.includes('حرجة') && studentReplyText.includes('انقلاب') && (studentReplyText.includes('الأولى') || studentReplyText.includes('الثانية'))) {
      scorePoints += 45;
      notes.push('✓ توضيح علمي دقيق للفرق بين المشتقة الأولى والثانية.');
    } else {
      notes.push('⚠️ التوضيح الرياضي يحتاج تحديد مباشر للقوانين f\'(x) و f\'\'(x).');
    }

    // Check for closing engagement
    if (studentReplyText.includes('طمني') || studentReplyText.includes('سؤال') || studentReplyText.includes('فهمت') || studentReplyText.includes('الخطة')) {
      scorePoints += 25;
      notes.push('✓ إنهاء الرد بتشجيع ومتابعة للتأكد من زوال اللبس.');
    }

    setReplyFeedback(`درجة المحاكاة التقديرية: ${scorePoints} / 100\n\n` + notes.join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-5 md:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
              <Award className="w-4 h-4" />
              <span>محاكي الاختبارات العملية السريعة أثناء المقابلة (Practical Assessment Tasks)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              اختبارات فحص الاسكربت وكشف أخطاء الفيديو والرد على الطلاب
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              مهام تطبيقية واقعية لاختبار دقة عين المرشح في كشف الأخطاء العلمية والمونتاجية على الفور، واختبار كفاءته في خدمة "اسأل مدرس" قبل اتخاذ قرار التعيين.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {PRACTICAL_TASKS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTask(t);
                  setRevealedErrors([]);
                  setTestScore(0);
                  setShowModelAnswer(false);
                }}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedTask.id === t.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.type === 'script_audit' ? 'فحص اسكربت ومونتاج' : 'محاكاة اسأل مدرس'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Task Content (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {selectedTask.stage} · {selectedTask.subject}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedTask.title}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {selectedTask.brief}
            </p>

            {/* Content to Audit */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed space-y-2 max-h-[460px] overflow-y-auto border border-slate-800">
              <div className="text-emerald-400 font-bold text-[11px] mb-2 font-sans border-b border-slate-800 pb-1">
                تفريغ الحصة المرئية المعروضة للمراجعة:
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {selectedTask.contentToReview}
              </pre>
            </div>
          </div>

          {/* Interactive Simulation for "Ask a Teacher" */}
          {selectedTask.type === 'ask_teacher_case' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-700" />
                اكتب أو قيّم رد المرشح المباشر على الطالب "عمر":
              </h4>
              <textarea
                rows={4}
                value={studentReplyText}
                onChange={(e) => setStudentReplyText(e.target.value)}
                placeholder="اكتب ردك هنا (يراعي الدعم النفسي، التوضيح العلمي الدقيق للمشتقات، والتشجيع)..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 leading-relaxed"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSimulateReply}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  فحص وتحليل جودة الرد
                </button>
              </div>

              {replyFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs whitespace-pre-wrap text-emerald-950 font-sans leading-relaxed">
                  {replyFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Evaluator Checklist & Secret Answer Key (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  لوحة تحكم الفاحص: الأخطاء الخفية ومعيار التصحيح
                </h4>
                <p className="text-xs text-slate-500">
                  انقر على الأخطاء التي استخرجها المرشح بنجاح لاحتساب درجته
                </p>
              </div>

              {selectedTask.hiddenErrors.length > 0 && (
                <div className="text-center px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-[10px] text-emerald-800 font-semibold">درجة الاختبار</div>
                  <div className="text-lg font-black text-emerald-900 tabular-nums">{testScore}%</div>
                </div>
              )}
            </div>

            {/* Errors Checklist */}
            {selectedTask.hiddenErrors.length > 0 ? (
              <div className="space-y-3">
                {selectedTask.hiddenErrors.map((err, idx) => {
                  const isChecked = revealedErrors.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleRevealError(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className={`text-xs font-bold ${
                            err.type === 'علمي' ? 'text-rose-700' :
                            err.type === 'مونتاج/عرض' ? 'text-amber-700' : 'text-blue-700'
                          }`}>
                            خطأ {err.type} ({err.location})
                          </span>
                        </div>
                        {isChecked && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                            تم اكتشافه ✓
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                        <span className="font-semibold text-slate-900">الوصف: </span>
                        {err.description}
                      </p>

                      <div className="text-[11px] text-emerald-900 bg-white/80 p-2 rounded-md mt-2 border border-emerald-100">
                        <span className="font-bold">الإجراء الصحيح: </span>
                        {err.correctAction}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                هذه المهمة تقيس الذكاء العاطفي والتواصل البيداغوجي المباشر في خدمة "اسأل مدرس". استخدم نموذج المحاكاة في الأسفل للتقييم.
              </div>
            )}

            {/* Model Answer Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>{showModelAnswer ? 'إخفاء الإجابة النموذجية' : 'عرض الإجابة النموذجية ومعايير الاعتماد'}</span>
              </button>

              {showModelAnswer && (
                <div className="mt-3 p-3.5 bg-slate-900 text-slate-200 text-xs rounded-xl whitespace-pre-wrap leading-relaxed border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-2">الإجابة النموذجية المعتمدة لمنصة الخطة:</div>
                  {selectedTask.modelAnswer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
