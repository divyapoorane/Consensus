import React, { useState } from 'react';
import { UserRole } from '../types';
import { X, Shield, Terminal, Award, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (name: string, role: UserRole, email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('participant');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userName = name.trim() || (mode === 'signup' ? 'Arena Builder' : 'Consensus Member');
      onSuccess(userName, selectedRole, email);
      onClose();
    }, 350);
  };

  const roleOptions: { id: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'participant',
      label: 'Participant',
      icon: <Terminal className="w-4 h-4" />,
      desc: 'Build & compete',
    },
    {
      id: 'organizer',
      label: 'Organizer',
      icon: <Shield className="w-4 h-4" />,
      desc: 'Create hackathons',
    },
    {
      id: 'judge',
      label: 'Judge',
      icon: <Award className="w-4 h-4" />,
      desc: 'Review projects',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: <Shield className="w-4 h-4 text-rose-400" />,
      desc: 'Platform control',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-xl p-6 text-[#F5F5F0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A1A1A1] hover:text-[#F5F5F0] rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs text-[#A1A1A1] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
            <span className="font-mono text-[11px] uppercase">Account Access</span>
          </div>
          <h2 className="text-xl font-bold text-[#F5F5F0]">
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#A1A1A1] mt-1">
            {mode === 'signup'
              ? 'Join as a participant, organizer, judge, or platform admin.'
              : 'Log in to access your hackathons and dashboard.'}
          </p>
        </div>

        {/* Role Selector Grid */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roleOptions.map((r) => {
              const active = selectedRole === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    active
                      ? 'border-[#FF6B35]/60 bg-[#202020] text-white shadow-sm'
                      : 'border-[#2A2A2A] bg-[#141414] text-[#A1A1A1] hover:border-[#383838] hover:text-[#F5F5F0]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={active ? 'text-[#FF7F50]' : 'text-[#A1A1A1]'}>
                      {r.icon}
                    </span>
                    {active && <Check className="w-3.5 h-3.5 text-[#FF7F50]" />}
                  </div>
                  <div>
                    <span className="text-xs font-semibold leading-tight block text-[#F5F5F0]">{r.label}</span>
                    <span className="text-[10px] text-[#A1A1A1]">{r.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-[#A1A1A1] font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[#A1A1A1] font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#A1A1A1] font-medium mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141414] border border-[#2A2A2A] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-xs text-[#F5F5F0] placeholder-[#666666] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-[#FF6B35] hover:bg-[#FF7F50] text-white font-semibold text-xs transition-colors duration-150 mt-2 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : mode === 'signup' ? (
              <span>Create {selectedRole.toUpperCase()} Account</span>
            ) : (
              <span>Sign In to Consensus</span>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3.5 border-t border-[#2A2A2A] text-center text-xs text-[#A1A1A1]">
          {mode === 'signup' ? (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#FF7F50] font-medium hover:underline ml-1 cursor-pointer"
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#FF7F50] font-medium hover:underline ml-1 cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
