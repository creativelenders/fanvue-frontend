import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PenSquare,
  MessageSquare,
  Users,
  List,
  DollarSign,
  Bot,
  GitBranch,
  Key,
  Shield,
  Bell,
  Megaphone,
  Share2,
  UserPlus,
  Clock,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Image,
} from "lucide-react";
import { useLogout } from "../../hooks/use-auth";
import { useAuth } from "../../contexts/auth-context";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { usePermissions } from "../../hooks/use-permissions";

interface NavSection {
  label: string;
  items: Array<{
    to: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }>;
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Create",
    items: [
      { to: "/content", label: "Content Brain", icon: PenSquare },
      { to: "/chat", label: "AI Chat", icon: MessageSquare },
      { to: "/prompts", label: "Prompt Library", icon: Bot },
      { to: "/media", label: "Media Library", icon: Image },
    ],
  },
  {
    label: "Fans",
    items: [
      { to: "/fans", label: "Fans CRM", icon: Users },
      { to: "/fan-lists", label: "Fan Lists", icon: List },
      { to: "/ppv", label: "PPV Manager", icon: DollarSign },
    ],
  },
  {
    label: "Automation",
    items: [
      { to: "/autopilot", label: "Autopilot", icon: Bot, badge: "AI" },
      { to: "/auto-messages", label: "Auto Messages", icon: Bell },
      { to: "/flows", label: "Conversation Flows", icon: GitBranch },
      { to: "/triggers", label: "Keyword Triggers", icon: Key },
      { to: "/message-guard", label: "Message Guard", icon: Shield },
      { to: "/bumps", label: "Bumps", icon: Bell },
      { to: "/broadcasts", label: "Broadcasts", icon: Megaphone },
    ],
  },
  {
    label: "Growth",
    items: [
      { to: "/social-funnels", label: "Social Funnels", icon: Share2 },
      { to: "/growth/onboarding", label: "Onboarding Funnels", icon: UserPlus },
      { to: "/traffic", label: "Traffic", icon: BarChart3 },
    ],
  },
  {
    label: "Team",
    items: [
      { to: "/shifts", label: "Chatter Shifts", icon: Clock },
      { to: "/schedules", label: "Shift Schedules", icon: Calendar },
    ],
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const logout = useLogout();
  const location = useLocation();
  const { isEditor, isChatter, isAdmin } = usePermissions();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Filter sections based on roles
  const filteredSections = NAV_SECTIONS.filter(section => {
    if (isChatter) {
      return ["Fans", "Team"].includes(section.label);
    }
    return true;
  }).map(section => {
    if (isChatter) {
      return {
        ...section,
        items: section.items.filter(i => ["/fans", "/fan-lists", "/ppv", "/shifts", "/chat"].includes(i.to))
      };
    }
    return section;
  });

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const toggleSection = (label: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  // Auto-expand section containing current route
  const activeSection = filteredSections.find((section) =>
    section.items.some((item) => isActive(item.to))
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-glass-base border-r border-glass-border">
      {/* Workspace Switcher */}
      <WorkspaceSwitcher />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredSections.map((section) => {
          if (section.items.length === 0) return null;
          
          const sectionActive = activeSection?.label === section.label;
          const isCollapsed = collapsedSections.has(section.label);

          return (
            <div key={section.label} className="mb-1">
              <button
                onClick={() => toggleSection(section.label)}
                className={`flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold uppercase tracking-wider
                  ${sectionActive || !isCollapsed ? "text-text-muted" : "text-text-disabled"}`}
              >
                {section.label}
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        isActive(item.to)
                          ? "bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20"
                          : "text-text-muted hover:text-text-main hover:bg-glass-light"
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary-cyan/20 text-primary-cyan">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="p-3 border-t border-glass-border space-y-0.5">
        {isAdmin && (
          <>
            <NavLink
              to="/billing"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive("/billing")
                  ? "bg-primary-cyan/10 text-primary-cyan"
                  : "text-text-muted hover:text-text-main hover:bg-glass-light"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Billing & Plans
            </NavLink>
            <NavLink
              to="/settings"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                isActive("/settings")
                  ? "bg-primary-cyan/10 text-primary-cyan"
                  : "text-text-muted hover:text-text-main hover:bg-glass-light"
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </NavLink>
          </>
        )}

        {/* User & Logout */}
        <div className="pt-2 mt-2 border-t border-glass-border">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-primary-cyan/20 flex items-center justify-center text-xs text-primary-cyan font-medium">
              {user?.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-main truncate">{user?.displayName}</p>
              <p className="text-[11px] text-text-muted capitalize">{(user as any)?.role}</p>
            </div>
          </div>
          <button
            onClick={() => logout.mutate()}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm text-text-muted 
                       hover:text-status-danger hover:bg-status-danger/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
