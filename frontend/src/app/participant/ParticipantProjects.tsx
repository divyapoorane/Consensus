import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { participantService } from '../../services/participant/participantService';
import { ParticipantProject, ParticipantHackathon } from '../../types/participant';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  FolderGit2,
  PlusCircle,
  ExternalLink,
  Github,
  BookOpen,
  Calendar,
  Send,
  Terminal,
  Code2,
  Globe,
  Users,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const ParticipantProjects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ParticipantProject[]>([]);
  const [enrolledHackathons, setEnrolledHackathons] = useState<ParticipantHackathon[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New project form state
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [documentationUrl, setDocumentationUrl] = useState('');

  useEffect(() => {
    participantService.getProjects().then((pList) => {
      setProjects(pList);
      if (pList.length > 0) {
        setSelectedProjectId(pList[0].id);
      }
    });
    participantService.getHackathons().then((hList) => {
      setEnrolledHackathons(hList);
      if (hList.length > 0) {
        setSelectedHackathonId(hList[0].id);
      }
    });
  }, []);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleSubmitProject = async (projId: string) => {
    const res = await participantService.submitProject(projId);
    if (res) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projId ? { ...p, status: 'Submitted' } : p))
      );
      navigate('/participant/submissions');
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetHack = enrolledHackathons.find((h) => h.id === selectedHackathonId) || enrolledHackathons[0];
    if (!targetHack?.id) return;

    const newProj = await participantService.createProject({
      hackathonId: targetHack.id,
      hackathonTitle: targetHack.title,
      title,
      tagline,
      description,
      techStack: techStackInput.split(',').map((s) => s.trim()).filter(Boolean),
      repositoryUrl,
      demoUrl,
      documentationUrl,
      status: 'Ready for Submission',
    });

    setProjects([newProj, ...projects]);
    setSelectedProjectId(newProj.id);
    setTitle('');
    setTagline('');
    setDescription('');
    setTechStackInput('');
    setRepositoryUrl('');
    setDemoUrl('');
    setDocumentationUrl('');
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Mission Build Bay"
        subtitle="Developer workstation: prototype architecture, code repository telemetry, demo endpoints, and payload handoff."
        badge={<StatusBeacon status="active" label="BAY // OPERATIONAL" />}
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Initiate Build Bay
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-8 h-8 text-[#FF5500]" />}
          title="Build Bay is currently empty"
          description="Create your first hackathon project workspace to attach repositories, configure demo endpoints, and package deliverables for jury evaluation."
          actionLabel="Initiate Build Bay"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {/* Multi-Project Workstation Selector Rail */}
          {projects.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-mono text-[#8E9BB5] mr-1 uppercase">ACTIVE BAY:</span>
              {projects.map((proj, idx) => (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase whitespace-nowrap transition-colors cursor-pointer border ${
                    proj.id === activeProject?.id
                      ? 'bg-[#0D1220] border-[#00F0FF] text-[#00F0FF] font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'bg-[#090D18] border-[#182238] text-[#8E9BB5] hover:text-[#F0F4FC]'
                  }`}
                >
                  BAY-0{idx + 1} // {proj.title}
                </button>
              ))}
            </div>
          )}

          {/* DEVELOPER WORKSTATION CONSOLE */}
          {activeProject && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (7 cols): PROJECT CORE & TECH STACK */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. PROJECT CORE */}
                <SystemPanel
                  title="01 // PROJECT CORE"
                  badge={<StatusBeacon status={activeProject.status === 'Submitted' ? 'connected' : 'mission'} label={activeProject.status} />}
                  accent="orange"
                >
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono text-[#8E9BB5] px-2 py-0.5 rounded bg-[#090D18] border border-[#182238]">
                          TRACK: {activeProject.hackathonTitle}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#F0F4FC] font-mono uppercase">
                        {activeProject.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#FF7722] mt-1 font-mono">
                        {activeProject.tagline}
                      </p>
                    </div>

                    {/* Architecture Description Terminal */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-[#8E9BB5] flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>SYS::CORE_ARCHITECTURE</span>
                      </span>
                      <div className="p-4 rounded-lg bg-[#090D18] border border-[#182238] text-xs text-[#D1D1D1] font-mono leading-relaxed whitespace-pre-line">
                        {activeProject.description || 'No system architecture documentation filed for this project bay.'}
                      </div>
                    </div>
                  </div>
                </SystemPanel>

                {/* 2. TECH STACK */}
                <SystemPanel title="02 // TECH STACK MATRIX" accent="cyan">
                  <div className="flex flex-wrap gap-2">
                    {activeProject.techStack && activeProject.techStack.length > 0 ? (
                      activeProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded bg-[#090D18] border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase font-semibold"
                        >
                          [{tech}]
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#8E9BB5] font-mono">No framework or language tags configured.</span>
                    )}
                  </div>
                </SystemPanel>
              </div>

              {/* Right Column (5 cols): REPOSITORY, DEMO, TEAM, SUBMISSION STATUS */}
              <div className="lg:col-span-5 space-y-6">
                {/* 3. REPOSITORY & DEMO WORKSTATION */}
                <SystemPanel title="03 // SOURCE & DEMO PAYLOAD" accent="cyan">
                  <div className="space-y-3 font-mono text-xs">
                    {/* Repository */}
                    <div className="p-3 rounded-lg bg-[#090D18] border border-[#182238] space-y-1">
                      <span className="text-[10px] text-[#8E9BB5] uppercase block flex items-center gap-1">
                        <Github className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>GIT REPOSITORY</span>
                      </span>
                      {activeProject.repositoryUrl ? (
                        <a
                          href={activeProject.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00F0FF] hover:underline flex items-center gap-1 truncate block"
                        >
                          <span className="truncate">{activeProject.repositoryUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[#8E9BB5] italic">Not yet linked</span>
                      )}
                    </div>

                    {/* Live Demo */}
                    <div className="p-3 rounded-lg bg-[#090D18] border border-[#182238] space-y-1">
                      <span className="text-[10px] text-[#8E9BB5] uppercase block flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-[#00E575]" />
                        <span>PRODUCTION DEPLOYMENT</span>
                      </span>
                      {activeProject.demoUrl ? (
                        <a
                          href={activeProject.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00E575] hover:underline flex items-center gap-1 truncate block font-bold"
                        >
                          <span className="truncate">{activeProject.demoUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-[#8E9BB5] italic">Not yet deployed</span>
                      )}
                    </div>

                    {/* Documentation */}
                    {activeProject.documentationUrl && (
                      <div className="p-3 rounded-lg bg-[#090D18] border border-[#182238] space-y-1">
                        <span className="text-[10px] text-[#8E9BB5] uppercase block flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>DOCUMENTATION SPEC</span>
                        </span>
                        <a
                          href={activeProject.documentationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:underline flex items-center gap-1 truncate block"
                        >
                          <span className="truncate">{activeProject.documentationUrl}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                </SystemPanel>

                {/* 4. SQUAD AFFILIATION & 5. SUBMISSION STATUS */}
                <SystemPanel title="04 // LAUNCH & SUBMISSION GATE" accent="orange">
                  <div className="space-y-4 font-mono text-xs">
                    {/* Squad Info */}
                    <div className="p-3 rounded-lg bg-[#090D18] border border-[#182238] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#8E9BB5] uppercase block">ASSIGNED SQUAD</span>
                        <span className="font-bold text-[#F0F4FC]">{activeProject.teamName || 'Solo Builder'}</span>
                      </div>
                      <Users className="w-4 h-4 text-[#FF5500]" />
                    </div>

                    {/* Launch Action */}
                    <div className="p-4 rounded-lg bg-[#090D18] border border-[#FF5500]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#FF5500] uppercase">STATUS</span>
                        <StatusBeacon
                          status={activeProject.status === 'Submitted' ? 'connected' : 'mission'}
                          label={activeProject.status}
                        />
                      </div>

                      {activeProject.status === 'Submitted' ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-[#8E9BB5] font-sans">
                            Payload successfully locked in jury deliberation pool.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => navigate('/participant/submissions')}
                            icon={<Send className="w-3.5 h-3.5" />}
                          >
                            View Submission Gate
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[11px] text-[#8E9BB5] font-sans">
                            Run final validation checks and launch submission to double-blind jury.
                          </p>
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => handleSubmitProject(activeProject.id)}
                            icon={<Send className="w-3.5 h-3.5" />}
                          >
                            Launch to Jury Gate
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SystemPanel>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create New Workspace */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Initiate Mission Build Bay"
        subtitle="Establish a new project workstation for an enrolled hackathon challenge."
      >
        <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
          {enrolledHackathons.length === 0 ? (
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 font-mono">
              You must be registered for at least one hackathon track before creating a workspace.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] font-bold text-[#8E9BB5] uppercase tracking-wider">
                Target Hackathon Track
              </label>
              <select
                value={selectedHackathonId}
                onChange={(e) => setSelectedHackathonId(e.target.value)}
                className="w-full bg-[#090D18] border border-[#182238] rounded-lg p-2.5 text-[#F0F4FC] focus:border-[#00F0FF] focus:outline-none text-xs font-mono"
              >
                {enrolledHackathons.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Input
            label="Project Title"
            required
            placeholder="e.g. SynapseAgent: Autonomous Consensus"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="Tagline / Mission Summary"
            required
            placeholder="e.g. Distributed zero-knowledge routing matrix"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] font-bold text-[#8E9BB5] uppercase tracking-wider">
              System Architecture & Description
            </label>
            <textarea
              required
              rows={4}
              placeholder="Detail your technical architecture, algorithms, and implementation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#090D18] border border-[#182238] rounded-lg p-3 text-xs text-[#F0F4FC] placeholder-[#4B556D] font-mono focus:border-[#00F0FF] focus:outline-none transition-colors"
            />
          </div>

          <Input
            label="Tech Stack (comma-separated)"
            placeholder="e.g. React, TypeScript, Rust, WebAssembly"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
          />

          <Input
            label="Git Repository URL"
            placeholder="https://github.com/org/repo"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
          />

          <Input
            label="Live Deployment / Demo URL"
            placeholder="https://app.example.com"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
          />

          <Input
            label="Architecture Docs / Pitch Video URL"
            placeholder="https://docs.example.com or YouTube link"
            value={documentationUrl}
            onChange={(e) => setDocumentationUrl(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Initialize Project Bay
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
