import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MockAuthProvider } from './auth/MockAuthProvider';
import {
  ParticipantRoute,
  OrganizerRoute,
  JudgeRoute,
  AdminRoute,
} from './auth/ProtectedRoute';

// Public Pages
import { Home } from './app/public/Home';
import { ExploreHackathons } from './app/public/ExploreHackathons';
import { HackathonDetails } from './app/public/HackathonDetails';
import { Gallery } from './app/public/Gallery';
import { LoginPage } from './app/public/LoginPage';
import { RegisterPage } from './app/public/RegisterPage';

// Participant App
import { ParticipantLayout } from './app/participant/ParticipantLayout';
import { ParticipantDashboard } from './app/participant/ParticipantDashboard';
import { ParticipantProfile } from './app/participant/ParticipantProfile';
import { ParticipantHackathons } from './app/participant/ParticipantHackathons';
import { ParticipantTeams } from './app/participant/ParticipantTeams';
import { ParticipantProjects } from './app/participant/ParticipantProjects';
import { ParticipantSubmissions } from './app/participant/ParticipantSubmissions';
import { ParticipantNotifications } from './app/participant/ParticipantNotifications';
import { ParticipantSettings } from './app/participant/ParticipantSettings';

// Organizer App
import { OrganizerLayout } from './app/organizer/OrganizerLayout';
import { OrganizerDashboard } from './app/organizer/OrganizerDashboard';
import { OrganizerHackathons } from './app/organizer/OrganizerHackathons';
import { CreateHackathon } from './app/organizer/CreateHackathon';
import { HackathonManagement } from './app/organizer/HackathonManagement';
import { Participants } from './app/organizer/Participants';
import { Teams } from './app/organizer/Teams';
import { Submissions } from './app/organizer/Submissions';
import { Judges } from './app/organizer/Judges';
import { Judging } from './app/organizer/Judging';
import { Results } from './app/organizer/Results';
import { Payouts } from './app/organizer/Payouts';
import { Certificates } from './app/organizer/Certificates';
import { OrganizerProfile } from './app/organizer/OrganizerProfile';
import { OrganizerSettings } from './app/organizer/OrganizerSettings';

// Judge App
import { JudgeLayout } from './app/judge/JudgeLayout';
import { JudgeDashboard } from './app/judge/JudgeDashboard';
import { Assignments } from './app/judge/Assignments';
import { Projects } from './app/judge/Projects';
import { ProjectEvaluation } from './app/judge/ProjectEvaluation';
import { LiveSessions } from './app/judge/LiveSessions';
import { Evaluations } from './app/judge/Evaluations';
import { JudgeNotifications } from './app/judge/JudgeNotifications';
import { JudgeProfile } from './app/judge/JudgeProfile';
import { JudgeSettings } from './app/judge/JudgeSettings';

// Admin App
import { AdminLayout } from './app/admin/AdminLayout';
import { AdminDashboard } from './app/admin/AdminDashboard';
import { UsersPage } from './app/admin/Users';
import { Organizers } from './app/admin/Organizers';
import { JudgesAdmin } from './app/admin/Judges';
import { ParticipantsAdmin } from './app/admin/Participants';
import { HackathonsAdmin } from './app/admin/Hackathons';
import { SubmissionsAdmin } from './app/admin/Submissions';
import { PaymentsAdmin } from './app/admin/Payments';
import { PayoutsAdmin } from './app/admin/Payouts';
import { Disputes } from './app/admin/Disputes';
import { AuditLogs } from './app/admin/AuditLogs';
import { AdminSettings } from './app/admin/AdminSettings';

export function App() {
  return (
    <MockAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ============================================================
              PUBLIC WEBSITE ROUTES (Preserved Landing & Exploration)
             ============================================================ */}
          <Route path="/" element={<Home />} />
          <Route path="/hackathons" element={<ExploreHackathons />} />
          <Route path="/hackathons/:id" element={<HackathonDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ============================================================
              PARTICIPANT APPLICATION (/participant/*)
             ============================================================ */}
          <Route
            path="/participant"
            element={
              <ParticipantRoute>
                <ParticipantLayout />
              </ParticipantRoute>
            }
          >
            <Route index element={<Navigate to="/participant/dashboard" replace />} />
            <Route path="dashboard" element={<ParticipantDashboard />} />
            <Route path="profile" element={<ParticipantProfile />} />
            <Route path="hackathons" element={<ParticipantHackathons />} />
            <Route path="teams" element={<ParticipantTeams />} />
            <Route path="projects" element={<ParticipantProjects />} />
            <Route path="submissions" element={<ParticipantSubmissions />} />
            <Route path="notifications" element={<ParticipantNotifications />} />
            <Route path="settings" element={<ParticipantSettings />} />
          </Route>

          {/* ============================================================
              ORGANIZER APPLICATION (/organizer/*)
             ============================================================ */}
          <Route
            path="/organizer"
            element={
              <OrganizerRoute>
                <OrganizerLayout />
              </OrganizerRoute>
            }
          >
            <Route index element={<Navigate to="/organizer/dashboard" replace />} />
            <Route path="dashboard" element={<OrganizerDashboard />} />
            <Route path="hackathons" element={<OrganizerHackathons />} />
            <Route path="hackathons/create" element={<CreateHackathon />} />
            <Route path="hackathons/:id" element={<HackathonManagement />} />
            <Route path="participants" element={<Participants />} />
            <Route path="teams" element={<Teams />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="judges" element={<Judges />} />
            <Route path="judging" element={<Judging />} />
            <Route path="results" element={<Results />} />
            <Route path="payouts" element={<Payouts />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="profile" element={<OrganizerProfile />} />
            <Route path="settings" element={<OrganizerSettings />} />
          </Route>

          {/* ============================================================
              JUDGE APPLICATION (/judge/*)
             ============================================================ */}
          <Route
            path="/judge"
            element={
              <JudgeRoute>
                <JudgeLayout />
              </JudgeRoute>
            }
          >
            <Route index element={<Navigate to="/judge/dashboard" replace />} />
            <Route path="dashboard" element={<JudgeDashboard />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectEvaluation />} />
            <Route path="sessions" element={<LiveSessions />} />
            <Route path="evaluations" element={<Evaluations />} />
            <Route path="notifications" element={<JudgeNotifications />} />
            <Route path="profile" element={<JudgeProfile />} />
            <Route path="settings" element={<JudgeSettings />} />
          </Route>

          {/* ============================================================
              ADMIN APPLICATION (/admin/*)
             ============================================================ */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="organizers" element={<Organizers />} />
            <Route path="judges" element={<JudgesAdmin />} />
            <Route path="participants" element={<ParticipantsAdmin />} />
            <Route path="hackathons" element={<HackathonsAdmin />} />
            <Route path="submissions" element={<SubmissionsAdmin />} />
            <Route path="payments" element={<PaymentsAdmin />} />
            <Route path="payouts" element={<PayoutsAdmin />} />
            <Route path="disputes" element={<Disputes />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MockAuthProvider>
  );
}

export default App;
