import { Menu } from "lucide-react";
import { useAuth } from "../../contexts/auth-context";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 lg:hidden bg-bg-deep/80 backdrop-blur-md border-b border-glass-border">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-text-muted hover:text-text-main hover:bg-glass-light transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <BrainIcon className="w-5 h-5 text-primary-cyan" />
          <span className="text-sm font-semibold text-text-main">FanVue</span>
        </div>

        <div className="w-9 h-9 rounded-full bg-primary-cyan/20 flex items-center justify-center text-sm text-primary-cyan font-medium">
          {user?.displayName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

// Inline to avoid extra import
function BrainIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0-6 6c0 4 6 9 6 9s6-5 6-9a6 6 0 0 0-6-6z" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
    </svg>
  );
}
