import React, { useState, useEffect } from "react";
import { CheckCircle2, GitCommit, Loader2, Search, Filter, Clock } from "lucide-react";

export function DeploymentsView({ animationsEnabled }: { animationsEnabled: boolean }) {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/runs")
      .then(res => res.json())
      .then(data => {
        setRuns(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch runs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={`flex flex-col h-full ${animationsEnabled ? "animate-in fade-in duration-500" : ""}`}>
      {/* Filters and search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input 
              type="text" 
              placeholder="Filter deployments..." 
              className="bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-brand-primary transition-colors w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-card border border-border hover:border-border-hover transition-colors rounded-lg px-3 py-2 text-text-muted text-sm">
            <Filter size={14} />
            <span>Environment: All</span>
          </button>
        </div>
        <button className="flex items-center gap-2 bg-card border border-border hover:border-border-hover transition-colors rounded-lg px-3 py-2 text-text-muted text-sm">
          <span>Sort by: Newest</span>
        </button>
      </div>

      {/* Build History Table */}
      <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border bg-surface text-xs font-semibold text-text-muted uppercase tracking-wider">
          <div className="col-span-3">Project / Env</div>
          <div className="col-span-4">Commit / Trigger</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 size={32} className="text-text-muted animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {runs.map((r) => (
                <div key={r.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-surface/50 transition-colors group">
                  
                  {/* Project and Env */}
                  <div className="col-span-3 flex items-center gap-3">
                    {r.status === "success"
                      ? <CheckCircle2 size={18} color="var(--status-healthy)" />
                      : <div className="w-4 h-4 rounded-full bg-brand-secondary/20 flex items-center justify-center ml-0.5"><div className="w-1.5 h-1.5 rounded-full bg-brand-secondary" /></div>}
                    <div>
                      <p className="text-sm font-medium text-text-primary">{r.project_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md ${r.project_env === 'PROD' ? 'bg-status-healthy/20 text-status-healthy' : r.project_env === 'STG' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-surface-active text-text-muted'}`}>
                          {r.project_env}
                        </span>
                        <span className="text-[10px] font-mono text-text-faint">{r.version}</span>
                      </div>
                    </div>
                  </div>

                  {/* Commit details */}
                  <div className="col-span-4 flex items-start flex-col justify-center">
                    <p className="text-sm text-text-primary truncate w-full pr-4">{r.commit_message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1 text-[11px] text-text-muted font-mono bg-background px-1.5 py-0.5 rounded border border-border">
                        <GitCommit size={12} />
                        {r.commit_sha}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-faint">
                        <img src={r.author_avatar} alt="author" className="w-3.5 h-3.5 rounded-full bg-surface-active" />
                        <span>{r.author_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="col-span-2 flex items-center gap-2 text-sm text-text-muted">
                    <Clock size={14} className="text-text-faint" />
                    {r.duration_ms ? `${(r.duration_ms / 1000).toFixed(1)}s` : 'Unknown'}
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-sm text-text-muted">
                    {new Date(r.started_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border hover:border-border-hover text-text-muted hover:text-text-primary px-3 py-1.5 rounded-md text-xs font-medium">
                      Logs
                    </button>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
