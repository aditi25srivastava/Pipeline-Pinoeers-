import React, { useState, useEffect } from "react";
import { FolderGit2, Loader2 } from "lucide-react";

function Sparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 14 - ((d - min) / (max - min || 1)) * 12 - 1;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="60" height="14" className="opacity-80">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Generate random mock data for sparkline since DB doesn't store metrics yet
const generateMockSparkline = (status: string) => {
  if (status === 'healthy') return { color: "var(--status-healthy)", data: [82,84,83,86,88,87,89] };
  if (status === 'degraded') return { color: "var(--status-degraded)", data: [99,98,90,85,80,82,75] };
  return { color: "var(--status-danger)", data: [95,96,94,50,20,0,0] };
};

export function ProjectsGrid({ animationsEnabled = true }: { animationsEnabled?: boolean }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 w-full">
         <Loader2 size={32} className="text-text-muted animate-spin" />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-4 ${animationsEnabled ? "animate-in fade-in duration-300" : ""}`}>
      {projects.map((p) => {
        const { color, data } = generateMockSparkline(p.status);
        return (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 group relative overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform">
            {/* Gradient hover border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-text-muted/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ padding: '1px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
            
            <div className="flex items-start justify-between mb-4">
              <div className="w-8 h-8 rounded bg-surface flex items-center justify-center">
                <FolderGit2 size={16} className="text-text-muted" />
              </div>
              <span className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md ${p.environment === 'PROD' ? 'bg-status-healthy/20 text-status-healthy' : p.environment === 'STG' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-surface-active text-text-muted'}`}>
                {p.environment}
              </span>
            </div>
            
            <h4 className="text-sm font-medium text-text-primary mb-1">{p.name}</h4>
            
            <div className="flex items-end justify-between mt-4">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${p.status === 'healthy' ? 'bg-status-healthy' : p.status === 'degraded' ? 'bg-status-degraded' : 'bg-status-danger'}`}></div>
                <span className="text-[11px] text-text-faint capitalize">{p.status}</span>
              </div>
              <Sparkline data={data} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
