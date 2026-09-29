import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/MockAuthProvider';
import { ROLE_DEFAULT_DASHBOARD } from '../../auth/roleConfig';
import { StarfieldCanvas } from '../../components/StarfieldCanvas';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide your account email');
      return;
    }

    try {
      const user = await login({ email, password });
      const targetDashboard = ROLE_DEFAULT_DASHBOARD[user.role] || '/participant/dashboard';
      navigate(targetDashboard, { replace: true });
    } catch {
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#111111] text-[#F5F5F0] flex items-center justify-center p-4 selection:bg-[#FF6B35]/25 font-sans overflow-x-hidden">
      <StarfieldCanvas particleCount={40} />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
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
            Platform Authentication
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl shadow-xl p-6 sm:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#F5F5F0]">Sign In</h2>
            <p className="text-xs text-[#A1A1A1] mt-0.5">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Email Address / Handle"
              type="email"
              required
              placeholder="e.g. participant@consensus.dev"
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

            <div className="flex items-center justify-between text-xs text-[#A1A1A1] pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-[#141414] border-[#2A2A2A] text-[#FF6B35] focus:ring-0"
                />
                <span>Remember session</span>
              </label>
              <a href="#" className="hover:text-[#F5F5F0] transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Consensus
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#2A2A2A] text-center text-xs text-[#A1A1A1]">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-[#FF7F50] font-medium hover:underline">
              Create an account
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
