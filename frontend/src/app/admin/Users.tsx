import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin/adminService';
import { AdminUserRecord } from '../../types/admin';
import { UserRole } from '../../types/auth';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Table, Column } from '../../components/ui/Table';
import { Search } from '../../components/ui/Search';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { UserCheck, UserX, UserPlus, Shield, AlertCircle, CheckCircle } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  // Provisioning Modal State
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provPassword, setProvPassword] = useState('');
  const [provRole, setProvRole] = useState<UserRole>('participant');
  const [provLoading, setProvLoading] = useState(false);
  const [provError, setProvError] = useState<string | null>(null);
  const [provSuccess, setProvSuccess] = useState<string | null>(null);

  useEffect(() => {
    adminService.getUsers().then(setUsers);
  }, []);

  const handleToggleStatus = async (id: string) => {
    const updated = await adminService.toggleUserStatus(id);
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingRoleId(userId);
    try {
      const updated = await adminService.updateUserRole(userId, newRole);
      if (updated) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      }
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvError(null);
    setProvSuccess(null);

    if (!provName.trim() || !provEmail.trim() || !provPassword.trim()) {
      setProvError('Name, email, and initial password are required.');
      return;
    }

    setProvLoading(true);
    try {
      const created = await adminService.provisionUser({
        name: provName.trim(),
        email: provEmail.trim(),
        password: provPassword.trim(),
        role: provRole,
      });

      if (created) {
        setUsers((prev) => [created, ...prev.filter((u) => u.id !== created.id)]);
        setProvSuccess(`Account for ${created.name} provisioned as ${created.role.toUpperCase()}.`);
        setTimeout(() => {
          setIsProvisionOpen(false);
          setProvName('');
          setProvEmail('');
          setProvPassword('');
          setProvRole('participant');
          setProvSuccess(null);
        }, 1200);
      }
    } catch (err: any) {
      setProvError(err?.message || 'Failed to provision user.');
    } finally {
      setProvLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'participant':
        return <Badge variant="emerald" size="sm">Participant</Badge>;
      case 'organizer':
        return <Badge variant="neutral" size="sm">Organizer</Badge>;
      case 'judge':
        return <Badge variant="orange" size="sm">Judge</Badge>;
      case 'admin':
        return <Badge variant="rose" size="sm">Admin</Badge>;
    }
  };

  const columns: Column<AdminUserRecord>[] = [
    {
      header: 'User Identity',
      cell: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={u.name} src={u.avatarUrl} size="sm" />
          <div>
            <span className="font-semibold text-zinc-100 block">{u.name}</span>
            <span className="text-[10px] text-zinc-400 font-mono">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      cell: (u) => (
        <div className="flex items-center gap-2">
          {getRoleBadge(u.role)}
          <select
            value={u.role}
            disabled={updatingRoleId === u.id}
            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
            aria-label={`Change role for ${u.name}`}
            className="bg-[#202020] border border-[#333333] text-zinc-300 text-[11px] rounded px-2 py-0.5 focus:outline-none focus:border-[#FF6B35] cursor-pointer"
          >
            <option value="participant">Participant</option>
            <option value="organizer">Organizer</option>
            <option value="judge">Judge</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      ),
    },
    {
      header: 'Account Status',
      cell: (u) => (
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
            u.status === 'active'
              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
              : u.status === 'suspended'
              ? 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
              : 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
          }`}
        >
          {u.status}
        </span>
      ),
    },
    {
      header: 'Created On',
      cell: (u) => (
        <span className="font-mono text-[11px] text-zinc-400">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Last Session',
      cell: (u) => <span className="text-zinc-400 text-xs">{u.lastLogin}</span>,
    },
    {
      header: 'Access Moderation',
      cell: (u) => (
        <Button
          variant={u.status === 'active' ? 'danger' : 'outline'}
          size="sm"
          onClick={() => handleToggleStatus(u.id)}
          icon={u.status === 'active' ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
        >
          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <DashboardHeader
          title="Global User Management Directory"
          subtitle="Manage accounts, review role allocations, promote administrators, and moderate platform access."
        />
        <Button
          variant="primary"
          size="md"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsProvisionOpen(true)}
        >
          Provision Account
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#181818] border border-[#2A2A2A] p-3 rounded-xl">
        <div className="w-full sm:w-80">
          <Search
            value={query}
            onChange={setQuery}
            placeholder="Search users by name or email..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-zinc-400 font-mono uppercase">Role:</span>
          {['all', 'participant', 'organizer', 'judge', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`text-xs px-3 py-1 rounded-lg uppercase font-medium transition-colors cursor-pointer whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-[#FF6B35] text-white font-semibold'
                  : 'text-zinc-400 hover:text-white bg-[#202020]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <Table columns={columns} data={filtered} keyExtractor={(u) => u.id} />

      {/* Provision User Modal */}
      <Modal
        isOpen={isProvisionOpen}
        onClose={() => setIsProvisionOpen(false)}
        title="Provision Platform Account"
        subtitle="Provision an authorized user account with explicit role assignment."
      >
        <form onSubmit={handleProvisionSubmit} className="space-y-4 pt-2">
          {provError && (
            <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{provError}</span>
            </div>
          )}
          {provSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{provSuccess}</span>
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="e.g. Eleanor Vance"
            value={provName}
            onChange={(e) => setProvName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="eleanor@consensus.dev"
            value={provEmail}
            onChange={(e) => setProvEmail(e.target.value)}
            required
          />

          <Input
            label="Initial Password"
            type="password"
            placeholder="••••••••••••"
            value={provPassword}
            onChange={(e) => setProvPassword(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5 text-xs">
            <label className="font-medium text-[#A1A1A1]">Authorized Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(['participant', 'organizer', 'judge', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setProvRole(r)}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                    provRole === r
                      ? 'border-[#FF6B35] bg-[#222222] text-white'
                      : 'border-[#2A2A2A] bg-[#141414] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="capitalize font-medium text-xs">{r}</span>
                  {r === 'admin' && <Shield className="w-3.5 h-3.5 text-rose-400" />}
                </button>
              ))}
            </div>
            {provRole === 'admin' && (
              <p className="text-[11px] text-rose-400/90 font-mono mt-1">
                Notice: Granting Admin role enables full platform management access.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#2A2A2A]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsProvisionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={provLoading}
            >
              Confirm & Provision
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

