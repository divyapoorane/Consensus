import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { judgeService } from '../../services/judge/judgeService';
import { JudgeProject, JudgeRubricScore } from '../../types/judge';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Scale,
  ArrowLeft,
  Github,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  CheckCircle,
  Radio,
  Cpu,
  Target,
  Sparkles,
  Lock,
} from 'lucide-react';

export const ProjectEvaluation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<JudgeProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rubric Scores
  const [innovation, setInnovation] = useState(18);        // Max 20
  const [technicalQuality, setTechnicalQuality] = useState(26); // Max 30
  const [uiUx, setUiUx] = useState(13);                   // Max 15
  const [impact, setImpact] = useState(17);                 // Max 20
  const [presentation, setPresentation] = useState(14);     // Max 15
  const [feedback, setFeedback] = useState(
    'Strong architectural foundation. The consensus fallback algorithm is well thought out and executed with high fidelity.'
  );
  const [privateNotes, setPrivateNotes] = useState('Checked git commit logs — verified clean origin.');
  const [recommendForAward, setRecommendForAward] = useState(true);

  useEffect(() => {
    if (id) {
      judgeService.getProjectById(id).then((p) => {
        if (p) {
          setProject(p);
          if (p.myScore) {
            setInnovation(p.myScore.innovation);
            setTechnicalQuality(p.myScore.technicalQuality);
            setUiUx(p.myScore.uiUx);
            setImpact(p.myScore.impact);
            setPresentation(p.myScore.presentation);
            setFeedback(p.myScore.feedback);
            if (p.myScore.privateNotes) setPrivateNotes(p.myScore.privateNotes);
            if (p.myScore.recommendForAward !== undefined) {
              setRecommendForAward(p.myScore.recommendForAward);
            }
          }
        }
      });
    }
  }, [id]);

  if (!project) {
    return <div className="p-8 text-center text-[#8E9BB5] font-mono">Loading evaluation chamber...</div>;
  }

  const totalScore = innovation + technicalQuality + uiUx + impact + presentation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scoreData: JudgeRubricScore = {
      innovation,
      technicalQuality,
      uiUx,
      impact,
      presentation,
      feedback,
      privateNotes,
      recommendForAward,
    };

    await judgeService.submitEvaluation(project.id, scoreData);
    setIsSubmitting(false);
    alert('Evaluation score submitted to double-blind consensus matrix!');
    navigate('/judge/projects');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <button
        onClick={() => navigate('/judge/projects')}
        className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#8E9BB5] hover:text-[#00F0FF] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Deliberation Queue</span>
      </button>

      {/* COMMAND DECK HEADER */}
      <DashboardHeader
        title={`Target // ${project.title}`}
        subtitle={project.tagline}
        badge={<StatusBeacon status="connected" label="DOUBLE-BLIND MASKING ACTIVE" />}
      />

      {/* PROJECT TARGET & DELIVERABLE WORKSTATION */}
      <SystemPanel title="Project Target & Payload Overview" accent="cyan">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <TechnicalLabel label="SECTOR" value={project.category} variant="cyan" />
              <span className="text-xs text-[#8E9BB5] font-mono">
                TRACK: <strong className="text-[#F0F4FC]">{project.hackathonTitle}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#8E9BB5] bg-[#090D18] px-2.5 py-1 rounded border border-[#182238]">
                <Lock className="w-3 h-3 text-[#FF5500]" />
                <span>AUTHOR MASKED // SANITIZED</span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#D1D1D1] leading-relaxed font-sans">
            {project.description}
          </p>

          {/* Deliverable Link Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg bg-[#090D18] border border-[#182238] hover:border-[#00F0FF]/50 flex items-center justify-center gap-2 text-[#F0F4FC] hover:text-[#00F0FF] transition-colors"
            >
              <Github className="w-4 h-4 text-[#8E9BB5]" />
              <span>Git Codebase</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg bg-[#090D18] border border-[#FF5500]/30 hover:border-[#FF5500]/60 flex items-center justify-center gap-2 text-[#FF7722] hover:text-white transition-colors font-bold"
            >
              <ExternalLink className="w-4 h-4 text-[#FF5500]" />
              <span>Live Interactive Demo</span>
            </a>

            <a
              href={project.documentationUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg bg-[#090D18] border border-[#182238] hover:border-[#00F0FF]/50 flex items-center justify-center gap-2 text-[#8E9BB5] hover:text-[#F0F4FC] transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#8E9BB5]" />
              <span>Documentation Brief</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </SystemPanel>

      {/* SCORING FORM & RUBRIC MODULES */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <SystemPanel
          title="Standardized Rubric Scoring Matrix"
          badge={<StatusBeacon status="live" label="WEIGHTED 100 PTS" />}
          action={
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#8E9BB5] block">Composite Score</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#FF7722] font-mono">
                {totalScore} <span className="text-xs text-[#8E9BB5]">/ 100</span>
              </span>
            </div>
          }
          accent="orange"
        >
          <div className="space-y-4">
            {/* Criterion 1: Innovation */}
            <div className="p-4 rounded-lg bg-[#090D18] border border-[#182238] space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono text-xs font-bold text-[#F0F4FC] uppercase block">
                    01 // Innovation & Novelty (Weight: 20%)
                  </span>
                  <span className="text-[11px] text-[#8E9BB5] font-sans">
                    Originality of conceptual approach, system architecture creativity, and non-trivial problem formulation.
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-[#FF7722]">{innovation} / 20</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={innovation}
                onChange={(e) => setInnovation(Number(e.target.value))}
                className="w-full accent-[#FF5500] cursor-pointer"
              />
            </div>

            {/* Criterion 2: Technical Quality */}
            <div className="p-4 rounded-lg bg-[#090D18] border border-[#182238] space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono text-xs font-bold text-[#F0F4FC] uppercase block">
                    02 // Technical Execution & Depth (Weight: 30%)
                  </span>
                  <span className="text-[11px] text-[#8E9BB5] font-sans">
                    Code cleanliness, robust error handling, test coverage, dependency management, and architecture.
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-[#FF7722]">{technicalQuality} / 30</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={technicalQuality}
                onChange={(e) => setTechnicalQuality(Number(e.target.value))}
                className="w-full accent-[#FF5500] cursor-pointer"
              />
            </div>

            {/* Criterion 3: UI/UX */}
            <div className="p-4 rounded-lg bg-[#090D18] border border-[#182238] space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono text-xs font-bold text-[#F0F4FC] uppercase block">
                    03 // UI / UX Design & Polish (Weight: 15%)
                  </span>
                  <span className="text-[11px] text-[#8E9BB5] font-sans">
                    Intuitive workflow, typography, responsiveness, aesthetic finish, and developer experience.
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-[#FF7722]">{uiUx} / 15</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={uiUx}
                onChange={(e) => setUiUx(Number(e.target.value))}
                className="w-full accent-[#FF5500] cursor-pointer"
              />
            </div>

            {/* Criterion 4: Impact */}
            <div className="p-4 rounded-lg bg-[#090D18] border border-[#182238] space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono text-xs font-bold text-[#F0F4FC] uppercase block">
                    04 // Practical Utility & Impact (Weight: 20%)
                  </span>
                  <span className="text-[11px] text-[#8E9BB5] font-sans">
                    Real-world coordination applicability, deployment feasibility, and engineering scale.
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-[#FF7722]">{impact} / 20</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="w-full accent-[#FF5500] cursor-pointer"
              />
            </div>

            {/* Criterion 5: Presentation */}
            <div className="p-4 rounded-lg bg-[#090D18] border border-[#182238] space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono text-xs font-bold text-[#F0F4FC] uppercase block">
                    05 // Presentation & Documentation (Weight: 15%)
                  </span>
                  <span className="text-[11px] text-[#8E9BB5] font-sans">
                    Documentation clarity, setup instructions, pitch walkthrough, and architectural diagrams.
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-[#FF7722]">{presentation} / 15</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={presentation}
                onChange={(e) => setPresentation(Number(e.target.value))}
                className="w-full accent-[#FF5500] cursor-pointer"
              />
            </div>
          </div>
        </SystemPanel>

        {/* FEEDBACK & CONSENSUS SIGNAL */}
        <SystemPanel title="Deliberation Notes & Consensus Signal" accent="green">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] font-bold text-[#F0F4FC] uppercase tracking-wider">
                Public Builder Feedback (Disclosed Post-Deliberation)
              </label>
              <textarea
                required
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Constructive feedback on strengths, architectural highlights, and improvement suggestions..."
                className="w-full bg-[#090D18] border border-[#182238] rounded-lg p-3 text-[#F0F4FC] placeholder-[#4B556D] font-mono text-xs focus:border-[#00F0FF] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[11px] font-bold text-[#F0F4FC] uppercase tracking-wider">
                Private Deliberation Notes (Jury Panel Chamber Only)
              </label>
              <textarea
                rows={2}
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                placeholder="Private notes for discussion during jury video consensus room..."
                className="w-full bg-[#090D18] border border-[#182238] rounded-lg p-3 text-[#F0F4FC] placeholder-[#4B556D] font-mono text-xs focus:border-[#00F0FF] focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-3 p-3.5 rounded-lg bg-[#090D18] border border-[#182238] cursor-pointer text-xs font-mono">
              <input
                type="checkbox"
                checked={recommendForAward}
                onChange={(e) => setRecommendForAward(e.target.checked)}
                className="rounded bg-[#11182B] border-[#182238] text-[#FF5500] focus:ring-0"
              />
              <div>
                <span className="font-bold text-[#F0F4FC] uppercase block">Recommend for Track Award Shortlist</span>
                <span className="text-[10px] text-[#8E9BB5] font-sans">Flag this target for the Grand Consensus prize deliberation round</span>
              </div>
            </label>
          </div>
        </SystemPanel>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="md" onClick={() => navigate('/judge/projects')}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            icon={<CheckCircle className="w-4 h-4" />}
            className="shadow-md shadow-[#FF5500]/25"
          >
            Lock Score to Consensus Matrix
          </Button>
        </div>
      </form>
    </div>
  );
};
