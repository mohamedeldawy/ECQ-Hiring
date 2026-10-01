import React from 'react';
import { Candidate } from '../types';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteCandidateModalProps {
  isOpen: boolean;
  candidate: Candidate | null;
  onClose: () => void;
  onConfirmDelete: (candidateId: string) => void;
}

export const DeleteCandidateModal: React.FC<DeleteCandidateModalProps> = ({
  isOpen,
  candidate,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-100 text-right animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Icon & Title */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                تأكيد حذف ملف المرشح
              </h3>
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>إجراء نهائي لا يمكن التراجع عنه</span>
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

        {/* Candidate Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">اسم المرشح:</span>
            <span className="font-extrabold text-slate-900 text-sm">{candidate.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">الوظيفة المستهدفة:</span>
            <span className="font-bold text-emerald-800">{candidate.specializationRole}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">المادة والمرحلة:</span>
            <span className="text-slate-700 font-semibold">{candidate.subject} ({candidate.targetStage})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">موعد المقابلة:</span>
            <span className="text-slate-700 font-mono">{candidate.interviewDate} ({candidate.interviewTime || '11:00 ص'})</span>
          </div>
        </div>

        {/* Warning Text */}
        <p className="text-xs text-slate-600 leading-relaxed">
          هل أنت متأكد من رغبتك في حذف هذا الملف؟ سيتم إزالة كافة درجات التقييم وسجلات الموارد البشرية (التأمينات، مواعيد العمل، الإجازات) ومحضر المقابلة من النظام فوراً.
        </p>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء وتراجع
          </button>
          <button
            type="button"
            onClick={() => onConfirmDelete(candidate.id)}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>نعم، حذف المرشح الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
