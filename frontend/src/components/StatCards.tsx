import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

function Sparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 20 - ((d - min) / (max - min || 1)) * 18 - 1;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="60" height="20" className="opacity-80">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RadialGauge({ value, color }: { value: number, color: string }) {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-[24px] h-[24px]">
      <svg width="24" height="24" className="transform -rotate-90">
        <circle
          cx="12"
          cy="12"
          r={radius}
          className="stroke-border"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
    </div>
  );
}

function StatCard({ s }: { s: any }) {
  return (
    <div className="relative group bg-card border border-border rounded-xl p-5 flex flex-col gap-3 overflow-hidden">
      {/* Gradient hover border effect using pseudo-element */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ padding: '1px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
      
      <div className="flex items-center justify-between z-10">
        <span className="text-text-muted text-xs tracking-wide uppercase font-medium">{s.label}</span>
        {s.isRadial ? (
          <RadialGauge value={parseFloat(s.value)} color={s.accent} />
        ) : (
          <Sparkline data={s.data} color={s.accent} />
        )}
      </div>
      <div className="flex items-end justify-between z-10">
        <span className="font-mono text-3xl font-semibold" style={{ color: s.accent }}>{s.value}</span>
        {s.trend && (
          <span className={`text-[11px] font-mono ${s.accent === '#F0654E' || s.accent === 'var(--brand-secondary)' ? 'text-brand-secondary' : 'text-text-faint'}`}>
            {s.trend}
          </span>
        )}
      </div>
    </div>
  );
}

const stat = (label: string, value: string, accent: string, trend: string | null, data: number[], isRadial = false) => ({ label, value, accent, trend, data, isRadial });

export function StatCards() {
  const [statsData, setStatsData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/stats")
      .then(res => res.json())
      .then(data => setStatsData(data))
      .catch(err => console.error(err));
  }, []);

  if (!statsData) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-[120px] bg-card border border-border rounded-xl animate-pulse"></div>)}
      </div>
    );
  }

  const stats = [
    stat("Total Projects", statsData.total_projects.toString(), "var(--text-muted)", null, [4,5,4,6,6,7,8]),
    stat("Pipeline Runs", statsData.total_runs.toString(), "var(--brand-primary)", null, [12,18,14,22,19,26,30]),
    stat("Success Rate", statsData.success_rate + "%", "var(--status-healthy)", null, [], true),
    stat("Active Rollbacks", statsData.active_rollbacks.toString(), "var(--brand-secondary)", statsData.active_rollbacks > 0 ? "needs attention" : "all good", [0,1,0,2,1,1,2]),
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-7">
      {stats.map((s) => <StatCard key={s.label} s={s} />)}
    </div>
  );
}
