import React, { useState, useEffect, useRef } from 'react';
import { judgeService } from '../../services/judge/judgeService';
import { JudgeLiveSession } from '../../types/judge';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { SystemPanel } from '../../components/orbital/SystemPanel';
import { StatusBeacon } from '../../components/orbital/StatusBeacon';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  MessageSquare,
  Award,
  ScreenShare,
  Info,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Plus,
  Send,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Radio,
  Sliders,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  time: string;
  text: string;
  isSelf?: boolean;
}

const SLIDES_CONTENT = [
  {
    number: 1,
    title: 'Architecture Overview & Protocol Topology',
    lead: 'Multi-modal consensus engine operating over optimistic rollups with sub-50ms finality.',
    bullet1: 'Direct P2P gossip layer with cryptographic zero-knowledge state proofs',
    bullet2: 'Byzantine fault tolerant quorum calculation with dynamic juror slashing',
  },
  {
    number: 2,
    title: 'Latency & Throughput Benchmarks',
    lead: 'Observed 12,400 TPS with 38ms average confirmation time under adversarial conditions.',
    bullet1: '99.4% reduction in state drift compared to standard raft protocols',
    bullet2: 'Linear horizontal scaling across 64 distributed validator shards',
  },
  {
    number: 3,
    title: 'Live Smart Contract Verification Flow',
    lead: 'Verifying on-chain state transitions directly within EVM and WASM execution sandboxes.',
    bullet1: 'Gas cost optimized: ~42k gas per verified multi-agent payload',
    bullet2: 'Automated replay attack defense via monotonic cryptographic nonces',
  },
  {
    number: 4,
    title: 'Byzantine Fault Tolerance Stress Test',
    lead: 'Zero state corruption when simulating 33% malicious peer injection in cluster.',
    bullet1: 'Automatic quarantine of deviating validator telemetry within 2 blocks',
    bullet2: 'Full transaction recovery without chain halt or manual operator intervention',
  },
  {
    number: 5,
    title: 'Open Source Ecosystem & Developer Roadmap',
    lead: 'Permissive MIT licensing, SDKs for Python, TypeScript, and Go, plus live documentation.',
    bullet1: '1-command local testnet deployment via Docker & CLI tooling',
    bullet2: 'Mainnet testnet launch scheduled with guaranteed prize escrow integration',
  },
];

export const LiveSessions: React.FC = () => {
  const [sessions, setSessions] = useState<JudgeLiveSession[]>([]);
  const [activeSession, setActiveSession] = useState<JudgeLiveSession | null>(null);
  const [filter, setFilter] = useState<'all' | 'live_now' | 'upcoming'>('all');

  // Live Room Controls & State
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presence' | 'rubric' | 'chat'>('presence');
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 mins
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // Rubric Scores
  const [scores, setScores] = useState({
    architecture: 22,
    innovation: 23,
    execution: 24,
    uiUx: 21,
  });
  const [jurorNotes, setJurorNotes] = useState(
    'Strong cryptographic proof verification and low latency. Ask about production validator incentives during Q&A.'
  );
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  // Chat Feed
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Dr. Sarah Lin',
      role: 'Autonomous Systems Juror',
      time: '12:02',
      text: 'Could you explain the rollback mechanism when peer consensus fails?',
    },
    {
      id: '2',
      sender: 'Alex Vance',
      role: 'Team Lead (NeuralForge)',
      time: '12:03',
      text: 'Yes! Slide 4 demonstrates optimistic rollbacks triggered by fraud proofs within 2 block intervals.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Instant Launch Modal
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    projectTitle: 'NeuralSynth: Autonomous Audio Agents',
    teamName: 'CyberAudio Squad',
    durationMinutes: 15,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const loadSessions = () => {
    judgeService.getLiveSessions().then(setSessions);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  // Handle webcam video stream
  useEffect(() => {
    if (!activeSession) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    if (isCameraOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Camera permission denied or unavailable, using simulation:', err);
          setHasCameraPermission(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeSession, isCameraOn]);

  // Handle screen sharing
  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null;
      }
      setIsSharingScreen(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        setIsSharingScreen(true);
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }
        stream.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
        };
      } catch (err) {
        console.warn('Screen sharing cancelled or unavailable:', err);
        setIsSharingScreen(false);
      }
    }
  };

  const handleJoin = (s: JudgeLiveSession) => {
    setActiveSession(s);
    setSecondsRemaining((s.durationMinutes || 15) * 60);
    setIsCameraOn(true);
    setIsMicOn(true);
    setIsSharingScreen(false);
    setScoreSubmitted(false);
    setCurrentSlideIdx(0);
  };

  const handleLeave = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    setActiveSession(null);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScoreSubmitted(true);
    setTimeout(() => setScoreSubmitted(false), 3500);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'You',
      role: 'Juror',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInput.trim(),
      isSelf: true,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const query = chatInput.trim();
    setChatInput('');

    // Simulated immediate squad answer
    setTimeout(() => {
      const answers = [
        'Excellent point! Our off-chain validator pipeline handles that via parallel shard workers.',
        'Great question! We specifically designed the zero-knowledge circuit to keep gas under 45k.',
        'Yes, we tested that in our Byzantine failure benchmarks and confirmed zero state deviation.',
      ];
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'Alex Vance',
        role: 'Team Lead (NeuralForge)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: answers[Math.floor(Math.random() * answers.length)],
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const handleInstantLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await judgeService.createLiveSession(newRoomData);
    setIsLaunchModalOpen(false);
    loadSessions();
    handleJoin(created);
  };

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'live_now') return s.roomStatus === 'live_now';
    if (filter === 'upcoming') return s.roomStatus === 'upcoming';
    return true;
  });

  const totalScore =
    scores.architecture + scores.innovation + scores.execution + scores.uiUx;

  // =========================================================================
  // VIEW 1: ACTIVE LIVE PRESENTATION ROOM
  // =========================================================================
  if (activeSession) {
    const roomId = activeSession.roomUrlPlaceholder || `JURY-ROOM-${activeSession.id.toUpperCase()}`;
    const slide = SLIDES_CONTENT[currentSlideIdx];

    return (
      <div className="space-y-4">
        {/* Room Header & Telemetry Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#090D18] border border-[#00F0FF]/30 shadow-[0_0_25px_rgba(0,240,255,0.12)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5500]/15 border border-[#FF5500]/40 text-xs font-mono text-[#FF5500] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
              LIVE PRESENTATION CHAMBER
            </span>
            <span className="font-mono text-xs text-zinc-400">
              ROOM: <strong className="text-white">{roomId}</strong>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-200 font-semibold truncate max-w-sm">
              {activeSession.projectTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#06080F] border border-white/10 text-xs font-mono text-zinc-200">
              <Clock className="w-4 h-4 text-[#00F0FF]" />
              <span className="font-bold">{formatTimer(secondsRemaining)} remaining</span>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLeave}
              icon={<PhoneOff className="w-4 h-4" />}
            >
              Leave Room
            </Button>
          </div>
        </div>

        {/* Room Stage: Main Video Presentation Grid (2 Cols) + Sidebar (1 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Video / Stage Area (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tile 1: Juror Camera (Current User) */}
              <div className="relative aspect-video rounded-xl bg-[#06080F] border border-[#00F0FF]/30 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.08)]">
                {isCameraOn && hasCameraPermission ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#818CF8] flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
                      YOU
                    </div>
                    <p className="text-xs text-white font-medium">Empaneled Juror Feed</p>
                    <span className="text-[10px] font-mono text-zinc-400 block">
                      {isCameraOn ? 'Live Webcam Stream Active' : 'Camera Muted'}
                    </span>
                  </div>
                )}

                {/* Inset Badge */}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-[#06080F]/80 backdrop-blur-md text-[10px] font-mono text-zinc-200 border border-white/10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E575] animate-pulse" />
                  <span>You (Empaneled Juror)</span>
                  {isMicOn ? (
                    <Mic className="w-3 h-3 text-[#00E575]" />
                  ) : (
                    <MicOff className="w-3 h-3 text-rose-400" />
                  )}
                </div>
              </div>

              {/* Tile 2: Presenting Squad Screen Share / Slide Deck */}
              <div className="relative aspect-video rounded-xl bg-[#06080F] border border-[#FF5500]/30 overflow-hidden flex flex-col justify-between p-3.5 shadow-[0_0_20px_rgba(255,85,0,0.08)]">
                {/* Header of Stage */}
                <div className="flex items-center justify-between z-10">
                  <span className="px-2 py-0.5 rounded bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 text-[10px] font-mono font-bold uppercase">
                    PRESENTING: {activeSession.teamName}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#00E575]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E575] animate-pulse" />
                    <span>AUDIO 48KHZ</span>
                  </div>
                </div>

                {/* Real Screen Share or Interactive Slide Deck */}
                {isSharingScreen ? (
                  <div className="relative w-full h-full my-auto flex items-center justify-center">
                    <video
                      ref={screenVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="my-auto text-center space-y-2 py-2 px-3 bg-[#090D18] border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>SLIDE {currentSlideIdx + 1} OF {SLIDES_CONTENT.length}</span>
                      <span className="text-[#00F0FF]">LIVE PROTOTYPE DEMO</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white font-display leading-snug">
                      {slide.title}
                    </h4>
                    <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed font-sans">
                      {slide.lead}
                    </p>
                  </div>
                )}

                {/* Footer Controls of Slide */}
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/5 z-10">
                  <span className="text-zinc-300">Speaker: Alex Vance (Lead)</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentSlideIdx((prev) => Math.max(0, prev - 1))}
                      disabled={currentSlideIdx === 0}
                      className="p-1 rounded bg-[#090D18] hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentSlideIdx((prev) =>
                          Math.min(SLIDES_CONTENT.length - 1, prev + 1)
                        )
                      }
                      disabled={currentSlideIdx === SLIDES_CONTENT.length - 1}
                      className="p-1 rounded bg-[#090D18] hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tile 3: Co-Juror Dr. Sarah Lin */}
              <div className="relative aspect-video rounded-xl bg-[#06080F] border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="text-center p-3 space-y-1.5">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#0D1220] border-2 border-[#00E575]/50 flex items-center justify-center text-zinc-200 font-bold text-sm shadow-[0_0_10px_rgba(0,229,117,0.2)]">
                    SL
                  </div>
                  <p className="text-xs text-white font-semibold">Dr. Sarah Lin</p>
                  <span className="text-[10px] font-mono text-zinc-400">Autonomous Systems Juror</span>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#06080F]/80 text-[10px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E575]" />
                  <span>Dr. Sarah Lin</span>
                  <Mic className="w-3 h-3 text-[#00E575]" />
                </div>
              </div>

              {/* Tile 4: Co-Juror Elena Rostova */}
              <div className="relative aspect-video rounded-xl bg-[#06080F] border border-white/10 overflow-hidden flex items-center justify-center">
                <div className="text-center p-3 space-y-1.5">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#0D1220] border-2 border-indigo-500/40 flex items-center justify-center text-zinc-300 font-bold text-sm">
                    ER
                  </div>
                  <p className="text-xs text-white font-semibold">Elena Rostova</p>
                  <span className="text-[10px] font-mono text-zinc-400">Cryptography Juror</span>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#06080F]/80 text-[10px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span>Elena Rostova</span>
                  <MicOff className="w-3 h-3 text-zinc-500" />
                </div>
              </div>
            </div>

            {/* Media Action Control Strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 p-3.5 rounded-2xl bg-[#090D18] border border-white/10">
              <Button
                variant={isMicOn ? 'outline' : 'danger'}
                size="sm"
                onClick={() => setIsMicOn(!isMicOn)}
                icon={isMicOn ? <Mic className="w-4 h-4 text-[#00E575]" /> : <MicOff className="w-4 h-4" />}
              >
                {isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              </Button>

              <Button
                variant={isCameraOn ? 'outline' : 'danger'}
                size="sm"
                onClick={() => setIsCameraOn(!isCameraOn)}
                icon={isCameraOn ? <Video className="w-4 h-4 text-[#00F0FF]" /> : <VideoOff className="w-4 h-4" />}
              >
                {isCameraOn ? 'Stop Camera' : 'Start Camera'}
              </Button>

              <Button
                variant={isSharingScreen ? 'primary' : 'outline'}
                size="sm"
                onClick={toggleScreenShare}
                icon={<ScreenShare className="w-4 h-4" />}
              >
                {isSharingScreen ? 'Stop Screen Share' : 'Share My Screen'}
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={handleLeave}
                icon={<PhoneOff className="w-4 h-4" />}
              >
                Leave Session
              </Button>
            </div>
          </div>

          {/* Right Sidebar: Presence / Scorecard / Q&A Chat (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-[#090D18] border border-white/10 flex flex-col h-[540px] overflow-hidden">
            {/* Nav Tabs */}
            <div className="grid grid-cols-3 border-b border-white/10 text-xs font-mono bg-[#06080F]">
              <button
                onClick={() => setActiveTab('presence')}
                className={`py-3 font-semibold transition-colors ${
                  activeTab === 'presence'
                    ? 'text-[#00F0FF] border-b-2 border-[#00F0FF] bg-[#00F0FF]/5'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Presence (5)
              </button>
              <button
                onClick={() => setActiveTab('rubric')}
                className={`py-3 font-semibold transition-colors ${
                  activeTab === 'rubric'
                    ? 'text-[#FF5500] border-b-2 border-[#FF5500] bg-[#FF5500]/5'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Scorecard
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-3 font-semibold transition-colors ${
                  activeTab === 'chat'
                    ? 'text-[#818CF8] border-b-2 border-[#818CF8] bg-[#818CF8]/5'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Q&A Chat
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 flex-1 overflow-y-auto text-xs space-y-4">
              {/* TAB 1: PRESENCE */}
              {activeTab === 'presence' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block mb-2">
                      Empaneled Jurors (3)
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#06080F] border border-white/5">
                        <span className="font-semibold text-white">You (Juror)</span>
                        <span className="text-[10px] font-mono text-[#00E575] flex items-center gap-1">
                          <StatusBeacon color="green" size="sm" />
                          ACTIVE
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#06080F] border border-white/5">
                        <span className="text-zinc-200">Dr. Sarah Lin</span>
                        <span className="text-[10px] font-mono text-[#00F0FF] flex items-center gap-1">
                          <StatusBeacon color="cyan" size="sm" pulse />
                          SPEAKING
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#06080F] border border-white/5">
                        <span className="text-zinc-200">Elena Rostova</span>
                        <span className="text-[10px] font-mono text-zinc-500">MUTED</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block mb-2">
                      Presenters & Squad (2)
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#06080F] border border-white/5">
                        <span className="text-zinc-200">Alex Vance (Team Lead)</span>
                        <span className="text-[10px] font-mono text-[#FF5500] font-bold">
                          PRESENTING
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#06080F] border border-white/5">
                        <span className="text-zinc-300">Marcus Chen (Core Dev)</span>
                        <span className="text-[10px] font-mono text-zinc-400">LISTENING</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SCORECARD / RUBRIC */}
              {activeTab === 'rubric' && (
                <form onSubmit={handleScoreSubmit} className="space-y-4">
                  <div className="p-3 rounded-lg bg-[#06080F] border border-[#FF5500]/20 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Deliberation Composite:</span>
                    <span className="text-xl font-black text-[#FF5500] font-mono">
                      {totalScore} / 100
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs font-mono">
                      <span className="text-zinc-300">Technical Architecture</span>
                      <span className="text-[#00F0FF] font-bold">{scores.architecture}/25</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={scores.architecture}
                      onChange={(e) =>
                        setScores({ ...scores, architecture: Number(e.target.value) })
                      }
                      className="w-full accent-[#00F0FF]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs font-mono">
                      <span className="text-zinc-300">Innovation & Novelty</span>
                      <span className="text-[#FF5500] font-bold">{scores.innovation}/25</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={scores.innovation}
                      onChange={(e) =>
                        setScores({ ...scores, innovation: Number(e.target.value) })
                      }
                      className="w-full accent-[#FF5500]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs font-mono">
                      <span className="text-zinc-300">Execution & Demo Proof</span>
                      <span className="text-[#00E575] font-bold">{scores.execution}/25</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={scores.execution}
                      onChange={(e) =>
                        setScores({ ...scores, execution: Number(e.target.value) })
                      }
                      className="w-full accent-[#00E575]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs font-mono">
                      <span className="text-zinc-300">UI/UX & Polish</span>
                      <span className="text-purple-400 font-bold">{scores.uiUx}/25</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={scores.uiUx}
                      onChange={(e) => setScores({ ...scores, uiUx: Number(e.target.value) })}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">
                      Juror Notes & Feedback
                    </label>
                    <textarea
                      rows={2}
                      value={jurorNotes}
                      onChange={(e) => setJurorNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-[#06080F] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#FF5500] font-mono"
                    />
                  </div>

                  {scoreSubmitted ? (
                    <div className="p-3 rounded-lg bg-[#00E575]/15 border border-[#00E575]/30 text-[#00E575] text-xs flex items-center gap-2 font-mono">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Scorecard committed to consensus pool!</span>
                    </div>
                  ) : (
                    <Button variant="primary" size="sm" type="submit" className="w-full">
                      Submit Deliberation Score
                    </Button>
                  )}
                </form>
              )}

              {/* TAB 3: LIVE Q&A CHAT */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full justify-between space-y-3">
                  <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                          msg.isSelf
                            ? 'bg-[#00F0FF]/10 border-[#00F0FF]/30 ml-4'
                            : 'bg-[#06080F] border-white/5 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span
                            className={
                              msg.isSelf
                                ? 'text-[#00F0FF] font-bold'
                                : 'text-[#FF5500] font-semibold'
                            }
                          >
                            {msg.sender} ({msg.role})
                          </span>
                          <span className="text-zinc-500">{msg.time}</span>
                        </div>
                        <p className="text-zinc-200 leading-relaxed font-sans">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <input
                      type="text"
                      placeholder="Ask presenting squad a question..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#06080F] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-2 rounded-lg bg-[#00F0FF] hover:bg-[#38BDF8] disabled:opacity-40 text-slate-950 font-bold cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: SESSIONS LIST & LOBBY VIEW
  // =========================================================================
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Live Pitch & Presentation Rooms"
        subtitle="Empaneled juror interactive deliberation rooms for finalist demo day walkthroughs and Q&A scoring."
        badge={
          <span className="text-[10px] font-mono bg-[#0D1220] text-[#00F0FF] border border-[#00F0FF]/30 px-2.5 py-0.5 rounded-full uppercase font-medium flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
            <StatusBeacon color="cyan" size="sm" pulse />
            <span>PITCH BROADCAST GATEWAY // ONLINE</span>
          </span>
        }
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsLaunchModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Instant Launch Room
          </Button>
        }
      />

      {/* Info Telemetry Banner */}
      <div className="p-4 rounded-xl bg-[#090D18] border border-[#00F0FF]/30 relative overflow-hidden flex items-start gap-3 shadow-[0_0_20px_rgba(0,240,255,0.08)]">
        <Info className="w-5 h-5 text-[#00F0FF] shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 space-y-1">
          <p className="font-semibold text-white">
            Interactive Presentation Room Engine (No External Media Server Required)
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Click <strong>"Join Live Presentation"</strong> to step into an active jury deliberation room. Features real browser webcam & microphone toggles, live screen share streaming, interactive slide decks, real-time Q&A chat, and an instant consensus scorecard.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
            filter === 'all'
              ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
              : 'text-zinc-400 hover:text-white bg-[#090D18]'
          }`}
        >
          All Rooms ({sessions.length})
        </button>
        <button
          onClick={() => setFilter('live_now')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors flex items-center gap-1.5 ${
            filter === 'live_now'
              ? 'bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/40 font-bold'
              : 'text-zinc-400 hover:text-white bg-[#090D18]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-ping" />
          Live Broadcasting ({sessions.filter((s) => s.roomStatus === 'live_now').length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
            filter === 'upcoming'
              ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40 font-bold'
              : 'text-zinc-400 hover:text-white bg-[#090D18]'
          }`}
        >
          Upcoming ({sessions.filter((s) => s.roomStatus === 'upcoming').length})
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-4">
        {filteredSessions.map((sess) => {
          const isLive = sess.roomStatus === 'live_now';
          return (
            <div
              key={sess.id}
              className={`p-5 sm:p-6 rounded-2xl bg-[#090D18] border transition-all duration-200 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isLive
                  ? 'border-[#FF5500]/40 hover:border-[#FF5500] shadow-[0_0_25px_rgba(255,85,0,0.12)]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="neutral" size="sm">
                    {sess.hackathonTitle}
                  </Badge>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase flex items-center gap-1.5 ${
                      isLive
                        ? 'bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40'
                        : 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-ping" />}
                    {sess.scheduledTime}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-[#06080F] px-2 py-0.5 rounded border border-white/5">
                    {sess.jurorCount} JURORS EMPANELED
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  {sess.projectTitle}
                </h3>

                <p className="text-xs text-zinc-400">
                  Presenter Squad: <strong className="text-zinc-200">{sess.teamName}</strong> •{' '}
                  <span className="font-mono text-zinc-400">
                    {sess.durationMinutes} min walkthrough + Q&A
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant={isLive ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => handleJoin(sess)}
                  icon={<Video className="w-4 h-4" />}
                >
                  {isLive ? 'Join Live Presentation' : 'Preview Demo Chamber'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instant Launch Modal */}
      <Modal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        title="Launch Instant Presentation Chamber"
        subtitle="Spin up an on-demand live deliberation room for immediate testing or demo session."
      >
        <form onSubmit={handleInstantLaunch} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">PROJECT TITLE</label>
            <input
              type="text"
              required
              value={newRoomData.projectTitle}
              onChange={(e) =>
                setNewRoomData({ ...newRoomData, projectTitle: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#06080F] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F0FF] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">SQUAD NAME</label>
            <input
              type="text"
              required
              value={newRoomData.teamName}
              onChange={(e) =>
                setNewRoomData({ ...newRoomData, teamName: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#06080F] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F0FF] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">DURATION (MINUTES)</label>
            <input
              type="number"
              min={5}
              max={60}
              value={newRoomData.durationMinutes}
              onChange={(e) =>
                setNewRoomData({
                  ...newRoomData,
                  durationMinutes: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 bg-[#06080F] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#00F0FF] font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsLaunchModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Launch Room & Enter
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
