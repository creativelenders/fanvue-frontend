import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth-context";
import { WorkspaceProvider } from "./contexts/workspace-context";
import { ProtectedRoute } from "./components/auth/protected-route";
import { AppShell } from "./components/layout/app-shell";

// ── Views ──
import { LoginView } from "./views/login-view";
import { OnboardingView } from "./views/onboarding-view";
import { DashboardView } from "./views/dashboard-view";
import { ContentBrainView } from "./views/content-brain-view";
import { ChatView } from "./views/chat-view";
import { PromptLibraryView } from "./views/prompt-library-view";
import { MediaView } from "./views/media-view";
import { FansView } from "./views/fans-view";
import { FanDetailsView } from "./views/fan-details-view";
import { FanListsView } from "./views/fan-lists-view";
import { PpvView } from "./views/ppv-view";
import { AutopilotView } from "./views/autopilot-view";
import { AutoMessagesView } from "./views/auto-messages-view";
import { FlowsView } from "./views/flows-view";
import { FlowBuilderView } from "./views/flow-builder-view";
import { TriggersView } from "./views/triggers-view";
import { MessageGuardView } from "./views/message-guard-view";
import { BumpsView } from "./views/bumps-view";
import { BroadcastsView } from "./views/broadcasts-view";
import { SocialFunnelsView } from "./views/social-funnels-view";
import { OnboardingFunnelsView } from "./views/onboarding-funnels-view";
import { OnboardingFlowBuilderView } from "./views/onboarding-flow-builder-view";
import { TeamView } from "./views/team-view";
import { ScheduleView } from "./views/schedule-view";
import { TrafficView } from "./views/traffic-view";
import { TrackingRedirectView } from "./views/tracking-redirect-view";
import { BillingView } from "./views/billing-view";
import { SettingsView } from "./views/settings-view";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginView />} />
              <Route path="/register" element={<LoginView />} />
              <Route path="/forgot-password" element={<LoginView />} />
              <Route path="/t/:code" element={<TrackingRedirectView />} />

              {/* Protected — workspace creation */}
              {/* Protected — app shell with sidebar */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                {/* Overview */}
                <Route path="/" element={<DashboardView />} />

                {/* Create */}
                <Route path="/content" element={<ContentBrainView />} />
                <Route path="/chat" element={<ChatView />} />
                <Route path="/prompts" element={<PromptLibraryView />} />
                <Route path="/media" element={<MediaView />} />

                {/* Fans */}
                <Route path="/fans" element={<FansView />} />
                <Route path="/fans/:id" element={<FanDetailsView />} />
                <Route path="/fan-lists" element={<FanListsView />} />
                <Route path="/ppv" element={<PpvView />} />

                {/* Automation */}
                <Route path="/autopilot" element={<AutopilotView />} />
                <Route path="/auto-messages" element={<AutoMessagesView />} />
                <Route path="/flows" element={<FlowsView />} />
                <Route path="/flows/:id" element={<FlowBuilderView />} />
                <Route path="/triggers" element={<TriggersView />} />
                <Route path="/message-guard" element={<MessageGuardView />} />
                <Route path="/bumps" element={<BumpsView />} />
                <Route path="/broadcasts" element={<BroadcastsView />} />

                {/* Growth */}
                <Route path="/social-funnels" element={<SocialFunnelsView />} />
                <Route path="/create-workspace" element={<OnboardingView />} />
                <Route path="/growth/onboarding" element={<OnboardingFunnelsView />} />
                <Route path="/growth/onboarding/:id" element={<OnboardingFlowBuilderView />} />
                <Route path="/traffic" element={<TrafficView />} />

                {/* Team */}
                <Route path="/shifts" element={<TeamView />} />
                <Route path="/schedules" element={<ScheduleView />} />

                {/* Billing & Settings */}
                <Route path="/billing" element={<BillingView />} />
                <Route path="/settings" element={<SettingsView />} />
              </Route>
            </Routes>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#1E293B",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#F8FAFC",
                },
              }}
            />
          </WorkspaceProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
