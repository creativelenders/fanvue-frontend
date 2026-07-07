import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useWorkspace } from "../contexts/workspace-context";
import { apiClient } from "../lib/api-client";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { ArrowLeft, User, DollarSign, MessageSquare, History, Tag, Activity } from "lucide-react";
import { StatusBadge } from "../components/shared/status-badge";

export function FanDetailsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: fan, isLoading, error, refetch } = useQuery({
    queryKey: ["fan", workspaceId, id],
    queryFn: async () => {
      const response = await apiClient.api.get(`/workspaces/${workspaceId}/fans/${id}`);
      return response.data.data;
    },
    enabled: !!workspaceId && !!id,
  });

  if (isLoading) return <LoadingState />;
  if (error || !fan) return <ErrorState onRetry={() => refetch()} />;

  const allMessages = fan.chatSessions?.flatMap((s: any) => s.messages) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-glass-border pb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-glass-light rounded-full transition-colors text-text-muted hover:text-text-main"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-cyan to-primary-blue flex items-center justify-center text-white text-xl font-bold">
          {fan.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-main">{fan.name}</h1>
            <StatusBadge status={fan.status} />
          </div>
          <p className="text-text-muted">{fan.handle}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted">Total Spend</p>
          <p className="text-2xl font-bold text-status-success">${parseFloat(fan.totalSpend).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Purchases */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-text-main flex items-center gap-2">
              <User className="w-5 h-5 text-primary-cyan" />
              Fan Profile
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-glass-light rounded-lg border border-glass-border/50">
                <p className="text-xs text-text-muted mb-1">Engagement Score</p>
                <p className="text-lg font-semibold text-text-main">{fan.score}</p>
              </div>
              <div className="p-3 bg-glass-light rounded-lg border border-glass-border/50">
                <p className="text-xs text-text-muted mb-1">Platform</p>
                <p className="text-lg font-semibold text-text-main capitalize">{fan.platform}</p>
              </div>
            </div>

            {fan.tags && fan.tags.length > 0 && (
              <div className="pt-2">
                <p className="text-sm text-text-muted mb-2 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" /> Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {fan.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-glass-light border border-glass-border text-xs text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-glass-border bg-glass-base/50">
              <h2 className="text-sm font-semibold text-text-main flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-status-success" />
                Purchase History
              </h2>
            </div>
            {fan.purchases?.length ? (
              <div className="divide-y divide-glass-border">
                {fan.purchases.map((p: any) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-glass-light transition-colors">
                    <div>
                      <p className="text-sm font-medium text-text-main">{p.campaign?.title || "Unknown Campaign"}</p>
                      <p className="text-xs text-text-muted">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm font-bold text-status-success">${parseFloat(p.amountPaid).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted">
                <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No purchases yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat History */}
        <div className="lg:col-span-2 glass-card flex flex-col h-[600px]">
          <div className="p-4 border-b border-glass-border bg-glass-base/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-main flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-blue" />
              Chat History
            </h2>
            <span className="text-xs text-text-muted">{allMessages.length} messages</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {allMessages.length > 0 ? (
              allMessages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                    msg.direction === 'outbound' 
                      ? 'bg-gradient-to-br from-primary-cyan to-primary-blue text-white rounded-br-none' 
                      : 'bg-glass-light border border-glass-border text-text-main rounded-bl-none'
                  }`}>
                    {msg.content}
                    <p className={`text-[10px] mt-1 ${msg.direction === 'outbound' ? 'text-white/70' : 'text-text-muted'}`}>
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-muted">
                <Activity className="w-12 h-12 mb-3 opacity-20" />
                <p>No chat history available.</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-glass-border bg-glass-base/50">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Reply to fan... (Under construction)" 
                className="flex-1 px-4 py-2 bg-glass-light border border-glass-border rounded-full text-sm text-text-main focus:outline-none focus:border-primary-cyan"
                disabled
              />
              <button disabled className="btn-primary rounded-full px-6">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
