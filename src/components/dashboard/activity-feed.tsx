import { DollarSign, MessageSquare, UserPlus, Bell } from "lucide-react";
import { Link } from "react-router-dom";

interface Activity {
  id: string;
  type: string;
  description: string;
  amount: string | null;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "ppv_purchase":
        return <DollarSign className="w-4 h-4 text-status-success" />;
      case "new_subscriber":
        return <UserPlus className="w-4 h-4 text-primary-blue" />;
      case "ai_chat":
        return <MessageSquare className="w-4 h-4 text-secondary-violet" />;
      case "bump_sent":
        return <Bell className="w-4 h-4 text-accent-gold" />;
      default:
        return <Bell className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="bg-glass-base border border-glass-border rounded-xl p-6 shadow-depth h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-text-main">Recent Activity</h2>
        <Link to="/fans" className="text-xs font-semibold text-primary-cyan hover:text-primary-cyan/80 transition-colors">
          View All
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-glass-light transition-colors group">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-glass-light flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-main leading-snug">
                {activity.description}
              </p>
              <p className="text-xs text-text-muted mt-1">{activity.time}</p>
            </div>
            {activity.amount && (
              <div className="text-sm font-bold text-status-success">
                {activity.amount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
