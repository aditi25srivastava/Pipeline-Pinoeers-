import React, { useState, useEffect } from "react";
import { Activity, Server, Cpu, HardDrive, Wifi, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, CartesianGrid } from "recharts";

export function MonitoringView({ animationsEnabled }: { animationsEnabled: boolean }) {
  const [metrics, setMetrics] = useState<{cpu: any[], memory: any[], network: any[]}>({ cpu: [], memory: [], network: [] });
  const [loading, setLoading] = useState(true);

  // Generate some mock time-series data for the charts
  useEffect(() => {
    const generateData = (base: number, volatility: number) => {
      return Array.from({ length: 24 }).map((_, i) => ({
        time: `${i}:00`,
        value: Math.max(10, Math.min(95, base + (Math.random() * volatility * 2 - volatility)))
      }));
    };

    setMetrics({
      cpu: generateData(45, 20),
      memory: generateData(65, 10),
      network: generateData(30, 25),
    });
    
    // Simulate network delay
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const ChartCard = ({ title, icon: Icon, data, color, value, unit, status }: any) => (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col h-64">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-surface rounded-lg">
            <Icon size={16} className="text-text-muted" />
          </div>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold font-mono">{value}<span className="text-sm text-text-faint ml-0.5">{unit}</span></span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mb-6">
        <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-status-healthy' : 'bg-status-degraded'}`} />
        <span className="text-xs text-text-faint">{status === 'healthy' ? 'Normal operation' : 'Elevated usage'}</span>
      </div>
      
      <div className="flex-1 -mx-2 mt-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 size={24} className="text-text-faint animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={[0, 100]} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                fill={`url(#gradient-${title})`} 
                isAnimationActive={animationsEnabled}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col gap-6 ${animationsEnabled ? "animate-in fade-in duration-500" : ""}`}>
      {/* Cluster Health Banner */}
      <div className="bg-status-healthy/10 border border-status-healthy/30 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-status-healthy/20 flex items-center justify-center text-status-healthy">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-status-healthy">All Systems Operational</h3>
            <p className="text-sm text-status-healthy/80">Cluster health is optimal. No active incidents reported in the last 24 hours.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-status-healthy/80 font-mono mb-1">Uptime</p>
          <p className="font-mono text-status-healthy font-semibold">99.998%</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <ChartCard 
          title="CPU Usage" 
          icon={Cpu} 
          data={metrics.cpu} 
          color="var(--brand-primary)" 
          value="45" 
          unit="%" 
          status="healthy"
        />
        <ChartCard 
          title="Memory Allocation" 
          icon={HardDrive} 
          data={metrics.memory} 
          color="var(--status-degraded)" 
          value="6.2" 
          unit="GB" 
          status="degraded"
        />
        <ChartCard 
          title="Network Traffic" 
          icon={Wifi} 
          data={metrics.network} 
          color="var(--status-healthy)" 
          value="1.2" 
          unit="TB/s" 
          status="healthy"
        />
      </div>

      {/* Active Instances Table */}
      <div className="bg-card border border-border rounded-xl flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Server size={16} className="text-text-muted" /> Active Infrastructure Nodes
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4 px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            <div className="col-span-2">Instance ID</div>
            <div>Region</div>
            <div>Status</div>
            <div className="text-right">Load</div>
          </div>
          
          {[
            { id: 'i-04f38b29c', region: 'us-east-1a', status: 'Running', load: '32%' },
            { id: 'i-0a9b8c7d6', region: 'us-east-1b', status: 'Running', load: '45%' },
            { id: 'i-0e1f2a3b4', region: 'eu-west-1a', status: 'Provisioning', load: '0%' },
            { id: 'i-0c5d6e7f8', region: 'ap-south-1', status: 'Running', load: '89%' },
          ].map((node) => (
            <div key={node.id} className="grid grid-cols-5 gap-4 px-4 py-3 items-center rounded-lg hover:bg-surface transition-colors cursor-pointer border border-transparent hover:border-border mb-1">
              <div className="col-span-2 flex items-center gap-2 font-mono text-sm">
                {node.id}
              </div>
              <div className="text-sm text-text-muted">{node.region}</div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${node.status === 'Running' ? 'bg-status-healthy' : 'bg-status-degraded animate-pulse'}`} />
                <span className="text-sm text-text-primary">{node.status}</span>
              </div>
              <div className="text-right font-mono text-sm">{node.load}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
