import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { useStore, getScoreGrade } from '../store/useStore';
import type { ActivityEntry } from '../store/useStore';
import { Modal } from '../components/Modal';
import { LOG_ACTIONS } from '../utils/constants';
import {
  generateMonthlyEmissions,
  buildDonutData,
  generateReportLines,
  downloadReport,
} from '../utils/carbonCalculations';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

const ChartTooltip: React.FC<ChartTooltipProps> = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container border border-white/10 rounded-lg px-4 py-2 shadow-xl backdrop-blur-md">
        <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
        <p className="font-headline-md text-headline-md text-secondary">{payload[0].value}t</p>
      </div>
    );
  }
  return null;
});
ChartTooltip.displayName = 'ChartTooltip';

// ─── Log Action Modal Content ─────────────────────────────────────────────────

const LogActionModalContent: React.FC<{ onClose: () => void }> = React.memo(({ onClose }) => {
  const { logActivity } = useStore();
  return (
    <div className="space-y-3">
      {LOG_ACTIONS.map((action) => (
        <button
          key={action.label}
          className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-secondary/50 hover:bg-secondary/5 transition-all text-left"
          onClick={() => {
            logActivity({
              icon: action.icon,
              label: action.label,
              saved: action.saved,
              waterSaved: action.waterSaved,
              color: action.color,
            });
            onClose();
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `rgba(${action.color === 'secondary' ? '211,254,50' : action.color === 'tertiary' ? '175,198,255' : '176,205,194'}, 0.2)`,
              color: action.color === 'secondary' ? '#d3fe32' : action.color === 'tertiary' ? '#afc6ff' : '#b0cdc2',
            }}
            aria-hidden="true"
          >
            <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
          </div>
          <div className="flex-1">
            <p className="font-label-md text-label-md text-on-surface">{action.label}</p>
            <p className="font-label-sm text-label-sm text-secondary">−{action.saved}kg CO₂</p>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">chevron_right</span>
        </button>
      ))}
    </div>
  );
});
LogActionModalContent.displayName = 'LogActionModalContent';

// ─── Main Component ──────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => {
  const {
    ecoScore,
    ecoLevel,
    ecoTitle,
    carbonFootprint,
    emissionBreakdown,
    activityLog,
    monthlyProgress,
    completedChallenges,
    settings,
  } = useStore();

  const [showLogModal, setShowLogModal] = useState(false);
  const [chartRange, setChartRange] = useState<'6m' | 'year'>('6m');
  const navigate = useNavigate();

  const grade = getScoreGrade(ecoScore);
  const scorePercent = ecoScore;
  const scoreDash = `${scorePercent}, 100`;

  // Memoised chart data — only recalculates when carbonFootprint changes
  const allMonthlyData = useMemo(
    () => generateMonthlyEmissions(carbonFootprint),
    [carbonFootprint],
  );
  const chartData = chartRange === '6m' ? allMonthlyData.slice(-6) : allMonthlyData;

  // Memoised donut data
  const donutData = useMemo(() => buildDonutData(emissionBreakdown), [emissionBreakdown]);

  // Memoised AI insight message
  const aiInsights = useMemo(() => {
    const msgs = [
      `Your footprint of ${carbonFootprint}t is ${carbonFootprint < 10 ? 'below' : 'above'} the global average of 10t/yr.`,
      `With an Eco Score of ${ecoScore}, you rank in the top ${Math.max(5, 100 - ecoScore)}% of users worldwide.`,
      `Reducing meat consumption by 50% could save up to ${(carbonFootprint * 0.12).toFixed(1)}t CO₂ annually.`,
    ];
    return msgs[ecoLevel % msgs.length];
  }, [ecoScore, carbonFootprint, ecoLevel]);

  // Challenges progress (reactive — no longer calls useStore.getState())
  const challengeProgress = Math.min(100, (completedChallenges.length / 4) * 100);

  const handleExport = () => {
    const lines = generateReportLines({
      name: settings.name,
      email: settings.email,
      role: settings.role,
      ecoLevel,
      ecoTitle,
      ecoScore,
      grade,
      carbonFootprint,
      monthlyProgress,
      emissionBreakdown,
      activityLog,
    });
    downloadReport(lines, `EcoTwin-Report-${new Date().toISOString().split('T')[0]}.txt`);
  };

  return (
    <div className="max-w-container-max mx-auto space-y-gutter">
      {/* Accessible modal via shared Modal component */}
      <Modal
        open={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Log Eco Action"
        id="log-action-modal"
      >
        <LogActionModalContent onClose={() => setShowLogModal(false)} />
      </Modal>

      {/* Hero Header — h1 as the primary page heading */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
            Welcome back, <span className="text-secondary">Eco-Explorer</span>.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {ecoScore >= 80
              ? '🌿 Your biophilic data ecosystem is thriving. Keep it up!'
              : 'Your sustainability journey continues — every action counts.'}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            aria-label="Export sustainability report"
            className="glass-panel px-6 py-3 rounded-full font-label-md text-label-md text-primary flex items-center gap-2 hover:bg-primary/10 transition-colors border-primary/30"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">download</span>
            Export Report
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            aria-label="Log a new eco action"
            className="bg-secondary text-on-secondary px-6 py-3 rounded-full font-label-md text-label-md flex items-center gap-2 glow-secondary hover:bg-secondary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add_circle</span>
            Log Action
          </button>
        </div>
      </header>

      {/* Top Stats Bento */}
      <section aria-label="Key sustainability metrics" className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Carbon Footprint */}
        <div className="glass-panel rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-secondary/30 transition-colors">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-error/10 rounded-full blur-2xl group-hover:bg-error/20 transition-all" aria-hidden="true" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/5" aria-hidden="true">
              <span className="material-symbols-outlined text-error">co2</span>
            </div>
            <span className="bg-surface-container px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant">YTD Total</span>
          </div>
          <div>
            <h2 className="font-label-md text-label-md text-on-surface-variant mb-1">Carbon Footprint</h2>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-on-surface">{carbonFootprint}</span>
              <span className="font-headline-md text-headline-md text-error">t</span>
            </div>
            <p className={`font-label-sm text-label-sm flex items-center gap-1 mt-2 ${carbonFootprint < 10 ? 'text-secondary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">{carbonFootprint < 10 ? 'arrow_downward' : 'arrow_upward'}</span>
              {carbonFootprint < 10 ? 'Below' : 'Above'} global avg (10t)
            </p>
          </div>
        </div>

        {/* Eco Score */}
        <div className="glass-panel rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-secondary/30 transition-colors">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all" aria-hidden="true" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/5" aria-hidden="true">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
            </div>
            {/* Score ring — decorative */}
            <div className="relative w-12 h-12 flex items-center justify-center" aria-hidden="true">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={scoreDash} strokeWidth="3" />
              </svg>
              <span className="absolute font-label-sm text-label-sm text-secondary font-bold">{grade}</span>
            </div>
          </div>
          <div>
            <h2 className="font-label-md text-label-md text-on-surface-variant mb-1">Eco Score</h2>
            <div className="flex flex-col gap-1">
              <span className="font-headline-lg-mobile text-headline-lg-mobile md:text-[64px] leading-tight text-on-surface">{ecoScore}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">Top {Math.max(5, 100 - ecoScore)}% in your region</span>
            </div>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="glass-panel rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-tertiary/30 transition-colors">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl group-hover:bg-tertiary/20 transition-all" aria-hidden="true" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-white/5" aria-hidden="true">
              <span className="material-symbols-outlined text-tertiary">moving</span>
            </div>
            <span className="bg-surface-container px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant">This Month</span>
          </div>
          <div>
            <h2 className="font-label-md text-label-md text-on-surface-variant mb-1">Monthly Progress</h2>
            <div className="flex items-baseline gap-2">
              <span className={`font-display-lg text-display-lg ${monthlyProgress >= 0 ? 'text-tertiary' : 'text-error'}`}>
                {monthlyProgress >= 0 ? '+' : ''}{monthlyProgress}
              </span>
              <span className={`font-headline-md text-headline-md ${monthlyProgress >= 0 ? 'text-tertiary' : 'text-error'}`}>%</span>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mt-2">
              {monthlyProgress > 0 ? 'Reduction in overall footprint' : 'Increase vs last month'}
            </p>
          </div>
        </div>
      </section>

      {/* AI Insight Banner */}
      <section aria-label="AI sustainability insight" className="glass-panel rounded-xl p-1 relative overflow-hidden group mt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-tertiary/10 via-secondary/10 to-transparent opacity-50" aria-hidden="true" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-tertiary to-secondary glow-secondary" aria-hidden="true" />
        <div className="bg-surface-container-low/50 backdrop-blur-md rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center border border-white/10 shrink-0 shadow-[0_0_20px_rgba(175,198,255,0.2)]" aria-hidden="true">
            <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-label-md text-label-md text-tertiary mb-1 uppercase tracking-widest">AI Insight</h2>
            <p className="font-body-lg text-body-lg text-on-surface">"{aiInsights}"</p>
          </div>
          <button
            onClick={() => navigate('/assessment')}
            className="px-5 py-2 rounded-full border border-tertiary/50 text-tertiary hover:bg-tertiary/10 font-label-md text-label-md transition-colors whitespace-nowrap"
          >
            Take Assessment
          </button>
        </div>
      </section>

      {/* Charts Area */}
      <section aria-label="Emission charts" className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-6">
        {/* Area Chart */}
        <div className="glass-panel rounded-xl p-6 lg:col-span-2 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Emission Trends</h2>
            <label htmlFor="chart-range-select" className="sr-only">Chart time range</label>
            <select
              id="chart-range-select"
              className="bg-surface-container border-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md focus:ring-secondary focus:border-secondary p-2"
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value as '6m' | 'year')}
            >
              <option value="6m">Last 6 Months</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="flex-1 w-full" aria-label="Monthly carbon emission trend chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d3fe32" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d3fe32" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#c1c8c4', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#c1c8c4', fontSize: 11 }} axisLine={false} tickLine={false} unit="t" />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#d3fe32"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={{ fill: '#0c1513', stroke: '#d3fe32', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#d3fe32', stroke: '#0c1513', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="glass-panel rounded-xl p-6 h-[400px] flex flex-col">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Distribution</h2>
          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  aria-label="Carbon emission distribution by category"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, '']}
                  contentStyle={{ background: '#18211f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#dbe5e1' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" aria-hidden="true">
              <div className="font-headline-md text-[22px] text-tertiary">Lvl {ecoLevel}</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant text-center px-2 leading-tight mt-1">{ecoTitle}</div>
            </div>
          </div>
          {/* Legend */}
          <div className="mt-2 space-y-2" role="list" aria-label="Emission categories">
            {donutData.map((item) => (
              <div key={item.name} role="listitem" className="flex items-center justify-between font-label-sm text-label-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }} aria-hidden="true" />
                  <span className="text-on-surface">{item.name}</span>
                </div>
                <span style={{ color: item.color }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity & Challenges Split */}
      <section aria-label="Recent activity and challenges" className="grid grid-cols-1 lg:grid-cols-2 gap-gutter pb-12 mt-6">
        {/* Activity Feed */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Recent Habits</h2>
            <button
              onClick={() => setShowLogModal(true)}
              aria-label="Log a new eco action"
              className="text-primary hover:text-secondary font-label-md text-label-md transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add</span>
              Log New
            </button>
          </div>
          <div className="space-y-4">
            {activityLog.length === 0 ? (
              <p className="text-on-surface-variant font-body-md text-body-md text-center py-8">
                No activities logged yet. Start by logging an action!
              </p>
            ) : (
              activityLog.slice(0, 5).map((a: ActivityEntry) => (
                <div key={a.id} className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-white/5 hover:bg-white/5 transition-colors">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `rgba(${a.color === 'secondary' ? '211,254,50' : a.color === 'tertiary' ? '175,198,255' : '176,205,194'}, 0.2)`,
                      color: a.color === 'secondary' ? '#d3fe32' : a.color === 'tertiary' ? '#afc6ff' : '#b0cdc2',
                    }}
                    aria-hidden="true"
                  >
                    <span className="material-symbols-outlined text-[20px]">{a.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-md text-label-md text-on-surface">{a.label}</p>
                    <p className="font-label-sm text-label-sm text-secondary">Saved {a.saved || 0}kg CO₂</p>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{a.date}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Challenges Teaser */}
        <div className="glass-panel rounded-xl p-6 border-t-[3px] border-t-tertiary">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Active Challenges</h2>
            <span className="material-symbols-outlined text-tertiary" aria-hidden="true">workspace_premium</span>
          </div>
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6 group bg-surface-container-low border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-tertiary/20 to-secondary/10" aria-hidden="true" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">eco</span>
              <h3 className="font-headline-md text-headline-md text-white">Zero-Waste Week</h3>
              {/* Reactive progress bar — no longer uses useStore.getState() */}
              <div className="w-48 bg-surface-container/50 rounded-full h-1.5 mt-2" role="progressbar" aria-valuenow={completedChallenges.length} aria-valuemin={0} aria-valuemax={4} aria-label="Challenge progress">
                <div
                  className="bg-tertiary h-1.5 rounded-full glow-tertiary transition-all"
                  style={{ width: `${challengeProgress}%` }}
                />
              </div>
              <p className="font-label-sm text-label-sm text-white/80 mt-1">
                {completedChallenges.length}/4 challenges completed
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/challenges')}
            className="w-full py-3 rounded-lg border border-outline-variant text-on-surface hover:bg-white/5 font-label-md text-label-md transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">explore</span>
            View All Challenges
          </button>
        </div>
      </section>
    </div>
  );
};
