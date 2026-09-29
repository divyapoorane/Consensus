import React from 'react';

export type BeaconVariant = 'active' | 'live' | 'connected' | 'mission' | 'winner' | 'system' | 'warning' | 'idle';

interface StatusBeaconProps {
  status?: BeaconVariant;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const StatusBeacon: React.FC<StatusBeaconProps> = ({
  status = 'active',
  label,
  pulse = true,
  className = '',
}) => {
  const config = {
    active: {
      dot: 'bg-[#FF5500]',
      ping: 'bg-[#FF5500]/60',
      border: 'border-[#FF5500]/30',
      text: 'text-[#FF7722]',
      bg: 'bg-[#FF5500]/10',
    },
    live: {
      dot: 'bg-[#00F0FF]',
      ping: 'bg-[#00F0FF]/60',
      border: 'border-[#00F0FF]/30',
      text: 'text-[#00F0FF]',
      bg: 'bg-[#00F0FF]/10',
    },
    connected: {
      dot: 'bg-[#00E575]',
      ping: 'bg-[#00E575]/60',
      border: 'border-[#00E575]/30',
      text: 'text-[#00E575]',
      bg: 'bg-[#00E575]/10',
    },
    mission: {
      dot: 'bg-[#FF5500]',
      ping: 'bg-[#FF5500]/60',
      border: 'border-[#FF5500]/30',
      text: 'text-[#FF5500]',
      bg: 'bg-[#FF5500]/10',
    },
    winner: {
      dot: 'bg-[#F59E0B]',
      ping: 'bg-[#F59E0B]/60',
      border: 'border-[#F59E0B]/30',
      text: 'text-[#F59E0B]',
      bg: 'bg-[#F59E0B]/10',
    },
    system: {
      dot: 'bg-[#00F0FF]',
      ping: 'bg-[#00F0FF]/50',
      border: 'border-[#00F0FF]/25',
      text: 'text-[#8E9BB5]',
      bg: 'bg-[#0D1220]',
    },
    warning: {
      dot: 'bg-[#F59E0B]',
      ping: 'bg-[#F59E0B]/60',
      border: 'border-[#F59E0B]/30',
      text: 'text-[#F59E0B]',
      bg: 'bg-[#F59E0B]/10',
    },
    idle: {
      dot: 'bg-[#64748B]',
      ping: 'bg-transparent',
      border: 'border-[#1C2744]',
      text: 'text-[#64748B]',
      bg: 'bg-[#0D1220]',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider font-semibold border ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5 items-center justify-center flex-shrink-0">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full animate-ping opacity-75 ${config.ping}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`} />
      </span>
      {label && <span>{label}</span>}
    </span>
  );
};
