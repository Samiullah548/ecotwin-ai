import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface ChartDataEntry {
  year: number;
  Projected: number;
  'Business As Usual': number;
  unit: string;
}

interface ProjectionChartProps {
  chartData: ChartDataEntry[];
  activeTab: 'temp' | 'co2' | 'biodiversity';
  setActiveTab: (tab: 'temp' | 'co2' | 'biodiversity') => void;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = React.memo(({ chartData, activeTab, setActiveTab }) => (
  <div className="glass-panel rounded-2xl p-6 flex flex-col min-h-[300px] h-[320px]">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-headline-md text-headline-md text-on-surface">Projection Curves</h3>
      <div className="flex bg-white/5 border border-white/10 rounded-lg p-1" role="tablist" aria-label="Chart metric selection">
        {([
          { id: 'temp',         label: 'Temp Delta' },
          { id: 'co2',          label: 'Atmospheric CO₂'},
          { id: 'biodiversity', label: 'Biodiversity' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-md font-label-sm text-label-sm transition-all ${activeTab === tab.id ? 'bg-secondary text-on-secondary shadow-[0_0_8px_rgba(211,254,50,0.3)]' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
    <div className="flex-1 w-full text-xs">
      <ResponsiveContainer aspect={2}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d3fe32" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d3fe32" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="bauGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffb4ab" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ffb4ab" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="year" tick={{ fill: '#c1c8c4', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#c1c8c4', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#141d1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#dbe5e1' }}
            labelStyle={{ color: '#c1c8c4' }}
            formatter={(value, name) => [`${value}${chartData[0]?.unit ?? ''}`, String(name)]}
          />
          <Area type="monotone" dataKey="Projected" stroke="#d3fe32" strokeWidth={2.5} fill="url(#projGrad)"
            dot={{ fill: '#0c1513', stroke: '#d3fe32', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#d3fe32', stroke: '#0c1513', strokeWidth: 2 }}
          />
          <Area type="monotone" dataKey="Business As Usual" stroke="#ffb4ab" strokeWidth={1.5}
            strokeDasharray="4 4" fill="url(#bauGrad)"
            dot={{ fill: '#0c1513', stroke: '#ffb4ab', strokeWidth: 1.5, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
));

ProjectionChart.displayName = 'ProjectionChart';
