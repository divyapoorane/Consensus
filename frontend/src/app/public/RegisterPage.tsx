import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/MockAuthProvider';
import { ROLE_DEFAULT_DASHBOARD } from '../../auth/roleConfig';
import { UserRole } from '../../types/auth';
import { StarfieldCanvas } from '../../components/StarfieldCanvas';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowRight, Lock, Mail, User, Terminal, Shield, Award, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('participant');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email');
      return;
    }

    try {
      const user = await register({
        name,
        email,
        password,
        role: selectedRole,
      });

      const targetDashboard = ROLE_DEFAULT_DASHBOARD[user.role] || '/participant/dashboard';
      navigate(targetDashboard, { replace: true });
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  const registrationRoles: { id: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'participant',
      title: 'Participant',
      desc: 'Build projects and compete in hackathons',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'organizer',
      title: 'Organizer',
      desc: 'Host hackathon tracks and manage submissions',
      icon: <Shield className="w-4 h-4 text-[#FF7F50]" />,
    },
    {
      id: 'judge',
      title: 'Judge',
      desc: 'Evaluate submissions via consensus scoring',
      icon: <Award className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#111111] text-[#F5F5F0] flex items-center justify-center p-4 selection:bg-[#FF6B35]/25 font-sans overflow-x-hidden">
      <StarfieldCanvas particleCount={40} />

      <div className="relative z-10 w-full max-w-md my-8">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-[#F5F5F0]">
              Consensus
            </span>
          </Link>
          <div className="text-xs text-[#A1A1A1]">
            Create an Account
          </div>
        </div>

        <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-xl p-6 sm:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#F5F5F0]">Register</h2>
            <p className="text-xs text-[#A1A1A1] mt-0.5">
              Join engineers and organizers building on Consensus.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Account Track Selection */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#A1A1A1] mb-2">
              Select Account Type
            </label>
            <div className="space-y-2">
              {registrationRoles.map((r) => {
                const active = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      active
                        ? 'border-[#FF6B35]/60 bg-[#202020] text-white shadow-sm'
                        : 'border-[#2A2A2A] bg-[#141414] text-[#A1A1A1] hover:border-[#383838] hover:text-[#F5F5F0]'
                    }`}
                  >
                    <div className="p-1.5 rounded bg-[#181818] border border-[#2A2A2A] flex-shrink-0">
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#F5F5F0] leading-tight">{r.title}</p>
                      <p className="text-[10px] text-[#A1A1A1]">{r.desc}</p>
                    </div>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        active ? 'border-[#FF6B35] bg-[#FF6B35]' : 'border-[#2A2A2A]'
                      }`}
                    >
                      {active && <div className="w-1 h-1 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#777777] mt-2 text-center font-mono">
              Admin privileges cannot be self-registered and are provisioned via internal platform governance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="e.g. Alex Vance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-3"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Register as {selectedRole.toUpperCase()}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#2A2A2A] text-center text-xs text-[#A1A1A1]">
            <span>Already have an account? </span>
            <Link to="/login" className="text-[#FF7F50] font-medium hover:underline">
              Log in
            </Link>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link to="/" className="text-xs text-[#A1A1A1] hover:text-[#F5F5F0] transition-colors">
            ← Return to Consensus Home
          </Link>
        </div>
      </div>
    </div>
  );
};
