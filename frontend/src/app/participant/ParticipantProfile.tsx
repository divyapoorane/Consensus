import React, { useState, useEffect } from 'react';
import { participantService } from '../../services/participant/participantService';
import { ParticipantProfile as IParticipantProfile } from '../../types/participant';
import { DashboardHeader } from '../../components/shared/DashboardHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  GraduationCap,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Save,
  CheckCircle,
  Briefcase,
  Code2,
} from 'lucide-react';

export const ParticipantProfile: React.FC = () => {
  const [profile, setProfile] = useState<IParticipantProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IParticipantProfile | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    participantService.getProfile().then((data) => {
      setProfile(data);
      setFormData(data);
    });
  }, []);

  if (!profile || !formData) {
    return <div className="p-8 text-center text-[#A1A1A1]">Loading profile...</div>;
  }

  const handleInputChange = (field: keyof IParticipantProfile, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    const updated = await participantService.updateProfile(formData);
    setProfile(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <DashboardHeader
        title="Builder Profile"
        subtitle="Manage your credentials, technical skill graph, and portfolio presence."
        action={
          !isEditing ? (
            <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )
        }
      />

      {savedSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      {/* Header Bio Card */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <Avatar
            name={`${profile.firstName} ${profile.lastName}`}
            src={profile.avatarUrl}
            size="xl"
            className="border-2 border-[#2A2A2A]"
          />
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-[#F5F5F0]">
                {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : profile.username}
              </h2>
              <Badge variant="slate" size="sm">
                @{profile.username}
              </Badge>
            </div>
            <p className="text-xs font-medium text-[#FF7F50] flex items-center justify-center sm:justify-start gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{profile.currentRole || 'Builder / Participant'}</span>
            </p>
            {profile.bio ? (
              <p className="text-xs text-[#A1A1A1] leading-relaxed max-w-2xl">{profile.bio}</p>
            ) : (
              <p className="text-xs text-[#666666] italic">No bio provided yet. Click &quot;Edit Profile&quot; to add your technical background.</p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-[#A1A1A1]">
              {profile.college ? (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#A1A1A1]" />
                  <span>{profile.college} {profile.graduationYear ? `(${profile.graduationYear})` : ''}</span>
                </span>
              ) : null}
              {(profile.city || profile.country) ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#A1A1A1]" />
                  <span>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Form (Edit Mode vs View Mode) */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Personal & Academic Details */}
        <Card>
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#FF6B35]" />
            <span>Personal & Academic Information</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <Input
              label="First Name"
              value={formData.firstName}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
            <Input
              label="Username / Handle"
              value={formData.username}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
            <Input
              label="Email Address"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <Input
              label="Current Title / Role"
              value={formData.currentRole}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('currentRole', e.target.value)}
            />
            <Input
              label="College / University"
              value={formData.college}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('college', e.target.value)}
            />
            <Input
              label="Course / Degree"
              value={formData.course}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('course', e.target.value)}
            />
            <Input
              label="Graduation Year"
              value={formData.graduationYear}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('graduationYear', e.target.value)}
            />
          </div>
        </Card>

        {/* Location & Geography */}
        <Card>
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF6B35]" />
            <span>Geographic Location</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="Country"
              value={formData.country}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />
            <Input
              label="State / Region"
              value={formData.state}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
            <Input
              label="City"
              value={formData.city}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>
        </Card>

        {/* Links & Socials */}
        <Card>
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#FF6B35]" />
            <span>Developer Links & Portfolio</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="GitHub Profile"
              value={formData.github}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('github', e.target.value)}
              icon={<Github className="w-4 h-4" />}
            />
            <Input
              label="LinkedIn URL"
              value={formData.linkedin}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              icon={<Linkedin className="w-4 h-4" />}
            />
            <Input
              label="Personal Website"
              value={formData.portfolio}
              disabled={!isEditing}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              icon={<Globe className="w-4 h-4" />}
            />
          </div>
        </Card>

        {/* Skills & Interests Tags */}
        <Card>
          <h3 className="text-xs font-semibold text-[#F5F5F0] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-[#FF6B35]" />
            <span>Technical Skills & Interests</span>
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">
                Active Skill Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="slate" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A1A1A1] mb-1.5">
                Research & Challenge Interests
              </label>
              <div className="flex flex-wrap gap-1.5">
                {formData.interests.map((interest) => (
                  <Badge key={interest} variant="orange" size="sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {isEditing && (
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Discard
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
            >
              Save Profile Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
