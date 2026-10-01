import React, { useState } from 'react';
import { INTERVIEW_QUESTIONS } from '../data/questionsData';
import { InterviewQuestion } from '../types';
import { QUALITY_MANAGER_NAME, HR_NAME } from '../data/constants';
import { 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Plus, 
  ShieldCheck, 
  Search,
  MessageSquare
} from 'lucide-react';

export const QuestionBankView: React.FC = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(INTERVIEW_QUESTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInterviewer, setSelectedInterviewer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New question modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newScenario, setNewScenario] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCategory, setNewCategory] = useState('الانضباط وبيئة العمل');
  const [newInterviewer, setNewInterviewer] = useState<'أ/ محمد الضوي' | 'أ/ حبيبة (HR)' | 'مشترك'>('أ/ حبيبة (HR)');
  const [newGoal, setNewGoal] = useState('');
  const [newGreenFlag, setNewGreenFlag] = useState('');
  const [newRedFlag, setNewRedFlag] = useState('');

  const filteredQuestions = questions.filter(q => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesInterviewer = selectedInterviewer === 'all' || q.targetInterviewer === selectedInterviewer;
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.measurementGoal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesInterviewer && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newQuestionText) return;

    const newQ: InterviewQuestion = {
      id: `custom_q_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      criterionId: 'commitment_time_pressure',
      scenario: newScenario,
      questionText: newQuestionText,
      targetInterviewer: newInterviewer,
      measurementGoal: newGoal || 'قياس استجابة المرشح للموقف',
      greenFlags: newGreenFlag ? [newGreenFlag] : ['إجابة مهنية متزنة وموافقة تامة'],
      redFlags: newRedFlag ? [newRedFlag] : ['تردد أو تحفظات غير مبررة'],
      followUpQuestions: ['كيف يؤثر ذلك على سير العمل في القسم؟']
    };

    setQuestions([newQ, ...questions]);
    setShowAddModal(false);
    setNewTitle('');
    setNewScenario('');
    setNewQuestionText('');
    setNewGoal('');
    setNewGreenFlag('');
    setNewRedFlag('');
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 md:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>دليل المقابلات السلوكية والمواقف الميدانية | فرع الإسكندرية</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              بنك أسئلة ومواقف المقابلات (أسئلة {QUALITY_MANAGER_NAME} و {HR_NAME})
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              أسئلة واقعية تشمل منظومة التأمينات، مواعيد العمل الرسمية، والإجازات الأسبوعية، بالإضافة لمواقف الأمانة العلمية، والتعامل مع كبار المعلمين، ومراجعة الفيديوهات وخدمة "اسأل مدرس".
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سؤال / موقف مخصص</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الأسئلة، التأمينات، مواعيد العمل، الإجازات، أو الأمانة..."
              className="w-full pr-9 pl-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">جميع المحاور ({questions.length})</option>
              <option value="الانضباط وبيئة العمل">الانضباط والتأمينات ومواعيد العمل</option>
              <option value="الأمانة العلمية والصدق">الأمانة والصدق والنزاهة</option>
              <option value="إدارة علاقات المعلمين">إدارة مواقف المعلمين</option>
              <option value="فحص الجودة والمونتاج">فحص الفيديو والمونتاج</option>
              <option value="الاختبارات وخدمة اسأل مدرس">الاختبارات و"اسأل مدرس"</option>
            </select>

            <select
              value={selectedInterviewer}
              onChange={(e) => setSelectedInterviewer(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">كل السائلين</option>
              <option value="أ/ محمد الضوي">أسئلة {QUALITY_MANAGER_NAME}</option>
              <option value="أ/ حبيبة (HR)">أسئلة {HR_NAME} (HR)</option>
              <option value="مشترك">أسئلة مشتركة</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isHrPriority = q.id.startsWith('q_hr_');
          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl border shadow-xs p-5 transition-all space-y-4 ${
                isHrPriority ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isHrPriority ? 'bg-blue-600' : 'bg-emerald-600'}`}></span>
                  <h3 className="text-base font-bold text-slate-900">{q.title}</h3>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    isHrPriority ? 'bg-blue-100 text-blue-900' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {q.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    المسؤول: {q.targetInterviewer}
                  </span>
                  <button
                    onClick={() => handleCopy(`الموقف: ${q.scenario}\n\nالسؤال: ${q.questionText}`, q.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    title="نسخ نص السؤال"
                  >
                    {copiedId === q.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Scenario Context */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-1">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>سياق الموقف أثناء المقابلة:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {q.scenario}
                </p>
              </div>

              {/* Direct Question (Highlighted) */}
              <div className="p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
                <span className="text-xs font-bold text-emerald-950">نص السؤال الموجه للمرشح: </span>
                <span className="text-xs font-extrabold text-emerald-900 block mt-1 leading-relaxed">
                  "{q.questionText}"
                </span>
              </div>

              {/* Measurement Goal */}
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-800">الهدف من القياس: </span>
                {q.measurementGoal}
              </div>

              {/* Green & Red Flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                {/* Green flags */}
                <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-lg space-y-2">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>مؤشرات القبول (Green Flags):</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-slate-700 leading-relaxed">
                    {q.greenFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>

                {/* Red flags */}
                <div className="bg-rose-50/60 border border-rose-100 p-3 rounded-lg space-y-2">
                  <div className="font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>علامات القلق أو الرفض (Red Flags):</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-slate-700 leading-relaxed">
                    {q.redFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Follow-up probes */}
              {q.followUpQuestions && q.followUpQuestions.length > 0 && (
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                  <span className="font-bold text-slate-800 shrink-0">أسئلة تعقيبية:</span>
                  <div className="space-y-0.5">
                    {q.followUpQuestions.map((f, i) => (
                      <div key={i} className="text-slate-600">
                        • {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">إضافة موقف أو سؤال جديد لبنك المقابلات</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان السؤال:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: الاستعداد لشيفتات المساء في امتحانات الثانوية العامة"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المحور:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="الانضباط وبيئة العمل">الانضباط والتأمينات ومواعيد العمل</option>
                    <option value="الأمانة العلمية والصدق">الأمانة العلمية والصدق</option>
                    <option value="إدارة علاقات المعلمين">إدارة علاقات المعلمين</option>
                    <option value="فحص الجودة والمونتاج">فحص الجودة والمونتاج</option>
                    <option value="الاختبارات وخدمة اسأل مدرس">الاختبارات وخدمة اسأل مدرس</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">جهة الطرح:</label>
                  <select
                    value={newInterviewer}
                    onChange={(e) => setNewInterviewer(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="أ/ حبيبة (HR)">أ/ حبيبة (HR)</option>
                    <option value="أ/ محمد الضوي">أ/ محمد الضوي</option>
                    <option value="مشترك">طرح مشترك</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نص السؤال المباشر:</label>
                <input
                  type="text"
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="اكتب السؤال بالصيغة المباشرة..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الهدف من القياس:</label>
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="مثال: قياس الالتزام بالمواعيد الرسمية..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                >
                  حفظ السؤال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
