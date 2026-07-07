interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex w-64 flex-col bg-bg-deep p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-text-main"
        >
          X
        </button>
        <p className="text-text-main mb-4 font-bold">Menu</p>
        <a href="/" className="text-text-muted hover:text-primary-cyan mb-2" onClick={onClose}>Dashboard</a>
        <a href="/content" className="text-text-muted hover:text-primary-cyan mb-2" onClick={onClose}>Content</a>
        <a href="/analytics" className="text-text-muted hover:text-primary-cyan mb-2" onClick={onClose}>Analytics</a>
        <a href="/models" className="text-text-muted hover:text-primary-cyan mb-2" onClick={onClose}>Models</a>
        <a href="/settings" className="text-text-muted hover:text-primary-cyan" onClick={onClose}>Settings</a>
      </div>
    </div>
  );
}
