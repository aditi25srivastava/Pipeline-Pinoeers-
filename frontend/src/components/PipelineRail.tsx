import React, { useState } from "react";
import { ChevronRight, GitBranch, Hammer, FlaskConical, ShieldCheck, Container, Send, HeartPulse, Terminal } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

const stages = [
  { id: "checkout", label: "Code Checkout", icon: GitBranch, duration: "12s", status: "done", log: "Fetching origin/main\\nHEAD is now at 8b3c9a2 Add checkout stage\\nResolved dependencies..." },
  { id: "build", label: "Build", icon: Hammer, duration: "45s", status: "done", log: "npm ci\\nRunning build scripts...\\nBuild successful in 42s" },
  { id: "test", label: "Test", icon: FlaskConical, duration: "1m 20s", status: "done", log: "Running Jest tests...\\nPASS src/App.test.tsx\\nTest Suites: 24 passed, 24 total\\nTests: 104 passed, 104 total" },
  { id: "quality", label: "Quality Gate", icon: ShieldCheck, duration: "30s", status: "done", log: "SonarQube analysis...\\n0 Bugs\\n0 Vulnerabilities\\nCode Smell: 12 (A)\\nCoverage: 89.2% -> PASS" },
  { id: "docker", label: "Docker Build", icon: Container, duration: "55s", status: "done", log: "Step 1/8 : FROM node:18-alpine\\nStep 2/8 : WORKDIR /app\\nSuccessfully built 4f98d2a3c1e5\\nSuccessfully tagged ecommerce-api:v1.4.2" },
  { id: "deploy", label: "Deployment", icon: Send, duration: "18s", status: "active", log: "kubectl apply -f deployment.yaml\\ndeployment.apps/ecommerce-api configured\\nWaiting for rollout to finish: 1 of 3 updated replicas are available..." },
  { id: "health", label: "Health Check", icon: HeartPulse, duration: "—", status: "pending", log: "Pending..." },
];

function StageNode({ stage, index, total, onStageClick, activeStageId }: { stage: any, index: number, total: number, onStageClick: (id: string) => void, activeStageId: string }) {
  const Icon = stage.icon;
  const isDone = stage.status === "done";
  const isActive = stage.status === "active";
  const isSelected = stage.id === activeStageId;
  const color = isDone ? "var(--status-healthy)" : isActive ? "var(--brand-primary)" : "var(--border-hover)";
  const glow = isActive ? "0 0 15px rgba(240,169,78,0.4)" : "none";

  return (
    <div className="flex flex-col items-center relative flex-1 min-w-[92px]">
      {index < total - 1 && (
        <div className="absolute top-6 left-1/2 w-full h-[2px] z-0" style={{
          background: isDone
            ? "linear-gradient(90deg, var(--status-healthy), var(--status-healthy))"
            : "linear-gradient(90deg, var(--border-hover), var(--border-hover))"
        }} />
      )}
      
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => onStageClick(stage.id)}
              className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-2 transition-all hover:scale-110 active:scale-95 ${isSelected ? 'ring-2 ring-offset-2 ring-offset-card ring-brand-primary' : ''}`}
              style={{ borderColor: color, background: "var(--background)", boxShadow: glow }}
            >
              <Icon size={18} color={color} strokeWidth={2} />
              {isActive && (
                <span className="absolute w-12 h-12 rounded-full animate-ping" style={{ border: `2px solid ${color}`, opacity: 0.4 }} />
              )}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content 
              className="bg-surface-active text-text-primary text-xs font-mono px-3 py-2 rounded shadow-xl border border-border-hover z-50 animate-in fade-in zoom-in-95"
              sideOffset={5}
            >
              <div className="font-semibold text-text-primary mb-1">{stage.label}</div>
              <div className="text-text-muted">Started: 10:41 AM</div>
              <div className="text-text-muted">Runner: prod-worker-12</div>
              <Tooltip.Arrow className="fill-surface-active" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      <span className="mt-3 text-xs text-center text-text-faint font-medium leading-tight px-1">{stage.label}</span>
      <span className="mt-1 text-[11px] font-mono" style={{ color: isDone ? "var(--status-healthy)" : isActive ? "var(--brand-primary)" : "var(--text-faint)" }}>
        {stage.duration}
      </span>
    </div>
  );
}

export function PipelineRail() {
  const [activeStage, setActiveStage] = useState("deploy");
  const [showLogs, setShowLogs] = useState(false);

  const currentStageLog = stages.find(s => s.id === activeStage)?.log || "";

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-7 relative overflow-hidden group">
      {/* Subtle hover gradient for the container */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ padding: '1px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-lg">E-Commerce API</h2>
            <span className="bg-status-healthy/20 text-status-healthy text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md">PROD</span>
            <span className="bg-brand-primary/15 text-brand-primary text-[11px] font-mono px-2 py-0.5 rounded-full ml-2 animate-pulse">DEPLOYING</span>
          </div>
          <p className="text-text-muted text-sm font-mono mt-1">v1.4.2 · ecommerce/api · main</p>
        </div>
        <button 
          onClick={() => setShowLogs(!showLogs)}
          className={`text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors active:scale-95 ${showLogs ? 'bg-surface-active text-text-primary' : 'text-text-muted hover:text-text-primary hover:bg-surface-active'}`}
        >
          <Terminal size={14} />
          {showLogs ? 'Hide logs' : 'View logs'}
          <ChevronRight size={14} className={`transition-transform duration-200 ${showLogs ? 'rotate-90' : ''}`} />
        </button>
      </div>
      
      <div className="flex items-start px-2 relative z-10">
        {stages.map((stage, i) => (
          <StageNode key={stage.id} stage={stage} index={i} total={stages.length} onStageClick={setActiveStage} activeStageId={activeStage} />
        ))}
      </div>

      {showLogs && (
        <div className="mt-6 bg-background border border-border rounded-lg p-4 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono text-text-muted tracking-widest">{stages.find(s => s.id === activeStage)?.label} Logs</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-status-danger"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-status-degraded"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-status-healthy"></div>
            </div>
          </div>
          <pre className="text-[12px] font-mono text-text-muted whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {currentStageLog}
          </pre>
        </div>
      )}
    </div>
  );
}
