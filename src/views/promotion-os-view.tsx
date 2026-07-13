import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Dialog from "@radix-ui/react-dialog";
import { apiClient } from "../lib/api-client";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { Server, Activity, Image as ImageIcon, CheckCircle, Wand2, Plus, Play, X } from "lucide-react";
import { toast } from "sonner";

interface DashboardSummary { campaigns: number; media_jobs: number; pending_approvals: number; }
interface Campaign { id: string; name: string; status: string; objective: string; }
interface MediaJob { id: string; status: string; seed: number; }
interface ApprovalItem { id: string; title: string; status: string; }

export function PromotionOsView() {
  const queryClient = useQueryClient();
  const [isCampOpen, setIsCampOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);
  const [isOpOpen, setIsOpOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: dashboard, isLoading: isLoadingDash } = useQuery<DashboardSummary>({
    queryKey: ["ai-dashboard"],
    queryFn: async () => (await apiClient.api.get("/ai/platform/dashboard")).data,
    initialData: { campaigns: 0, media_jobs: 0, pending_approvals: 0 }
  });

  const { data: campaigns = [], isLoading: isLoadingCamp } = useQuery<Campaign[]>({
    queryKey: ["ai-campaigns"],
    queryFn: async () => (await apiClient.api.get("/ai/platform/campaigns")).data
  });

  const { data: mediaJobs = [], isLoading: isLoadingMedia } = useQuery<MediaJob[]>({
    queryKey: ["ai-media-jobs"],
    queryFn: async () => (await apiClient.api.get("/ai/platform/media/jobs")).data
  });

  const { data: approvals = [], isLoading: isLoadingApp } = useQuery<ApprovalItem[]>({
    queryKey: ["ai-approvals"],
    queryFn: async () => (await apiClient.api.get("/ai/platform/approvals")).data
  });

  const { data: webhooks = [], isLoading: isLoadingWebhooks } = useQuery<any[]>({
    queryKey: ["ai-webhooks"],
    queryFn: async () => (await apiClient.api.get("/ai/platform/webhooks")).data
  });

  const { data: autonomousOps = [], isLoading: isLoadingOps } = useQuery<any[]>({
    queryKey: ["ai-autonomous-ops"],
    queryFn: async () => (await apiClient.api.get("/ai/platform/autonomous_ops")).data
  });

  const createCampaign = useMutation({
    mutationFn: async (data: any) => (await apiClient.api.post("/ai/platform/campaigns", data)).data,
    onSuccess: () => {
      toast.success("Campaign created successfully!");
      setIsCampOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ai-campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["ai-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["ai-dashboard"] });
    },
    onError: () => toast.error("Failed to create campaign")
  });

  const createMediaJob = useMutation({
    mutationFn: async (data: any) => (await apiClient.api.post("/ai/platform/media/jobs", data)).data,
    onSuccess: () => {
      toast.success("Media Job queued successfully!");
      setIsMediaOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ai-media-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["ai-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["ai-dashboard"] });
    },
    onError: () => toast.error("Failed to queue media job")
  });

  const decideApproval = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => 
      (await apiClient.api.post(`/ai/platform/approvals/${id}`, { status, note: "" })).data,
    onSuccess: () => {
      toast.success("Approval decision submitted!");
      queryClient.invalidateQueries({ queryKey: ["ai-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["ai-media-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["ai-dashboard"] });
    },
    onError: () => toast.error("Failed to submit decision")
  });

  const createWebhook = useMutation({
    mutationFn: async (data: any) => (await apiClient.api.post("/ai/platform/webhooks", data)).data,
    onSuccess: () => {
      toast.success("Webhook created successfully!");
      setIsWebhookOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ai-webhooks"] });
    },
    onError: () => toast.error("Failed to create webhook")
  });

  const createOp = useMutation({
    mutationFn: async (data: any) => (await apiClient.api.post("/ai/platform/autonomous_ops", data)).data,
    onSuccess: () => {
      toast.success("Autonomous Op started successfully!");
      setIsOpOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ai-autonomous-ops"] });
    },
    onError: () => toast.error("Failed to start autonomous op")
  });

  const isLoading = isLoadingDash || isLoadingCamp || isLoadingMedia || isLoadingApp || isLoadingWebhooks || isLoadingOps;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-10">
      <PageHeader
        title="AI Operator Cockpit"
        description="Creator revenue operations powered by Fanvue Promotion OS."
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-cyan/10 text-primary-cyan rounded-full text-xs font-medium border border-primary-cyan/20">
            <Server className="w-3.5 h-3.5" />
            Connected to AI Engine
          </div>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard label="Active Campaigns" value={dashboard.campaigns} icon={<Activity className="w-5 h-5 text-status-success" />} />
            <MetricCard label="Queued Media Jobs" value={dashboard.media_jobs} icon={<ImageIcon className="w-5 h-5 text-status-warning" />} />
            <MetricCard label="Pending Approvals" value={dashboard.pending_approvals} icon={<CheckCircle className="w-5 h-5 text-primary-cyan" />} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel title="Campaign Builder" action="POST /platform/campaigns" icon={<Wand2 className="w-4 h-4" />}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-text-muted">Create conversion campaigns, channel mixes, offers, and fan segments.</p>
                
                <Dialog.Root open={isCampOpen} onOpenChange={setIsCampOpen}>
                  <Dialog.Trigger asChild>
                    <button className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3 whitespace-nowrap">
                      <Plus className="w-3.5 h-3.5" /> Create Campaign
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-glass-base border border-glass-border rounded-xl p-6 shadow-2xl z-50 animate-in zoom-in-95">
                      <div className="flex justify-between items-center mb-5">
                        <Dialog.Title className="text-lg font-semibold text-text-main">Create AI Campaign</Dialog.Title>
                        <Dialog.Close className="text-text-muted hover:text-text-main"><X className="w-5 h-5" /></Dialog.Close>
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        createCampaign.mutate({
                          name: fd.get("name"),
                          objective: fd.get("objective"),
                          audience: fd.get("audience"),
                          offer: fd.get("offer"),
                          channels: ["fanvue"]
                        });
                      }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">Campaign Name</label>
                          <input required name="name" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" placeholder="e.g. Summer VIP Push" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">Objective</label>
                          <select name="objective" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors">
                            <option value="conversion">Conversion</option>
                            <option value="retention">Retention</option>
                            <option value="reactivation">Reactivation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">Audience</label>
                          <input required name="audience" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" placeholder="e.g. Inactive subscribers > 30 days" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">Offer</label>
                          <input required name="offer" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" placeholder="e.g. $10 unlock with exclusive video" />
                        </div>
                        <button type="submit" disabled={createCampaign.isPending} className="btn-primary w-full py-2 mt-2">
                          {createCampaign.isPending ? "Submitting..." : "Launch Campaign"}
                        </button>
                      </form>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

              </div>
              <List items={campaigns.map((item) => ({ 
                id: item.id, 
                title: item.name, 
                status: item.status, 
                subtitle: `Objective: ${item.objective}`,
                onClick: () => { setSelectedItem({ type: 'campaign', data: item }); setIsDetailsOpen(true); }
              }))} empty="No campaigns yet." />
            </Panel>

            <Panel title="AI Media Pipeline" action="POST /platform/media/jobs" icon={<ImageIcon className="w-4 h-4" />}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-text-muted">Queue synchronized teaser/unlock variants with LoRA strength and PPV pricing.</p>
                
                <Dialog.Root open={isMediaOpen} onOpenChange={setIsMediaOpen}>
                  <Dialog.Trigger asChild>
                    <button className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3 whitespace-nowrap">
                      <Play className="w-3.5 h-3.5" /> Queue Job
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-glass-base border border-glass-border rounded-xl p-6 shadow-2xl z-50 animate-in zoom-in-95">
                      <div className="flex justify-between items-center mb-5">
                        <Dialog.Title className="text-lg font-semibold text-text-main">Queue Media Job</Dialog.Title>
                        <Dialog.Close className="text-text-muted hover:text-text-main"><X className="w-5 h-5" /></Dialog.Close>
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        createMediaJob.mutate({
                          prompt: fd.get("prompt"),
                          seed: Math.floor(Math.random() * 1000000),
                          lora_name: fd.get("lora_name"),
                          lora_strength: parseFloat(fd.get("lora_strength") as string),
                          ppv_price_usd: parseFloat(fd.get("ppv_price") as string)
                        });
                      }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">Image Prompt</label>
                          <textarea required name="prompt" rows={3} className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors custom-scrollbar" placeholder="e.g. stunning portrait, outdoor lighting, high quality" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-text-muted mb-1">LoRA Name</label>
                            <input required name="lora_name" defaultValue="creator_lora_v1" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-text-muted mb-1">LoRA Strength</label>
                            <input required type="number" step="0.1" name="lora_strength" defaultValue="0.8" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">PPV Price (USD)</label>
                          <input required type="number" name="ppv_price" defaultValue="15" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" />
                        </div>
                        <button type="submit" disabled={createMediaJob.isPending} className="btn-primary w-full py-2 mt-2">
                          {createMediaJob.isPending ? "Queueing..." : "Run AI Generation"}
                        </button>
                      </form>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>

              </div>
              <List items={mediaJobs.map((item) => ({ 
                id: item.id, 
                title: item.id, 
                status: item.status, 
                subtitle: `Seed: ${item.seed} | Price: $${item.ppv_price_usd}`,
                onClick: () => { setSelectedItem({ type: 'media', data: item }); setIsDetailsOpen(true); }
              }))} empty="No media jobs yet." />
            </Panel>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Panel title="CRM & Webhooks" action="POST /webhooks/fanvue" icon={<Activity className="w-4 h-4" />}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-text-muted">Listening for subscription activation, messages, payments, and PPV release gates.</p>
                <Dialog.Root open={isWebhookOpen} onOpenChange={setIsWebhookOpen}>
                  <Dialog.Trigger asChild>
                    <button className="p-1 hover:bg-glass-light rounded text-primary-cyan transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-glass-base border border-glass-border rounded-xl p-6 shadow-2xl z-50 animate-in zoom-in-95">
                      <div className="flex justify-between items-center mb-5">
                        <Dialog.Title className="text-lg font-semibold text-text-main">Create Webhook</Dialog.Title>
                        <Dialog.Close className="text-text-muted hover:text-text-main"><X className="w-5 h-5" /></Dialog.Close>
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        createWebhook.mutate({
                          name: fd.get("name"),
                          description: fd.get("description")
                        });
                      }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">Webhook Name</label>
                          <input required name="name" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" placeholder="e.g. Stripe Payment Sync" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
                          <input name="description" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" placeholder="e.g. Listens for new subscribers" />
                        </div>
                        <button type="submit" disabled={createWebhook.isPending} className="btn-primary w-full py-2 mt-2">
                          {createWebhook.isPending ? "Creating..." : "Create Webhook"}
                        </button>
                      </form>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
              <List items={webhooks.map((item) => ({ id: item.id, title: item.name, status: item.status, subtitle: item.description }))} empty="No active webhooks." />
            </Panel>
            
            <Panel title="Human Review Queue" action="GET /platform/approvals" icon={<CheckCircle className="w-4 h-4" />}>
              <List items={approvals.map((item) => ({ 
                id: item.id, 
                title: item.title, 
                status: item.status, 
                subtitle: `Type: ${item.kind}`,
                actions: item.status === "pending" ? (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => decideApproval.mutate({ id: item.id, status: "approved" })}
                      disabled={decideApproval.isPending}
                      className="px-2 py-1 text-[10px] rounded bg-status-success/10 text-status-success hover:bg-status-success/20 transition-colors"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => decideApproval.mutate({ id: item.id, status: "rejected" })}
                      disabled={decideApproval.isPending}
                      className="px-2 py-1 text-[10px] rounded bg-status-error/10 text-status-error hover:bg-status-error/20 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                ) : undefined
              }))} empty="No approval items." />
            </Panel>
            
            <Panel title="Autonomous Ops" action="@thermonuclear_review" icon={<Server className="w-4 h-4" />}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-text-muted">Agent loops, review council, learning journals, skill registry, scheduler, and health audits.</p>
                <Dialog.Root open={isOpOpen} onOpenChange={setIsOpOpen}>
                  <Dialog.Trigger asChild>
                    <button className="p-1 hover:bg-glass-light rounded text-primary-cyan transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-glass-base border border-glass-border rounded-xl p-6 shadow-2xl z-50 animate-in zoom-in-95">
                      <div className="flex justify-between items-center mb-5">
                        <Dialog.Title className="text-lg font-semibold text-text-main">Start Autonomous Op</Dialog.Title>
                        <Dialog.Close className="text-text-muted hover:text-text-main"><X className="w-5 h-5" /></Dialog.Close>
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        createOp.mutate({
                          name: fd.get("name"),
                          description: fd.get("description")
                        });
                      }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">Operation Name</label>
                          <input required name="name" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" placeholder="e.g. Auto-Reply Agent" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
                          <input name="description" className="w-full bg-glass-light border border-glass-border rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-primary-cyan transition-colors" placeholder="e.g. Replies to unread messages every hour" />
                        </div>
                        <button type="submit" disabled={createOp.isPending} className="btn-primary w-full py-2 mt-2">
                          {createOp.isPending ? "Starting..." : "Start Operation"}
                        </button>
                      </form>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
              <List items={autonomousOps.map((item) => ({ id: item.id, title: item.name, status: item.status, subtitle: item.description }))} empty="No autonomous ops running." />
            </Panel>
          </section>

          <Dialog.Root open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-glass-base border border-glass-border rounded-xl p-6 shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-5">
                  <Dialog.Title className="text-lg font-semibold text-text-main">
                    {selectedItem?.type === 'campaign' ? 'Campaign Details' : 'Media Job Details'}
                  </Dialog.Title>
                  <Dialog.Close className="text-text-muted hover:text-text-main"><X className="w-5 h-5" /></Dialog.Close>
                </div>
                
                {selectedItem?.type === 'campaign' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-glass-light p-4 rounded border border-glass-border">
                        <p className="text-xs text-text-muted mb-1">Name</p>
                        <p className="text-sm text-text-main font-medium">{selectedItem.data.name}</p>
                      </div>
                      <div className="bg-glass-light p-4 rounded border border-glass-border">
                        <p className="text-xs text-text-muted mb-1">Objective</p>
                        <p className="text-sm text-text-main font-medium capitalize">{selectedItem.data.objective}</p>
                      </div>
                    </div>
                    <div className="bg-glass-light p-4 rounded border border-glass-border">
                      <p className="text-xs text-text-muted mb-1">Audience</p>
                      <p className="text-sm text-text-main">{selectedItem.data.audience || 'N/A'}</p>
                    </div>
                    <div className="bg-glass-light p-4 rounded border border-glass-border">
                      <p className="text-xs text-text-muted mb-1">Offer</p>
                      <p className="text-sm text-text-main">{selectedItem.data.offer || 'N/A'}</p>
                    </div>
                    {selectedItem.data.channels_json && (
                      <div className="bg-glass-light p-4 rounded border border-glass-border">
                        <p className="text-xs text-text-muted mb-2">Generated Plan / Channels (JSON)</p>
                        <pre className="text-xs text-primary-cyan overflow-x-auto">
                          {JSON.stringify(JSON.parse(selectedItem.data.channels_json || '[]'), null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {selectedItem?.type === 'media' && (
                  <div className="space-y-4">
                    <div className="bg-glass-light p-4 rounded border border-glass-border">
                        <p className="text-xs text-text-muted mb-1">Prompt</p>
                        <p className="text-sm text-text-main">{selectedItem.data.prompt || 'N/A'}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-glass-light p-4 rounded border border-glass-border">
                          <p className="text-xs text-text-muted mb-1">Seed</p>
                          <p className="text-sm text-text-main font-medium">{selectedItem.data.seed}</p>
                        </div>
                        <div className="bg-glass-light p-4 rounded border border-glass-border">
                          <p className="text-xs text-text-muted mb-1">Status</p>
                          <p className="text-sm text-text-main font-medium uppercase tracking-wider">{selectedItem.data.status}</p>
                        </div>
                      </div>

                      {selectedItem.data.result_json && (
                        <div className="bg-glass-light p-4 rounded border border-glass-border">
                          <p className="text-xs text-text-muted mb-4">Generation Result (Output)</p>
                          {(() => {
                            try {
                              const parsed = JSON.parse(selectedItem.data.result_json || '{}');
                              if (parsed.error) {
                                return <p className="text-xs text-status-error">{parsed.error}</p>;
                              }
                              return (
                                <div className="space-y-4">
                                  {parsed.teaser?.url && (
                                    <div className="flex flex-col items-center">
                                      <img src={parsed.teaser.url} alt="Generated Teaser" className="w-full max-w-sm rounded-lg border border-glass-border shadow-md" />
                                      <p className="text-[10px] text-text-muted mt-2 uppercase tracking-wider text-center">{parsed.teaser.distribution} Variant</p>
                                    </div>
                                  )}
                                  <div className="bg-black/30 p-3 rounded text-xs text-primary-cyan overflow-x-auto font-mono">
                                    <pre>{JSON.stringify(parsed, null, 2)}</pre>
                                  </div>
                                </div>
                              );
                            } catch {
                              return <p className="text-xs text-status-error">Invalid JSON Result</p>;
                            }
                          })()}
                        </div>
                      )}
                  </div>
                )}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

        </>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="glass-card p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">{label}</p>
        <p className="text-2xl font-bold text-text-main">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-glass-light flex items-center justify-center">{icon}</div>
    </div>
  );
}

function Panel({ title, action, icon, children }: { title: string; action: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <div className="text-primary-cyan">{icon}</div>
          <h2 className="text-sm font-semibold text-text-main">{title}</h2>
        </div>
        <code className="text-[10px] font-mono px-2 py-1 bg-glass-light rounded text-text-muted">{action}</code>
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

interface ListItemProps {
  id: string;
  title: string;
  status?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
}

function List({ items, empty }: { items: ListItemProps[]; empty: string }) {
  if (!items.length) {
    return <p className="text-xs text-text-disabled py-3 text-center border border-dashed border-glass-border rounded-md flex-1">{empty}</p>;
  }

  const getBadgeColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "approved":
      case "passed":
        return "bg-status-success/10 text-status-success border-status-success/20";
      case "pending":
      case "awaiting_approval":
      case "queued":
        return "bg-status-warning/10 text-status-warning border-status-warning/20";
      case "draft":
      case "sleeping":
        return "bg-glass-border/30 text-text-muted border-glass-border";
      case "rejected":
      case "failed":
        return "bg-status-error/10 text-status-error border-status-error/20";
      default:
        return "bg-glass-border/30 text-text-muted border-glass-border";
    }
  };

  return (
    <ul className="space-y-2 flex-1 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
      {items.map((item) => (
        <li 
          key={item.id} 
          onClick={item.onClick}
          className={`text-xs py-2.5 px-3 bg-glass-light rounded-md flex items-center justify-between gap-3 border border-glass-border/50 transition-colors group ${item.onClick ? "cursor-pointer hover:bg-glass-light/80 hover:border-primary-cyan/30" : "hover:border-primary-cyan/30"}`}
        >
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-text-main truncate">{item.title}</span>
            {item.subtitle && <span className="text-text-muted text-[10px] truncate mt-0.5">{item.subtitle}</span>}
          </div>
          <div className="flex items-center gap-2">
            {item.actions}
            {item.status && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] border whitespace-nowrap uppercase tracking-wider font-medium ${getBadgeColor(item.status)}`}>
                {item.status.replace("_", " ")}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
