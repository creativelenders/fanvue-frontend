import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspace } from "../contexts/workspace-context";
import { useFlow, useUpdateFlow } from "../hooks/use-automation";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { StatusBadge } from "../components/shared/status-badge";
import { ArrowLeft, Save, Plus, MessageSquare, Clock, Zap } from "lucide-react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// --- Custom Nodes ---

const TriggerNode = ({ data }: { data: any }) => (
  <div className="bg-glass-base border-2 border-primary-cyan rounded-lg p-3 min-w-[200px] shadow-lg shadow-primary-cyan/20">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 bg-primary-cyan/10 rounded-md">
        <Zap className="w-4 h-4 text-primary-cyan" />
      </div>
      <span className="text-sm font-semibold text-text-main">Keyword Trigger</span>
    </div>
    <input 
      className="w-full bg-glass-light border border-glass-border rounded px-2 py-1 text-xs text-text-main focus:outline-none focus:border-primary-cyan mt-2" 
      placeholder="e.g. hello, VIP"
      defaultValue={data.keywords}
    />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary-cyan" />
  </div>
);

const MessageNode = ({ data }: { data: any }) => (
  <div className="bg-glass-base border border-glass-border rounded-lg p-3 min-w-[200px] shadow-lg">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-text-muted" />
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 bg-primary-blue/10 rounded-md">
        <MessageSquare className="w-4 h-4 text-primary-blue" />
      </div>
      <span className="text-sm font-semibold text-text-main">Send Message</span>
    </div>
    <textarea 
      className="w-full bg-glass-light border border-glass-border rounded px-2 py-1 text-xs text-text-main focus:outline-none focus:border-primary-blue mt-2 resize-none" 
      placeholder="Enter message text..."
      rows={3}
      defaultValue={data.message}
    />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-text-muted" />
  </div>
);

const DelayNode = ({ data }: { data: any }) => (
  <div className="bg-glass-base border border-glass-border rounded-lg p-3 min-w-[150px] shadow-lg">
    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-text-muted" />
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 bg-secondary-violet/10 rounded-md">
        <Clock className="w-4 h-4 text-secondary-violet" />
      </div>
      <span className="text-sm font-semibold text-text-main">Delay</span>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <input 
        type="number"
        className="w-16 bg-glass-light border border-glass-border rounded px-2 py-1 text-xs text-text-main focus:outline-none focus:border-secondary-violet" 
        defaultValue={data.minutes || 60}
      />
      <span className="text-xs text-text-muted">mins</span>
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-text-muted" />
  </div>
);

const nodeTypes = {
  triggerNode: TriggerNode,
  messageNode: MessageNode,
  delayNode: DelayNode,
};

// --- Main Builder ---

const initialNodes = [
  { id: '1', type: 'triggerNode', position: { x: 250, y: 50 }, data: { keywords: 'hello' } },
  { id: '2', type: 'messageNode', position: { x: 250, y: 200 }, data: { message: 'Hi there! ❤️' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export function FlowBuilderView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: flow, isLoading, error, refetch } = useFlow(workspaceId, id || "");
  const updateMutation = useUpdateFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (flow) {
      if (flow.graphData && flow.graphData.nodes) {
        setNodes(flow.graphData.nodes);
        setEdges(flow.graphData.edges);
      } else {
        setNodes(initialNodes);
        setEdges(initialEdges);
      }
    }
  }, [flow, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = (type: string) => {
    const newNode = {
      id: `${Date.now()}`,
      type,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: type === 'messageNode' ? { message: '' } : { minutes: 60 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleSave = () => {
    updateMutation.mutate({
      workspaceId,
      flowId: id || "",
      updates: {
        graphData: { nodes, edges }
      }
    });
  };

  if (isLoading) return <LoadingState />;
  if (error || !flow) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between border-b border-glass-border pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-glass-light rounded-full transition-colors text-text-muted hover:text-text-main"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-text-main">{flow.name}</h1>
              <StatusBadge status={flow.isActive ? "active" : "paused"} />
            </div>
            <p className="text-sm text-text-muted mt-1">{flow.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-glass-base border border-glass-border rounded-md p-1">
            <button onClick={() => addNode('messageNode')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-main hover:bg-glass-light rounded transition-colors">
              <Plus className="w-3 h-3" /> Message
            </button>
            <button onClick={() => addNode('delayNode')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-main hover:bg-glass-light rounded transition-colors">
              <Plus className="w-3 h-3" /> Delay
            </button>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="btn-primary flex items-center gap-1.5 px-6"
          >
            <Save className="w-4 h-4" />
            {updateMutation.isPending ? "Saving..." : "Save Flow"}
          </button>
        </div>
      </div>

      <div className="flex-1 glass-card overflow-hidden relative border-glass-border border min-h-[600px] h-full rounded-xl">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0b0c10]"
        >
          <Controls className="bg-glass-base border-glass-border fill-text-main text-text-main [&>button]:border-b-glass-border [&>button:hover]:bg-glass-light" />
          <MiniMap className="bg-glass-base" maskColor="rgba(0,0,0,0.5)" nodeColor="#38bdf8" />
          <Background gap={24} size={2} color="rgba(255,255,255,0.05)" />
        </ReactFlow>
      </div>
    </div>
  );
}
