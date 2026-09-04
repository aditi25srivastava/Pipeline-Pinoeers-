import React, { useState, useEffect } from "react";
import { Bell, Search, ChevronRight, CheckCircle2, Rocket, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { Command } from "cmdk";

export function Header({ 
  view, 
  setView,
  theme,
  setTheme
}: { 
  view: "overview" | "projects" | "deployments" | "monitoring";
  setView: (v: "overview" | "projects" | "deployments" | "monitoring") => void;
  theme: "dark" | "light";
  setTheme: (v: "dark" | "light") => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleDeploy = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/projects");
      const projects = await res.json();
      const project = projects.find((p: any) => p.name === "ecommerce/api") || projects[0];
      
      if (project) {
        const triggerRes = await fetch(`http://localhost:8000/api/projects/${project.id}/trigger`, {
          method: "POST"
        });
        const triggerData = await triggerRes.json();
        
        if (triggerRes.ok) {
          toast.success("Deployment triggered", {
            description: `${project.name} - ${triggerData.message}`,
            icon: <Rocket size={16} className="text-[#34D6B4]" />
          });
        } else {
          toast.error("Failed to trigger deployment", {
            description: triggerData.detail || "Unknown error"
          });
        }
      }
    } catch (err) {
      toast.error("Network error triggering deployment");
    }
  };

  const handleSimulateFailure = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/projects");
      const projects = await res.json();
      const project = projects.find((p: any) => p.name === "ecommerce/api") || projects[0];

      if (project) {
        const triggerRes = await fetch(`http://localhost:8000/api/projects/${project.id}/simulate-failure`, {
          method: "POST"
        });
        const triggerData = await triggerRes.json();
        
        if (triggerRes.ok) {
          toast.error("Catastrophic Failure Simulated", {
            description: `${project.name} - ${triggerData.message}`,
          });
        }
      }
    } catch (err) {
      toast.error("Network error simulating failure");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-7 relative z-10">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-text-faint mb-1">
            <span className="hover:text-text-primary cursor-pointer transition-colors" onClick={() => setView("projects")}>Projects</span>
            <span>/</span>
            <span className="text-text-muted">ecommerce-api</span>
            <span>/</span>
            <span className="text-brand-primary">Run #143</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold tracking-tight capitalize">
              {view === "overview" ? "Overview" : view}
            </h1>
            {(view === "overview" || view === "projects") && (
              <div className="flex bg-card border border-border rounded-lg p-0.5">
                <button 
                  onClick={() => setView("overview")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === "overview" ? "bg-surface-active text-text-primary" : "text-text-faint hover:text-text-muted"}`}
                >
                  Pipeline
                </button>
                <button 
                  onClick={() => setView("projects")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === "projects" ? "bg-surface-active text-text-primary" : "text-text-faint hover:text-text-muted"}`}
                >
                  Grid
                </button>
              </div>
            )}
          </div>
          <p className="text-text-faint text-sm mt-1">Real-time status across every connected pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-card border border-border hover:border-border-hover transition-colors rounded-lg px-3 py-2 text-text-faint"
          >
            <Search size={14} />
            <span className="text-sm">Search runs…</span>
            <span className="flex items-center justify-center bg-surface-active rounded text-[10px] px-1.5 py-0.5 ml-2 font-mono">
              <span className="text-[12px] mr-0.5">⌘</span>K
            </span>
          </button>
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg bg-card border border-border hover:border-border-hover transition-colors flex items-center justify-center text-text-muted active:scale-95"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="w-9 h-9 rounded-lg bg-card border border-border hover:border-border-hover transition-colors flex items-center justify-center text-text-muted active:scale-95">
            <Bell size={15} />
          </button>
          <button 
            onClick={handleSimulateFailure}
            className="bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444]/50 active:scale-95 transition-all text-[#EF4444] font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-1.5"
          >
            Simulate Failure
          </button>
          <button 
            onClick={handleDeploy}
            className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 active:scale-95 transition-all text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-1.5"
          >
            New Deployment <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Command 
            className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-border px-3">
              <Search size={16} className="text-text-faint mr-2" />
              <Command.Input 
                autoFocus
                placeholder="Search projects, runs, deployments..." 
                className="flex-1 bg-transparent border-none text-text-primary text-sm py-4 outline-none placeholder:text-text-faint"
              />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-text-faint">No results found.</Command.Empty>
              <Command.Group heading="Projects" className="text-xs font-semibold text-text-muted px-2 py-1.5">
                <Command.Item 
                  onSelect={() => setOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm text-text-primary rounded-md hover:bg-surface-active cursor-pointer aria-selected:bg-surface-active"
                >
                  <Rocket size={14} className="text-brand-primary"/>
                  ecommerce/api
                </Command.Item>
                <Command.Item 
                  onSelect={() => setOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm text-text-primary rounded-md hover:bg-surface-active cursor-pointer aria-selected:bg-surface-active"
                >
                  <Rocket size={14} className="text-text-muted"/>
                  payments/service
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </>
  );
}
