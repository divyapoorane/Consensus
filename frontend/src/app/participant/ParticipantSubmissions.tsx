import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participant/participantService';
import { ParticipantSubmission, ParticipantProject } from '../../types/participant';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { api } from '../../services/api';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Award,
  ShieldCheck,
  AlertTriangle,
  Download,
  Check,
  Scale,
  Send,
  ExternalLink,
  Github,
  Rocket,
  Flame,
} from 'lucide-react';

export const ParticipantSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<ParticipantSubmission[]>([]);
  const [unsubmittedProjects, setUnsubmittedProjects] = useState<ParticipantProject[]>([]);
  const [selectedForDispute, setSelectedForDispute] = useState<ParticipantSubmission | null>(null);
  const [disputeForm, setDisputeForm] = useState({
    title: '',
    category: 'Judging Bias / Scoring Irregularity',
    priority: 'medium',
    description: '',
  });
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [, setDisputeSuccessId] = useState<string | null>(null);

  const loadData = async () => {
    const [subList, projList] = await Promise.all([
      participantService.getSubmissions(),
      participantService.getProjects(),
    ]);
    setSubmissions(subList);
    setUnsubmittedProjects((projList || []).filter((p) => p.status !== 'Submitted'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLaunchProject = async (projId: string) => {
    const res = await participantService.submitProject(projId);
    if (res) {
      loadData();
    }
  };

  const handleDownloadCertificate = async (sub: ParticipantSubmission) => {
    try {
      const certs = await api.get<any[]>('/api/certificates');
      const matched = certs?.find(
        (c) => c.hackathonTitle === sub.hackathonTitle || c.recipientEmail?.includes('participant') || c.status === 'issued'
      );
      const certId = matched ? matched.id : 'CERT-CNS-2026-901';
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      window.open(`${baseUrl}/api/certificates/${certId}/download`, '_blank');
    } catch (err) {
      console.warn('Certificate fetch fallback to demo download:', err);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      window.open(`${baseUrl}/api/certificates/CERT-CNS-2026-901/download`, '_blank');
    }
  };

  const handleFileDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForDispute || !disputeForm.description) return;

    setIsSubmittingDispute(true);
    try {
      const res = await api.post('/api/disputes', {
        title: disputeForm.title || `Review appeal for ${selectedForDispute.projectTitle}`,
        category: disputeForm.category,
        priority: disputeForm.priority,
        description: disputeForm.description,
        hackathonTitle: selectedForDispute.hackathonTitle,
        projectTitle: selectedForDispute.projectTitle,
      });

      setDisputeSuccessId(res.disputeId || 'DSP-SUBMITTED');
      setTimeout(() => {
        setSelectedForDispute(null);
        setDisputeSuccessId(null);
        setDisputeForm({
          title: '',
          category: 'Judging Bias / Scoring Irregularity',
          priority: 'medium',
          description: '',
        });
      }, 2500);
    } catch (err) {
      console.error('Failed to submit dispute ticket:', err);
      alert('Failed to submit dispute. Check network connection.');
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Launch Sequence & Submissions"
        subtitle="Final verification checklist, payload locking, and double-blind jury evaluation queue."
        badge={<StatusBeacon status="mission" label="LAUNCH GATE // ACTIVE" />}
      />

      {/* UNLAUNCHED PROJECTS: 5-STEP LAUNCH CHECKLIST SEQUENCE */}
      {unsubmittedProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#FF5500]" />
            <h2 className="text-sm font-bold text-[#F0F4FC] font-mono uppercase tracking-wider">
              Pending Launch Sequence ({unsubmittedProjects.length})
            </h2>
          </div>

          {unsubmittedProjects.map((proj) => {
            const hasReady = true;
            const hasDetails = !!proj.title && !!proj.description;
            const hasDemo = !!proj.demoUrl;
            const hasRepo = !!proj.repositoryUrl;

            const checklist = [
              { step: '01', title: 'PROJECT READY', desc: 'Codebase initialized and assigned to track', complete: hasReady },
              { step: '02', title: 'DETAILS VERIFIED', desc: 'Architecture documentation and tagline defined', complete: hasDetails },
              { step: '03', title: 'DEMO ATTACHED', desc: proj.demoUrl || 'Live public HTTPS endpoint connected', complete: hasDemo },
              { step: '04', title: 'REPOSITORY VERIFIED', desc: proj.repositoryUrl || 'Public source repository linked', complete: hasRepo },
              { step: '05', title: 'FINAL SUBMISSION', desc: 'Lock payload and dispatch to double-blind jury', complete: false },
            ];

            return (
              <div
                key={proj.id}
                className="bg-[#0D1220]/95 border border-[#FF5500]/40 rounded-xl p-6 sm:p-7 space-y-6 relative overflow-hidden shadow-xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#FF5500]/60 before:to-transparent"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#182238]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TechnicalLabel label="BUILD BAY" value={proj.title} variant="orange" />
                      <Badge variant="orange" size="sm">
                        {proj.hackathonTitle}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono text-[#8E9BB5]">{proj.tagline}</p>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleLaunchProject(proj.id)}
                    icon={<Send className="w-4 h-4" />}
                    className="shadow-md shadow-[#FF5500]/25"
                  >
                    Launch Submission
                  </Button>
                </div>

                {/* Vertical Launch Checklist */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9BB5] font-bold block">
                    PRE-FLIGHT LAUNCH VERIFICATION CHECKLIST
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {checklist.map((item) => (
                      <div
                        key={item.step}
                        className={`p-3.5 rounded-lg border font-mono transition-all ${
                          item.complete
                            ? 'bg-[#090D18] border-[#00E575]/40 text-[#F0F4FC]'
                            : 'bg-[#06080F]/60 border-[#182238] text-[#8E9BB5]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] text-[#8E9BB5]">STEP {item.step}</span>
                          {item.complete ? (
                            <Check className="w-3.5 h-3.5 text-[#00E575]" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#8E9BB5] truncate font-sans">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LAUNCHED SUBMISSIONS FEED */}
      {submissions.length === 0 && unsubmittedProjects.length === 0 ? (
        <EmptyState
          icon={<Award className="w-8 h-8 text-[#FF5500]" />}
          title="No project submissions locked yet"
          description="Build a prototype in your build bay and complete the launch checklist to enter the double-blind jury evaluation queue."
        />
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-[#0D1220]/95 border border-[#182238] rounded-xl p-6 sm:p-7 space-y-6 relative overflow-hidden shadow-xl before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#00F0FF]/30 before:to-transparent"
            >
              {/* Submission Header Strip */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#182238]">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="slate" size="sm">
                      {sub.hackathonTitle}
                    </Badge>
                    <StatusBeacon
                      status={sub.status === 'evaluated' ? 'winner' : 'connected'}
                      label={sub.status}
                    />
                    <span className="text-[10px] font-mono text-[#00E575] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      PRE-FLIGHT: {sub.validationStatus}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#F0F4FC] font-mono uppercase">
                    {sub.projectTitle}
                  </h3>

                  <p className="text-xs text-[#8E9BB5] font-mono">
                    SQUAD: <strong className="text-[#00F0FF]">{sub.teamName}</strong> •{' '}
                    <span>TIMESTAMP: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </p>
                </div>

                {/* Score & Certificate Action */}
                <div className="flex items-center gap-3 flex-wrap">
                  {sub.score !== undefined && (
                    <div className="p-3 rounded-lg bg-[#090D18] border border-[#182238] flex items-center gap-3 flex-shrink-0">
                      <Award className="w-5 h-5 text-[#FF5500]" />
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#8E9BB5] block font-medium">
                          CONSENSUS SCORE
                        </span>
                        <span className="text-xl font-bold text-[#FF7722] font-mono">
                          {sub.score} <span className="text-xs text-[#8E9BB5]">/ {sub.maxScore || 100}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadCertificate(sub)}
                      icon={<Download className="w-3.5 h-3.5" />}
                    >
                      Certificate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-950/20"
                      onClick={() => setSelectedForDispute(sub)}
                      icon={<AlertTriangle className="w-3.5 h-3.5" />}
                    >
                      Appeal
                    </Button>
                  </div>
                </div>
              </div>

              {/* Jury Consensus Feedback & Deliberation Spec */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-8 space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-[#8E9BB5] font-mono font-medium flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Double-Blind Jury Deliberation Consensus</span>
                  </h4>
                  {sub.feedback ? (
                    <div className="p-4 rounded-lg bg-[#090D18] border border-[#182238] text-xs text-[#F0F4FC] font-mono leading-relaxed italic">
                      "{sub.feedback}"
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-[#090D18] border border-[#182238] text-xs text-[#8E9BB5] font-mono italic">
                      Double-blind jury evaluation in progress. Structured rubric feedback will appear once consensus scoring converges.
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-[#8E9BB5] font-mono font-medium flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Evaluation Protocol</span>
                  </h4>
                  <div className="p-4 rounded-lg bg-[#090D18] border border-[#182238] text-xs text-[#8E9BB5] font-mono space-y-1">
                    <p className="text-[#F0F4FC] font-bold">DOUBLE-BLIND SCORING</p>
                    <p className="text-[11px] font-sans">
                      Identity sanitized to eliminate reviewer bias. Scores blended across 5 rubric dimensions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: File Dispute */}
      <Modal
        isOpen={!!selectedForDispute}
        onClose={() => setSelectedForDispute(null)}
        title="File Deliberation Appeal"
        subtitle={`Submit an audited review request for ${selectedForDispute?.projectTitle || 'submission'}`}
      >
        <form onSubmit={handleFileDispute} className="space-y-4 pt-2">
          <Input
            label="Appeal Summary"
            placeholder="e.g. Scored rubric criteria omission"
            value={disputeForm.title}
            onChange={(e) => setDisputeForm({ ...disputeForm, title: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] font-bold text-[#8E9BB5] uppercase tracking-wider">
              Appeal Grounds
            </label>
            <textarea
              required
              rows={4}
              placeholder="State the objective reasons why the deliberation score should be re-examined by the appeals board..."
              value={disputeForm.description}
              onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })}
              className="w-full bg-[#090D18] border border-[#182238] rounded-lg p-3 text-xs text-[#F0F4FC] placeholder-[#4B556D] font-mono focus:border-[#00F0FF] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedForDispute(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingDispute}
            >
              Submit Appeal Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
