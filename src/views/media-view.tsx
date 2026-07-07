import { useMedia, useUploadMedia } from "../hooks/use-media";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { ErrorState } from "../components/shared/error-state";
import { EmptyState } from "../components/shared/empty-state";
import { Image as ImageIcon, UploadCloud, Folder } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export function MediaView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: media = [], isLoading, error, refetch } = useMedia();
  const uploadMedia = useUploadMedia();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      for (const file of files) {
        uploadMedia.mutate(file, {
          onSuccess: () => {
            toast.success(`Uploaded ${file.name} successfully!`);
          },
          onError: () => {
            toast.error(`Failed to upload ${file.name}`);
          }
        });
      }
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Media Library"
        description="Centralized storage for images and videos used in auto-messages and PPV."
        actions={
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={handleFileChange} 
            />
            <button onClick={handleUploadClick} disabled={uploadMedia.isPending} className="btn-primary flex items-center gap-1.5 disabled:opacity-50">
              <UploadCloud className="w-4 h-4" />
              {uploadMedia.isPending ? "Uploading..." : "Upload Asset"}
            </button>
          </>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !media?.length ? (
        <EmptyState
          icon={<Folder className="w-12 h-12" />}
          title="Library is empty"
          description="Upload media to attach to your PPV blasts and automated messages."
          action={{ label: "Upload File", onClick: handleUploadClick }}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="glass-card overflow-hidden group">
              <div className="aspect-square bg-glass-light flex items-center justify-center relative overflow-hidden">
                {item.type === "image" && item.url ? (
                  <img src={`http://localhost:3000${item.url}`} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-text-muted opacity-50" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="btn-primary text-xs py-1 px-2" onClick={() => toast.success("Asset copied to clipboard!")}>Use</button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-text-main truncate" title={item.title}>{item.title}</p>
                <p className="text-[10px] text-text-muted mt-0.5 uppercase">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
