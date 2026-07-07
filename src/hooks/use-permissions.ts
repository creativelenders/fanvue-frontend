import { useWorkspace } from "../contexts/workspace-context";
import { useAuth } from "../contexts/auth-context";
import { getPlanLimits } from "../lib/permissions";

export function usePermissions() {
  const { currentWorkspace } = useWorkspace();
  const { user } = useAuth();
  
  const workspaceRole = currentWorkspace?.role || "chatter";
  const userEmail = user?.email?.toLowerCase() || "";
  
  // Hardcoded security checks based on email
  const isGlobalAdmin = user?.role === "admin" || userEmail.includes("admin");
  const isGlobalEditor = userEmail.includes("manager") || userEmail.includes("teamlead");
  
  // Calculate effective plan based on user role overrides
  let effectivePlan = currentWorkspace?.plan || "free";
  
  if (isGlobalAdmin || workspaceRole === "admin") {
    effectivePlan = "agency"; // Admins get everything
  } else if (isGlobalEditor || workspaceRole === "editor") {
    effectivePlan = "elite"; // Managers get elite advantages
  }
  // "owner" uses the actual workspace plan and must upgrade.

  const planLimits = getPlanLimits(effectivePlan);

  return {
    role: workspaceRole,
    planLimits,
    effectivePlan,
    isOwner: workspaceRole === "owner",
    isAdmin: isGlobalAdmin || workspaceRole === "owner" || workspaceRole === "admin",
    isEditor: isGlobalAdmin || isGlobalEditor || workspaceRole === "owner" || workspaceRole === "admin" || workspaceRole === "editor",
    isChatter: !isGlobalAdmin && !isGlobalEditor && workspaceRole === "chatter",
  };
}
