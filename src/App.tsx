/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Candidate } from './types';
import { INITIAL_CANDIDATES } from './data/mockCandidates';
import { Navbar, NavTab } from './components/Navbar';
import { CandidatePipeline } from './components/CandidatePipeline';
import { ScorecardModal } from './components/ScorecardModal';
import { QuestionBankView } from './components/QuestionBankView';
import { PracticalSimulatorView } from './components/PracticalSimulatorView';
import { ComparisonView } from './components/ComparisonView';
import { CriteriaGuideView } from './components/CriteriaGuideView';
import { HiringReportView } from './components/HiringReportView';
import { NewCandidateModal } from './components/NewCandidateModal';
import { EditCandidateModal } from './components/EditCandidateModal';
import { DeleteCandidateModal } from './components/DeleteCandidateModal';
import { CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'elkheta_quality_hiring_empty_fresh_v5';

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy candidates from initial mockups
          return parsed.filter(c => !['cand-001', 'cand-002', 'cand-003', 'cand-004', 'cand-005', 'cand-006'].includes(c.id));
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_CANDIDATES;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('pipeline');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(() => {
    return candidates.length > 0 ? candidates[0] : null;
  });
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isNewCandidateModalOpen, setIsNewCandidateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState<Candidate | null>(null);

  // In-app deletion modal state (No blocking window.confirm)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(candidates));
    } catch {
      // ignore
    }
  }, [candidates]);

  // Keep selectedCandidate synced with the list
  useEffect(() => {
    if (!selectedCandidate) {
      if (candidates.length > 0) {
        setSelectedCandidate(candidates[0]);
      }
      return;
    }
    const match = candidates.find(c => c.id === selectedCandidate.id);
    if (match) {
      setSelectedCandidate(match);
    } else if (candidates.length > 0) {
      setSelectedCandidate(candidates[0]);
    } else {
      setSelectedCandidate(null);
    }
  }, [candidates, selectedCandidate?.id]);

  const handleSaveCandidate = (updated: Candidate) => {
    setCandidates(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    setSelectedCandidate(updated);
  };

  const handleAddCandidate = (newCandidate: Candidate) => {
    setCandidates(prev => [newCandidate, ...prev]);
    setSelectedCandidate(newCandidate);
    setActiveTab('live_scorecard');
  };

  const handleOpenEditCandidate = (candidate: Candidate) => {
    setCandidateToEdit(candidate);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedCandidate = (updated: Candidate) => {
    handleSaveCandidate(updated);
    setIsEditModalOpen(false);
  };

  // Robust, in-app deletion handling (No window.confirm in iframes)
  const handleRequestDelete = (candidateOrId: string | Candidate) => {
    let target: Candidate | undefined;
    if (typeof candidateOrId === 'string') {
      target = candidates.find(c => c.id === candidateOrId);
    } else {
      target = candidateOrId;
    }
    if (target) {
      setCandidateToDelete(target);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = (id: string) => {
    const targetName = candidateToDelete?.name || '';
    setCandidates(prev => {
      const next = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      if (selectedCandidate?.id === id) {
        setSelectedCandidate(next.length > 0 ? next[0] : null);
      }
      return next;
    });

    if (candidateToEdit?.id === id) {
      setIsEditModalOpen(false);
      setCandidateToEdit(null);
    }

    setIsDeleteModalOpen(false);
    setCandidateToDelete(null);

    setToastMessage(`تم حذف ملف المرشح "${targetName}" بنجاح ✓`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSelectCandidateForRubric = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsReportOpen(false);
    setActiveTab('live_scorecard');
  };

  const handleViewReport = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsReportOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3 backdrop-blur-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Executive Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsReportOpen(false);
          setActiveTab(tab);
        }}
        onOpenNewCandidate={() => setIsNewCandidateModalOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        candidatesCount={candidates.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isReportOpen ? (
          <HiringReportView
            candidate={selectedCandidate}
            allCandidates={candidates}
            onSelectCandidate={(c) => setSelectedCandidate(c)}
            onOpenNewCandidate={() => setIsNewCandidateModalOpen(true)}
            onEditCandidate={handleOpenEditCandidate}
            onDeleteCandidate={handleRequestDelete}
            onBack={() => setIsReportOpen(false)}
          />
        ) : (
          <>
            {activeTab === 'pipeline' && (
              <CandidatePipeline
                candidates={candidates}
                onSelectCandidateForRubric={handleSelectCandidateForRubric}
                onViewReport={handleViewReport}
                onOpenNewCandidate={() => setIsNewCandidateModalOpen(true)}
                onEditCandidate={handleOpenEditCandidate}
                onDeleteCandidate={handleRequestDelete}
              />
            )}

            {activeTab === 'live_scorecard' && (
              <ScorecardModal
                key={selectedCandidate?.id || 'empty'}
                candidate={selectedCandidate}
                allCandidates={candidates}
                onSelectCandidate={(c) => setSelectedCandidate(c)}
                onSaveCandidate={handleSaveCandidate}
                onOpenNewCandidate={() => setIsNewCandidateModalOpen(true)}
                onEditCandidate={handleOpenEditCandidate}
                onDeleteCandidate={handleRequestDelete}
              />
            )}

            {activeTab === 'questions' && <QuestionBankView />}

            {activeTab === 'practical_test' && <PracticalSimulatorView />}

            {activeTab === 'comparison' && (
              <ComparisonView
                candidates={candidates}
                onViewReport={handleViewReport}
                onOpenScorecard={handleSelectCandidateForRubric}
                onOpenNewCandidate={() => setIsNewCandidateModalOpen(true)}
              />
            )}

            {activeTab === 'rubric_guide' && <CriteriaGuideView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">منصة الخطة</span>
            <span>·</span>
            <span>قسم جودة المحتوى التعليمي</span>
            <span>·</span>
            <span className="text-emerald-800 font-bold">الإسكندرية - جمهورية مصر العربية</span>
          </div>
          <div className="text-slate-600 font-medium">
            لجنة التقييم: أ/ محمد الضوي & أ/ حبيبة | البريد: dawy@elkheta.com
          </div>
        </div>
      </footer>

      {/* New Candidate Modal */}
      <NewCandidateModal
        isOpen={isNewCandidateModalOpen}
        onClose={() => setIsNewCandidateModalOpen(false)}
        onAddCandidate={handleAddCandidate}
      />

      {/* Edit Candidate Modal */}
      <EditCandidateModal
        isOpen={isEditModalOpen}
        candidate={candidateToEdit}
        onClose={() => setIsEditModalOpen(false)}
        onSaveCandidate={handleSaveEditedCandidate}
        onDeleteCandidate={handleRequestDelete}
      />

      {/* In-App Delete Confirmation Modal */}
      <DeleteCandidateModal
        isOpen={isDeleteModalOpen}
        candidate={candidateToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCandidateToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
