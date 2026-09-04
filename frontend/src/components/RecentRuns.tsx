import React, { useState, useEffect } from "react";
import { CheckCircle2, GitCommit, Loader2 } from "lucide-react";

export function RecentRuns() {
  const [recentRuns, setRecentRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API_URL}/api/runs`)
      .then(res => res.json())
      .then(data => {
        setRecentRuns(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch runs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="col-span-3 bg-card border border-border rounded-xl p-5 group relative overflow-hidden h-full min-h-[300px]">
      {/* Gradient hover border effect using pseudo-element */}
      <div className="absolute inset-0 bg-gradient-to-br from-status-healthy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ padding: '1px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-display font-semibold text-sm">Recent Runs</h3>
        <button className="text-[11px] font-mono text-text-muted hover:text-text-primary transition-colors">View all →</button>
      </div>
      
      <div className="flex flex-col divide-y divide-border relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-10">
             <Loader2 size={24} className="text-text-muted animate-spin" />
          </div>
        ) : recentRuns.map((r) => (
          <div key={r.id} className="flex flex-col py-3 hover:bg-surface -mx-2 px-2 rounded-md transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {r.status === "success"
                  ? <CheckCircle2 size={16} color="var(--status-healthy)" />
                  : <div className="w-4 h-4 rounded-full bg-brand-secondary/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-brand-secondary" /></div>}
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">{r.project_name}</p>
                  <span className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md ${r.project_env === 'PROD' ? 'bg-status-healthy/20 text-status-healthy' : r.project_env === 'STG' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-surface-active text-text-muted'}`}>
                    {r.project_env}
                  </span>
                  <p className="text-[11px] font-mono text-text-muted bg-surface px-1.5 py-0.5 rounded">{r.version}</p>
                </div>
              </div>
              <span className="text-[11px] text-text-faint font-mono">
                {new Date(r.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="flex items-center gap-3 ml-7">
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-mono bg-background px-2 py-1 rounded border border-border">
                <GitCommit size={12} />
                {r.commit_sha}
              </div>
              <p className="text-[12px] text-text-faint truncate max-w-[200px]">{r.commit_message}</p>
              <div className="ml-auto flex items-center gap-1.5">
                <img src={r.author_avatar} alt="author" className="w-4 h-4 rounded-full bg-surface-active" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
