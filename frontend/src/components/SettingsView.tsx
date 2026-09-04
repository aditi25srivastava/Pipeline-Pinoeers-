import React from "react";
import { Monitor, Type, Moon, Sun, Sparkles } from "lucide-react";

export function SettingsView({
  uiScale,
  setUiScale,
  theme,
  setTheme,
  animationsEnabled,
  setAnimationsEnabled
}: {
  uiScale: number;
  setUiScale: (val: number) => void;
  theme: "dark" | "light";
  setTheme: (val: "dark" | "light") => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (val: boolean) => void;
}) {
  return (
    <div className={animationsEnabled ? "animate-in fade-in duration-500 max-w-3xl" : "max-w-3xl"}>
      <h2 className="font-display text-2xl font-semibold tracking-tight mb-6 text-text-primary">Settings</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display font-medium text-lg mb-4 flex items-center gap-2 text-text-primary">
          <Monitor size={18} className="text-text-muted" /> Appearance
        </h3>
        
        <div className="flex flex-col gap-6">
          {/* UI Scale / Font Size */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                <Type size={16} className="text-text-faint" /> Global Font Size / UI Scale
              </label>
              <span className="text-brand-primary font-mono text-xs">{uiScale}%</span>
            </div>
            <p className="text-xs text-text-muted mb-2">
              Adjusts the root font size, scaling all text and spacing proportionally.
            </p>
            <input 
              type="range" 
              min="80" 
              max="150" 
              step="5"
              value={uiScale}
              onChange={(e) => setUiScale(parseInt(e.target.value))}
              className="w-full accent-brand-primary"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-faint">
              <span>Small (80%)</span>
              <span>Default (100%)</span>
              <span>Large (150%)</span>
            </div>
          </div>

          <hr className="border-border" />

          {/* Theme */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Theme</label>
            <p className="text-xs text-text-muted mb-2">
              Select your preferred color theme.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setTheme("dark")}
                className={`flex-1 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors border-2 ${theme === "dark" ? "bg-surface-active border-brand-primary" : "bg-card border-border hover:border-border-hover"}`}>
                <Moon size={24} className={theme === "dark" ? "text-text-primary" : "text-text-muted"} />
                <span className={`text-sm font-medium ${theme === "dark" ? "text-text-primary" : "text-text-muted"}`}>Dark</span>
              </button>
              <button 
                onClick={() => setTheme("light")}
                className={`flex-1 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors border-2 ${theme === "light" ? "bg-surface-active border-brand-primary" : "bg-card border-border hover:border-border-hover"}`}>
                <Sun size={24} className={theme === "light" ? "text-text-primary" : "text-text-muted"} />
                <span className={`text-sm font-medium ${theme === "light" ? "text-text-primary" : "text-text-muted"}`}>Light</span>
              </button>
            </div>
          </div>

          <hr className="border-border" />

          {/* Animations */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                <Sparkles size={16} className="text-text-faint" /> UI Animations
              </label>
              <button 
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className={`w-10 h-5 rounded-full relative transition-colors ${animationsEnabled ? 'bg-brand-primary' : 'bg-surface-active border border-border'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${animationsEnabled ? 'translate-x-5' : 'translate-x-0.5 shadow-sm'}`} />
              </button>
            </div>
            <p className="text-xs text-text-muted mb-2">
              Enable or disable transitions, pulses, and scale effects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
