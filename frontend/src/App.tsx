import React, { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { StatCards } from "./components/StatCards";
import { PipelineRail } from "./components/PipelineRail";
import { RecentRuns } from "./components/RecentRuns";
import { ResponseTimeChart } from "./components/ResponseTimeChart";
import { ActivityFeed } from "./components/ActivityFeed";
import { ProjectsGrid } from "./components/ProjectsGrid";
import { SettingsView } from "./components/SettingsView";

import { DeploymentsView } from "./components/DeploymentsView";
import { MonitoringView } from "./components/MonitoringView";

export default function PipelinePioneers() {
  const [view, setView] = useState<"overview" | "projects" | "deployments" | "monitoring" | "settings">("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [uiScale, setUiScale] = useState(110); // Default bumped to 110% per user request
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      // Force reset to dark mode based on user preference
      localStorage.removeItem("pipeline_theme");
    } catch (e) {
      console.warn("localStorage is not available in this environment.");
    }
    return "dark";
  });
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Simulate skeleton loader on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Apply UI Scale to the root html element so rem-based Tailwind classes scale perfectly
  useEffect(() => {
    document.documentElement.style.fontSize = `${(uiScale / 100) * 16}px`;
  }, [uiScale]);

  // Apply theme class to the document root
  useEffect(() => {
    try {
      localStorage.setItem("pipeline_theme", theme);
    } catch (e) {
      // Ignore security errors in iframes
    }
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={`min-h-screen w-full flex bg-background text-text-primary transition-colors duration-300 relative ${theme}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        /* Subtle noise texture */
        .bg-noise {
          position: fixed; /* Changed to fixed so it spans everything without breaking layout */
          inset: 0;
          z-index: 0;
          opacity: 0.03;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Global Background Noise */}
      <div className="bg-noise"></div>

      <Sidebar view={view} setView={setView} />

      <main className="flex-1 px-8 py-6 overflow-auto relative z-10">
        {view !== "settings" && <Header view={view} setView={setView} theme={theme} setTheme={setTheme} />}

        {isLoading ? (
          // Skeleton Loader
          <div className="animate-pulse flex flex-col gap-7 mt-8">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-card border border-border rounded-xl"></div>)}
            </div>
            <div className="h-64 bg-card border border-border rounded-xl"></div>
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 h-48 bg-card border border-border rounded-xl"></div>
              <div className="col-span-2 h-48 bg-card border border-border rounded-xl"></div>
            </div>
          </div>
        ) : view === "overview" ? (
          <div className={animationsEnabled ? "animate-in fade-in duration-500" : ""}>
            <StatCards />
            <PipelineRail />
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <RecentRuns />
              </div>
              <div className="col-span-2">
                <ResponseTimeChart />
              </div>
              <div className="col-span-1">
                <ActivityFeed />
              </div>
            </div>
          </div>
        ) : view === "projects" ? (
          <ProjectsGrid animationsEnabled={animationsEnabled} />
        ) : view === "deployments" ? (
          <DeploymentsView animationsEnabled={animationsEnabled} />
        ) : view === "monitoring" ? (
          <MonitoringView animationsEnabled={animationsEnabled} />
        ) : view === "settings" ? (
          <SettingsView 
            uiScale={uiScale} setUiScale={setUiScale} 
            theme={theme} setTheme={setTheme}
            animationsEnabled={animationsEnabled} setAnimationsEnabled={setAnimationsEnabled}
          />
        ) : null}
      </main>

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-4 right-4 z-50 group cursor-help">
        <div className="w-8 h-8 rounded-full bg-surface text-text-muted flex items-center justify-center border border-border shadow-lg group-hover:bg-surface-active transition-colors">
          ?
        </div>
        <div className="absolute bottom-10 right-0 w-48 bg-card border border-border rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none transform translate-y-2 group-hover:translate-y-0">
          <p className="text-xs text-text-muted font-medium mb-2">Keyboard Shortcuts</p>
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span>Command Palette</span>
            <kbd className="font-mono bg-surface px-1 py-0.5 rounded text-text-primary">⌘K</kbd>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span>New Deploy</span>
            <kbd className="font-mono bg-surface px-1 py-0.5 rounded text-text-primary">⌘D</kbd>
          </div>
        </div>
      </div>

      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
