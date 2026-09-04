import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API_URL}/api/activities`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch activities:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-5 group relative overflow-hidden h-full">
      {/* Gradient hover border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-text-muted/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ padding: '1px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
      
      <h3 className="font-display font-semibold text-sm mb-4 relative z-10">Team Activity</h3>
      
      <div className="flex flex-col gap-4 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-10">
             <Loader2 size={24} className="text-text-muted animate-spin" />
          </div>
        ) : activities.map((a, i) => (
          <div key={a.id} className="flex gap-3">
            <img src={a.user_avatar} alt="avatar" className="w-8 h-8 rounded-full bg-surface-active" />
            <div className="flex flex-col">
              <p className="text-sm text-text-primary">
                <span className="font-medium">{a.user_name}</span> <span className="text-text-muted">{a.action}</span> <span className="font-mono text-[11px] bg-surface px-1 py-0.5 rounded text-text-primary">{a.target}</span>
              </p>
              <span className="text-[11px] text-text-faint font-mono mt-0.5">
                {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
