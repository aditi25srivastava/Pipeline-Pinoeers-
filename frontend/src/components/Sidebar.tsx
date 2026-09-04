import React from "react";
import { LayoutDashboard, FolderGit2, Rocket, Activity, Settings } from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Projects", icon: FolderGit2 },
  { label: "Deployments", icon: Rocket },
  { label: "Monitoring", icon: Activity },
  { label: "Settings", icon: Settings },
];

export function Sidebar({ 
  view, 
  setView 
}: { 
  view: "overview" | "projects" | "deployments" | "monitoring" | "settings";
  setView: (v: "overview" | "projects" | "deployments" | "monitoring" | "settings") => void;
}) {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col py-6 px-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
          <Rocket size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-[15px] tracking-tight">Pipeline Pioneers</span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-text-faint px-2 mb-3">Control Platform</span>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          // Determine if this nav item should be active based on the current view state
          const isActive = 
            (item.label === "Dashboard" && view === "overview") ||
            (item.label === "Projects" && view === "projects") ||
            (item.label === "Settings" && view === "settings");

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Settings") setView("settings");
                else if (item.label === "Dashboard") setView("overview");
                else if (item.label === "Projects") setView("projects");
                else if (item.label === "Deployments") setView("deployments");
                else if (item.label === "Monitoring") setView("monitoring");
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                isActive
                  ? "bg-surface-active text-brand-primary font-medium"
                  : "text-text-muted hover:bg-surface hover:text-text-primary"
              }`}
            >
              <item.icon size={16} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
