import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Workspace } from "../types/workspace";

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  clear: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      currentWorkspace: null,
      workspaces: [],
      setCurrentWorkspace: (workspace: Workspace) => set({ currentWorkspace: workspace }),
      setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
      clear: () => set({ currentWorkspace: null, workspaces: [] }),
    }),
    {
      name: "fanvue-workspace",
      partialize: (state) => ({
        currentWorkspace: state.currentWorkspace,
        workspaces: state.workspaces,
      }),
    }
  )
);
