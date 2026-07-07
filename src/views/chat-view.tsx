import { useWorkspace } from "../contexts/workspace-context";
import { useChatThreads, useChatMessages, useSendMessage, useDraftReply } from "../hooks/use-chat";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { MessageSquare, Search, Send, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ChatView() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "";

  const { data: threads, isLoading } = useChatThreads(workspaceId);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");

  const filteredThreads = threads?.filter(t => t.fanName.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  const selectedThread = threads?.find(t => t.id === selectedThreadId);

  const { data: messages = [], isLoading: isLoadingMessages } = useChatMessages(selectedThreadId || "");
  const sendMessageMutation = useSendMessage(selectedThreadId || "");
  const draftReplyMutation = useDraftReply(selectedThreadId || "");

  const handleSend = () => {
    if (!message.trim() || !selectedThreadId) return;
    sendMessageMutation.mutate(
      { content: message },
      {
        onSuccess: () => {
          setMessage("");
        }
      }
    );
  };

  const handleDraftReply = () => {
    if (!selectedThreadId) return;
    draftReplyMutation.mutate(undefined, {
      onSuccess: (data) => {
        setMessage(data.draft);
        toast.success("AI drafted a reply!");
      },
      onError: () => {
        toast.error("Failed to draft reply");
      }
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="AI Inbox"
        description="Manage fan conversations with AI-assisted replies and dynamic PPV insertions."
      />

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Thread List */}
        <div className="w-80 flex flex-col glass-card overflow-hidden shrink-0">
          <div className="p-3 border-b border-glass-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-glass-light border border-glass-border rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-cyan text-text-main"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <LoadingState />
            ) : !filteredThreads.length ? (
              <div className="p-6 text-center text-text-muted text-sm">No conversations found.</div>
            ) : (
              filteredThreads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full text-left p-4 border-b border-glass-border hover:bg-glass-light transition-colors ${selectedThreadId === thread.id ? 'bg-glass-light border-l-2 border-l-primary-cyan' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-text-main text-sm">{thread.fanName}</span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(thread.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted truncate">{thread.lastMessage || "No messages yet"}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass-card flex flex-col overflow-hidden relative">
          {selectedThread ? (
            <>
              <div className="p-4 border-b border-glass-border flex justify-between items-center bg-glass-base z-10">
                <div>
                  <h3 className="text-sm font-bold text-text-main">{selectedThread.fanName}</h3>
                  <p className="text-xs text-text-muted">Online</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                {isLoadingMessages ? (
                  <LoadingState />
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'assistant' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-2xl px-4 py-2 max-w-[70%] ${msg.role === 'assistant' ? 'bg-primary-cyan text-white rounded-tr-sm' : 'bg-glass-light text-text-main rounded-tl-sm'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-[10px] mt-1 block ${msg.role === 'assistant' ? 'text-white/70' : 'text-text-muted'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-text-muted bg-glass-light/30">
              <div>
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-4 border-t border-glass-border bg-glass-base">
            <div className="flex gap-2">
              <button 
                disabled={!selectedThread || draftReplyMutation.isPending}
                onClick={handleDraftReply}
                className="p-2 rounded-md bg-glass-light text-primary-cyan hover:bg-primary-cyan/10 transition-colors disabled:opacity-50" 
                title="AI Suggestion"
              >
                {draftReplyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              </button>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Type a message..." 
                disabled={!selectedThread || sendMessageMutation.isPending}
                className="flex-1 px-4 py-2 bg-glass-light border border-glass-border rounded-md text-sm text-text-main focus:outline-none disabled:opacity-50"
              />
              <button 
                disabled={!selectedThread || !message.trim() || sendMessageMutation.isPending} 
                onClick={handleSend}
                className="p-2 rounded-md bg-primary-cyan text-white hover:bg-primary-cyan/90 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
