import React, { useState, useEffect } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

export function ResponseTimeChart() {
  const [responseData, setResponseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/metrics/response-time");
        if (res.ok) {
          const data = await res.json();
          setResponseData(data);
        }
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-span-2 bg-card border border-border rounded-xl p-5 group relative overflow-hidden">
      {/* Gradient hover border effect using pseudo-element */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ padding: '1px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

      <div className="flex items-center justify-between mb-1 relative z-10">
        <h3 className="font-display font-semibold text-sm">Response Time</h3>
        <span className="flex items-center gap-1 text-status-healthy text-[11px] font-mono"><TrendingUp size={12} /> stable</span>
      </div>
      <p className="text-text-faint text-xs mb-2 relative z-10">Prometheus · last 15 min</p>
      
      <div className="h-24 relative z-10 mt-6">
        {loading ? (
          <div className="h-full flex items-center justify-center text-text-faint">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={responseData}>
              <defs>
                <linearGradient id="rt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
              <Area type="monotone" dataKey="v" stroke="var(--brand-primary)" strokeWidth={2} fill="url(#rt)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
