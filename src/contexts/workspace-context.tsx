import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useWorkspaceStore } from "../lib/workspace-store";
import { useAuthStore } from "../lib/auth-store";
import { useListWorkspaces } from "../hooks/use-workspace";
import { useNavigate } from "react-router-dom";

import type { Workspace } from "../types/workspace";

interface WorkspaceContextValue {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  switchWorkspace: (workspace: Workspace) => void;
  getApiPath: (path: string) => string;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { currentWorkspace, workspaces, setCurrentWorkspace, setWorkspaces } = useWorkspaceStore();

  const { data: fetchedWorkspaces, isLoading } = useListWorkspaces();

  useEffect(() => {
    if (fetchedWorkspaces && fetchedWorkspaces.length > 0) {
      setWorkspaces(fetchedWorkspaces);
      if (currentWorkspace) {
        // If we already have a current workspace, sync its latest DB data
        const updatedCurrent = fetchedWorkspaces.find((w) => w.id === currentWorkspace.id);
        if (updatedCurrent) {
          setCurrentWorkspace(updatedCurrent);
        }
      } else {
        // Otherwise pick the first workspace
        setCurrentWorkspace(fetchedWorkspaces[0]!);
      }
    }
  }, [fetchedWorkspaces, currentWorkspace?.id, setCurrentWorkspace, setWorkspaces]);

  // If authenticated and no workspaces, redirect to workspace creation
  useEffect(() => {
    if (isAuthenticated && !isLoading && fetchedWorkspaces?.length === 0) {
      navigate("/create-workspace");
    }
  }, [isAuthenticated, isLoading, fetchedWorkspaces, navigate]);

  const switchWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    navigate("/");
  };

  const getApiPath = (path: string) => {
    if (!currentWorkspace) return path;
    return `/workspaces/${currentWorkspace.id}${path}`;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        isLoading,
        switchWorkspace,
        getApiPath,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return context;
}
