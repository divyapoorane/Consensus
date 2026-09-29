import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { SpaceBackground } from '../../components/orbital/SpaceBackground';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { TechnicalLabel } from '../../components/orbital/TechnicalLabel';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { OrbitalRing } from '../../components/orbital/OrbitalRing';
import { useAuth } from '../../auth/MockAuthProvider';
import { organizerService } from '../../services/organizer/organizerService';
import { participantService } from '../../services/participant/participantService';
import { Search } from '../../components/ui/Search';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SectionEyebrow } from '../../components/shared/SectionEyebrow';
import {
  FolderGit2,
  Trophy,
  Users,
  ExternalLink,
  Github,
  Globe,
  CheckCircle2,
  Loader2,
  Code,
  Tag,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  Search as SearchIcon,
} from 'lucide-react';

export interface GalleryProject {
  id: string;
  projectId: string;
  title: string;
  tagline: string;
  description: string;
  hackathonId: string;
  hackathonTitle: string;
  teamName: string;
  techStack: string[];
  repositoryUrl: string;
  demoUrl: string;
  documentationUrl?: string;
  status: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
  submittedAt?: string;
  thumbnailUrl?: string;
}

export const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [hackathonsList, setHackathonsList] = useState<{ id: string; title: string }[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected Project for Detail Modal
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);

  useEffect(() => {
    async function loadGalleryData() {
      try {
        setLoading(true);
        const [hackathons, participantProjects, participantSubmissions, organizerSubmissions] =
          await Promise.all([
            organizerService.getHackathons(),
            participantService.getProjects(),
            participantService.getSubmissions(),
            organizerService.getSubmissions(),
          ]);

        if (hackathons && Array.isArray(hackathons)) {
          setHackathonsList(
            hackathons.map((h: any) => ({
              id: h.id,
              title: h.name || h.title,
            }))
          );
        }

        // Aggregate submissions from available backend sources
        const allSubs = [
          ...(Array.isArray(participantSubmissions) ? participantSubmissions : []),
          ...(Array.isArray(organizerSubmissions) ? organizerSubmissions : []),
        ];

        // Deduplicate submissions by id or projectId
        const seenIds = new Set<string>();
        const uniqueSubs = allSubs.filter((s: any) => {
          const key = s.projectId || s.id;
          if (seenIds.has(key)) return false;
          seenIds.add(key);
          return true;
        });

        // Also check if participant has projects marked as Submitted or Ready
        const mappedProjects: GalleryProject[] = [];

        // Match submissions with project data
        for (const sub of uniqueSubs) {
          const s = sub as any;
          const matchedProj = (participantProjects || []).find(
            (p) => p.id === s.projectId || p.id === s.id
          );
          const hack = (hackathons || []).find((h: any) => h.id === s.hackathonId);

          mappedProjects.push({
            id: s.id,
            projectId: s.projectId || s.id,
            title: s.projectTitle || matchedProj?.title || 'Consensus Submission',
            tagline: matchedProj?.tagline || 'Verified Prototype Submission',
            description: matchedProj?.description || 'Built for the Consensus Hackathon Arena.',
            hackathonId: s.hackathonId,
            hackathonTitle: s.hackathonTitle || hack?.name || 'Arena Challenge',
            teamName: s.teamName || 'Solo Builder',
            techStack: matchedProj?.techStack || s.techStack || [],
            repositoryUrl: matchedProj?.repositoryUrl || s.repoUrl || '',
            demoUrl: matchedProj?.demoUrl || s.demoUrl || '',
            documentationUrl: matchedProj?.documentationUrl || '',
            status: s.status,
            score: s.score ?? s.consensusScore ?? s.averageScore,
            maxScore: s.maxScore || 100,
            feedback: s.feedback,
            submittedAt: s.submittedAt,
          });
        }

        // Include any standalone submitted projects from participant's projects
        for (const proj of participantProjects || []) {
          if (
            proj.status === 'Submitted' &&
            !mappedProjects.some((m) => m.projectId === proj.id)
          ) {
            const hack = (hackathons || []).find((h: any) => h.id === proj.hackathonId);
            mappedProjects.push({
              id: proj.id,
              projectId: proj.id,
              title: proj.title,
              tagline: proj.tagline || 'Prototype Submission',
              description: proj.description || 'Built for the Consensus Hackathon Arena.',
              hackathonId: proj.hackathonId,
              hackathonTitle: proj.hackathonTitle || hack?.name || 'Arena Challenge',
              teamName: 'Registered Builder',
              techStack: proj.techStack || [],
              repositoryUrl: proj.repositoryUrl || '',
              demoUrl: proj.demoUrl || '',
              documentationUrl: proj.documentationUrl || '',
              status: 'submitted',
              submittedAt: proj.updatedAt,
            });
          }
        }

        setProjects(mappedProjects);
      } catch (err) {
        console.warn('Failed to load gallery data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadGalleryData();
  }, []);

  // Collect all unique tech stack tokens for filter pills
  const allTechStacks = Array.from(
    new Set(projects.flatMap((p) => p.techStack || []))
  ).slice(0, 8);

  const filteredProjects = projects.filter((p) => {
    const matchesHackathon =
      selectedHackathon === 'all' || p.hackathonId === selectedHackathon;
    const matchesTech =
      selectedTech === 'all' || p.techStack.includes(selectedTech);
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesHackathon && matchesTech && matchesQuery;
  });

  return (
    <div className="relative min-h-screen bg-[#06080F] text-zinc-100 flex flex-col justify-between selection:bg-[#FF5500]/30 selection:text-white overflow-x-hidden font-sans">
      <SpaceBackground showConstellation={true} density="medium" />

      <Navbar
        session={{
          isLoggedIn: isAuthenticated,
          name: user?.name || '',
          role: user?.role || 'participant',
          email: user?.email || '',
        }}
        onLogout={logout}
      />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1">
        {/* Orbital Eyebrow & Hero Header */}
        <div className="mb-10">
          <SectionEyebrow number="05" label="PROJECT CONSTELLATION" status="VERIFIED PROTOTYPES" />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
                Project Constellation
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                Autonomous multi-agent architectures, decentralized infrastructure, and live prototypes forged in the Consensus Hackathon Arena and validated by empaneled jurors.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 bg-[#090D18] px-3.5 py-2 rounded-xl border border-white/5">
              <span>CONSTELLATION NODES: <strong className="text-white">{projects.length}</strong></span>
              <span>•</span>
              <span className="text-[#00F0FF] flex items-center gap-1.5">
                <StatusBeacon color="cyan" size="sm" pulse />
                DISPLAYED: {filteredProjects.length}
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Terminal Search Bar */}
        <div className="bg-[#090D18]/90 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Search
                placeholder="Search constellation by title, squad, architecture, or tech stack..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            {hackathonsList.length > 0 && (
              <div className="sm:w-72">
                <select
                  value={selectedHackathon}
                  onChange={(e) => setSelectedHackathon(e.target.value)}
                  className="w-full bg-[#0D1220] border border-white/10 text-xs text-zinc-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#FF5500] transition-colors font-mono"
                >
                  <option value="all">All Arenas & Challenges ({projects.length})</option>
                  {hackathonsList.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Technology Chips */}
          {allTechStacks.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 flex-wrap">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Sector Filter:</span>
              <button
                onClick={() => setSelectedTech('all')}
                className={`text-[10px] font-mono px-2.5 py-1 rounded transition-all ${
                  selectedTech === 'all'
                    ? 'bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40 font-bold'
                    : 'text-zinc-400 bg-[#0D1220] border border-white/5 hover:border-white/20'
                }`}
              >
                ALL TECHNOLOGIES
              </button>
              {allTechStacks.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech === selectedTech ? 'all' : tech)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded transition-all ${
                    selectedTech === tech
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                      : 'text-zinc-400 bg-[#0D1220] border border-white/5 hover:border-white/20'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="bg-[#090D18] border border-white/5 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#FF5500] animate-spin mb-3" />
            <p className="text-xs text-zinc-400 font-mono">Synchronizing constellation nodes from the arena ledger...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-[#090D18] border border-white/5 rounded-2xl p-12 sm:p-16 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0D1220] border border-white/10 flex items-center justify-center text-[#FF5500] mx-auto">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">
              No constellation nodes match current parameters.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Clear your search filters or deploy a new prototype into an active hackathon sprint to expand the Consensus Constellation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/hackathons')}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Explore Active Arenas
              </Button>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/participant/projects')}
                  icon={<FolderGit2 className="w-4 h-4" />}
                >
                  Workspace Build Bay
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* CONSTELLATION ASYMMETRIC GRID WITH VARYING TILE ELEVATIONS */
          <div className="space-y-6">
            {/* Top Constellation Hero (First Project) */}
            {filteredProjects[0] && (
              <div
                onClick={() => setSelectedProject(filteredProjects[0])}
                className="bg-[#090D18] border border-[#FF5500]/30 hover:border-[#FF5500] rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-200 group relative overflow-hidden shadow-[0_0_30px_rgba(255,85,0,0.1)]"
              >
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FF5500]/10 blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <StatusBeacon color="orange" size="sm" pulse />
                        PRIMARY CONSTELLATION NODE
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-[#0D1220] border border-white/5">
                        {filteredProjects[0].hackathonTitle}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          filteredProjects[0].status === 'evaluated'
                            ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                            : 'bg-[#00E575]/10 text-[#00E575] border-[#00E575]/30'
                        }`}
                      >
                        {filteredProjects[0].status === 'evaluated' ? 'EVALUATED' : 'DEPLOYED'}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-black text-white group-hover:text-[#FF5500] transition-colors font-display tracking-tight">
                      {filteredProjects[0].title}
                    </h2>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2">
                      {filteredProjects[0].tagline || filteredProjects[0].description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {filteredProjects[0].techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono text-zinc-300 px-2.5 py-0.5 rounded bg-[#0D1220] border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry panel */}
                  <div className="lg:col-span-5 bg-[#06080F] border border-white/10 rounded-xl p-5 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-[10px] text-zinc-500 uppercase">Squad:</span>
                      <span className="font-semibold text-white">{filteredProjects[0].teamName}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-[10px] text-zinc-500 uppercase">Consensus Score:</span>
                      <span className="font-bold text-[#FF5500] text-sm">
                        {filteredProjects[0].score !== undefined
                          ? `${filteredProjects[0].score} / ${filteredProjects[0].maxScore || 100}`
                          : 'DELIBERATION PENDING'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#00E575] flex items-center gap-1.5">
                        <StatusBeacon color="green" size="sm" />
                        LIVE ARTIFACT
                      </span>
                      <span className="text-xs text-[#00F0FF] flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                        <span>Inspect Architecture</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Remaining Projects in Dense Constellation Grid */}
            {filteredProjects.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.slice(1).map((project, idx) => {
                  const isFeaturedSecond = idx === 0;
                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`bg-[#090D18] border rounded-xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between group space-y-4 relative overflow-hidden ${
                        isFeaturedSecond
                          ? 'border-[#00F0FF]/30 hover:border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.08)]'
                          : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-[#0D1220] border border-white/5 truncate max-w-[170px]">
                            {project.hackathonTitle}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                              project.status === 'evaluated'
                                ? 'bg-purple-950/40 text-purple-300 border-purple-500/20'
                                : 'bg-[#00E575]/10 text-[#00E575] border-[#00E575]/20'
                            }`}
                          >
                            {project.status === 'evaluated' ? 'EVALUATED' : 'SUBMITTED'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors truncate font-display">
                          {project.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {project.tagline || project.description}
                        </p>

                        {project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.techStack.slice(0, 3).map((t, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-[#0D1220] border border-white/5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-500 text-[11px] truncate max-w-[130px]">
                          {project.teamName}
                        </span>
                        <span className="text-xs font-semibold text-[#00F0FF] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Inspect Node</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* GALLERY PROJECT DETAIL MODAL */}
      {selectedProject && (
        <Modal
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          subtitle={`Submitted for ${selectedProject.hackathonTitle}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 pt-2">
            {/* Header Specs Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-[#06080F] border border-white/10 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Squad / Builders
                </span>
                <span className="font-semibold text-white truncate block">
                  {selectedProject.teamName}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Submission Status
                </span>
                <span
                  className={`font-semibold capitalize ${
                    selectedProject.status === 'evaluated'
                      ? 'text-purple-300'
                      : 'text-[#00E575]'
                  }`}
                >
                  {selectedProject.status}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Consensus Score
                </span>
                <span className="font-mono font-semibold text-[#FF5500]">
                  {selectedProject.score !== undefined
                    ? `${selectedProject.score}/${selectedProject.maxScore || 100}`
                    : 'Deliberation Pending'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Architecture & Overview</span>
              </h4>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed bg-[#06080F] p-3.5 rounded-lg border border-white/5 font-sans">
                {selectedProject.description || selectedProject.tagline}
              </p>
            </div>

            {/* Tech Stack */}
            {selectedProject.techStack.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#FF5500]" />
                  <span>Verified Tech Stack</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono text-zinc-300 px-2.5 py-1 rounded bg-[#0D1220] border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Juror Feedback (if evaluated) */}
            {selectedProject.feedback && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Jury Deliberation Consensus</span>
                </h4>
                <p className="text-xs text-zinc-300 bg-purple-950/20 border border-purple-500/30 p-3 rounded-lg leading-relaxed font-sans">
                  {selectedProject.feedback}
                </p>
              </div>
            )}

            {/* Deliverable Public Links */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00E575]" />
                <span>Verified Deliverable Repositories</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProject.repositoryUrl ? (
                  <a
                    href={selectedProject.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-[#06080F] border border-white/10 hover:border-white/20 transition-colors text-xs text-white"
                  >
                    <span className="flex items-center gap-2 font-mono">
                      <Github className="w-4 h-4 text-[#FF5500]" />
                      <span>Source Repository</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                ) : (
                  <div className="p-3 rounded-lg bg-[#06080F] border border-white/5 text-xs text-zinc-500 flex items-center gap-2 font-mono">
                    <Github className="w-4 h-4 text-zinc-600" />
                    <span>No repository URL provided</span>
                  </div>
                )}

                {selectedProject.demoUrl ? (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-[#06080F] border border-white/10 hover:border-white/20 transition-colors text-xs text-white"
                  >
                    <span className="flex items-center gap-2 font-mono">
                      <Globe className="w-4 h-4 text-[#00E575]" />
                      <span>Live Deployment</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                ) : (
                  <div className="p-3 rounded-lg bg-[#06080F] border border-white/5 text-xs text-zinc-500 flex items-center gap-2 font-mono">
                    <Globe className="w-4 h-4 text-zinc-600" />
                    <span>No live demo URL provided</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/hackathons/${selectedProject.hackathonId}`)}
              >
                View Track Arena
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
