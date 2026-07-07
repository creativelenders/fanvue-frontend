export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role?: WorkspaceRole;
  isTrialing: boolean;
  aiGenerationsUsed: number;
  aiGenerationsLimit: number;
  totalFans: number;
  totalRevenue: string;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: WorkspaceRole;
  joinedAt: string;
}

export type WorkspaceRole = "owner" | "admin" | "editor" | "chatter";

export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
}

export interface InviteMemberRequest {
  email: string;
  role: WorkspaceRole;
}
