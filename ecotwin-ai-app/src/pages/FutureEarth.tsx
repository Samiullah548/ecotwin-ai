import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { RangeSlider } from '../components/RangeSlider';
import { MetricCards } from '../components/FutureEarth/MetricCards';
import { ProjectionChart } from '../components/FutureEarth/ProjectionChart';
interface ActionState {
  solar: number;
  wind: number;
  coal: number;
  battery: number;
  ev: number;
  transit: number;
  cycling: number;
  plantBased: number;
  waste: number;
  farming: number;
  reforestation: number;
  mangrove: number;
  wetland: number;
}

const DEFAULT_ACTIONS: ActionState = {
  solar: 0, wind: 0, coal: 0, battery: 0,
  ev: 0, transit: 0, cycling: 0,
  plantBased: 0, waste: 0, farming: 0,
  reforestation: 0, mangrove: 0, wetland: 0,
};

const ACTION_GROUPS = [
  {
    title: 'Energy Transition',
    icon: 'bolt',
    color: 'text-secondary',
    items: [
      { key: 'solar',   label: 'Solar Expansion', desc: 'Deploy massive grid-scale solar farms.'          },
      { key: 'wind',    label: 'Wind Energy',      desc: 'Accelerate offshore and onshore wind turbines.' },
      { key: 'coal',    label: 'Coal Phase-Out',   desc: 'Retire coal-fired power plants globally.'       },
      { key: 'battery', label: 'Battery Storage',  desc: 'Install utility-scale energy storage.'          },
    ],
  },
  {
    title: 'Sustainable Transport',
    icon: 'directions_transit',
    color: 'text-tertiary',
    items: [
      { key: 'ev',      label: 'EV Adoption',         desc: 'Transition fleets and consumer cars to electric.'           },
      { key: 'transit', label: 'Public Transit',       desc: 'Expand metro, zero-emission buses, and light rail.'        },
      { key: 'cycling', label: 'Cycling Infrastructure', desc: 'Construct protected urban bike corridors.'               },
    ],
  },
  {
    title: 'Food & Agriculture',
    icon: 'restaurant',
    color: 'text-primary',
    items: [
      { key: 'plantBased', label: 'Plant-Based Meals',  desc: 'Promote low-carbon, plant-rich diets.'                  },
      { key: 'waste',      label: 'Reduce Food Waste',  desc: 'Optimise supply chain and household waste.'             },
      { key: 'farming',    label: 'Sustainable Farming',desc: 'Scale regenerative and low-nitrogen farming.'           },
    ],
  },
  {
    title: 'Natural Solutions',
    icon: 'forest',
    color: 'text-emerald-400',
    items: [
      { key: 'reforestation', label: 'Reforestation',        desc: 'Restore native forests and stop deforestation.'          },
      { key: 'mangrove',      label: 'Mangrove Restoration', desc: 'Protect and replant vital coastal mangroves.'            },
      { key: 'wetland',       label: 'Wetland Protection',   desc: 'Conserve marshes and peatlands for carbon capture.'      },
    ],
  },
];

const YEARS = [2025, 2030, 2040, 2050] as const;
type ProjectionYear = typeof YEARS[number];

export const FutureEarth: React.FC = () => {
  const { carbonFootprint, emissionBreakdown } = useStore();
  const [actions, setActions] = useState<ActionState>(DEFAULT_ACTIONS);
  const [activeYear, setActiveYear] = useState<ProjectionYear>(2040);
  const [activeTab, setActiveTab] = useState<'co2' | 'temp' | 'biodiversity'>('temp');


  const currentScenario = useMemo(() => {
    const values = Object.values(actions);
    if (values.every((v) => v === 0)) return 'bau';
    if (values.every((v) => v === 40)) return 'moderate';
    if (values.every((v) => v === 90)) return 'netzero';
    return 'custom';
  }, [actions]);

  const handleApplyPreset = (scenario: 'bau' | 'moderate' | 'netzero') => {
    const presetValue = scenario === 'bau' ? 0 : scenario === 'moderate' ? 40 : 90;
    setActions(Object.fromEntries(Object.keys(DEFAULT_ACTIONS).map((k) => [k, presetValue])) as unknown as ActionState);
  };

  const updateActionValue = (key: keyof ActionState, value: number) =>
    setActions((prev) => ({ ...prev, [key]: value }));

  // ─── Performance fix: split into two memos ──────────────────────────────
  // timelineData only recalculates when actions or footprint/breakdown change
  // (not when activeYear changes)
  const timelineData = useMemo(() => {
    const breakdown = emissionBreakdown || { transport: 45, home: 30, diet: 15, lifestyle: 10 };
    const transportBase  = (carbonFootprint * breakdown.transport)  / 100;
    const homeBase       = (carbonFootprint * breakdown.home)       / 100;
    const dietBase       = (carbonFootprint * breakdown.diet)       / 100;
    const lifestyleBase  = (carbonFootprint * breakdown.lifestyle)  / 100;

    const rEnergy    = (actions.solar * 0.25 + actions.wind * 0.20 + actions.coal * 0.35 + actions.battery * 0.20) / 100;
    const rTransport = (actions.ev * 0.40 + actions.transit * 0.40 + actions.cycling * 0.20) / 100;
    const rFood      = (actions.plantBased * 0.50 + actions.waste * 0.30 + actions.farming * 0.20) / 100;
    const rNature    = (actions.reforestation * 0.40 + actions.mangrove * 0.30 + actions.wetland * 0.30) / 100;

    const totalReduction = (transportBase * rTransport) + (homeBase * rEnergy) + (dietBase * rFood) + (lifestyleBase * rNature);
    const rAvg       = (rEnergy + rTransport + rFood + rNature) / 4;
    const rNatureAvg = (actions.reforestation + actions.mangrove + actions.wetland) / 300;

    return {
      timeline: YEARS.map((yr) => {
        let pctRealized = 0;
        if (yr === 2030) pctRealized = 0.3;
        else if (yr === 2040) pctRealized = 0.75;
        else if (yr === 2050) pctRealized = 1.0;

        const scale = yr === 2025 ? 1 : yr === 2030 ? 1.05 : yr === 2040 ? 1.15 : 1.25;
        const bauEmissions    = carbonFootprint * scale;
        const bauCO2          = 420 + (yr - 2025) * (yr <= 2030 ? 3 : 3.2);
        const bauTemp         = 1.2 + (yr - 2025) * 0.044;
        const bauBiodiversity = Math.max(2, 10 - (yr - 2025) * 0.32);
        const bauSeaLevel     = (yr - 2025) * 0.012;

        const projectedEmissions    = Math.max(1.2, bauEmissions - totalReduction * pctRealized);
        const projectedCO2          = 420 + (bauCO2 - 420) * (1 - rAvg * 1.125 * pctRealized);
        const projectedTemp         = 1.2 + (bauTemp - 1.2) * (1 - rAvg * 0.85 * pctRealized);
        const projectedBiodiversity = Math.min(99, bauBiodiversity + rAvg * 38 * pctRealized + rNatureAvg * 40 * pctRealized);
        const projectedSeaLevel     = Math.max(0, bauSeaLevel * (1 - (rNatureAvg * 0.7 + rAvg * 0.3) * pctRealized));

        return {
          year: yr,
          bauEmissions:         parseFloat(bauEmissions.toFixed(1)),
          projectedEmissions:   parseFloat(projectedEmissions.toFixed(1)),
          bauCO2:               Math.round(bauCO2),
          projectedCO2:         Math.round(projectedCO2),
          bauTemp:              parseFloat(bauTemp.toFixed(2)),
          projectedTemp:        parseFloat(projectedTemp.toFixed(2)),
          bauBiodiversity:      Math.round(bauBiodiversity),
          projectedBiodiversity:Math.round(projectedBiodiversity),
          bauSeaLevel:          parseFloat(bauSeaLevel.toFixed(2)),
          projectedSeaLevel:    parseFloat(projectedSeaLevel.toFixed(2)),
          seaLevelAvoided:      parseFloat((bauSeaLevel - projectedSeaLevel).toFixed(2)),
        };
      }),
      rAvg,
      rNatureAvg,
    };
  }, [carbonFootprint, emissionBreakdown, actions]);

  // currentData only recalculates when activeYear or timelineData changes
  const currentData = useMemo(
    () => timelineData.timeline.find((dp) => dp.year === activeYear) ?? timelineData.timeline[2],
    [timelineData.timeline, activeYear],
  );

  // Dynamic AI insights
  const dynamicInsights = useMemo(() => {
    const list: string[] = [];

    if (actions.solar > 60 || actions.wind > 60) {
      list.push(`Renewable energy expansion avoids up to ${(0.4 * (actions.solar + actions.wind) / 200).toFixed(2)}°C of global warming by 2050.`);
    } else {
      list.push('Slow solar and wind grid expansion locks in reliance on backup fossil fuel generation.');
    }

    if (actions.coal > 70) {
      list.push('Rapid coal phase-out eliminates the primary source of industrial carbon emissions.');
    } else {
      list.push('Continued coal operations compromise net-zero timelines, increasing projected 2050 temp.');
    }

    if (actions.reforestation > 60 || actions.mangrove > 60) {
      const bioIncrease = Math.round((actions.reforestation * 0.4 + actions.mangrove * 0.3) * 0.5);
      list.push(`Active reforestation and coastal planting boost biodiversity resilience by +${bioIncrease}%.`);
    } else {
      list.push('Deforestation rates outpace natural replenishment, accelerating species habitat loss.');
    }

    if (actions.plantBased > 50) {
      list.push('Widespread transition to plant-based meals cuts agricultural emissions, conserving regional soils.');
    }

    if (actions.ev > 60 && actions.transit > 60) {
      list.push('Combined EV adoption and public transit expansion cut urban transport pollution in half.');
    }

    return list.slice(0, 3);
  }, [actions]);

  // Chart data derived from timelineData (not activeYear — avoids unnecessary recalc)
  const chartData = useMemo(() =>
    timelineData.timeline.map((item) => {
      const entry =
        activeTab === 'co2'
          ? { Projected: item.projectedCO2, BAU: item.bauCO2, unit: ' ppm' }
          : activeTab === 'temp'
          ? { Projected: item.projectedTemp, BAU: item.bauTemp, unit: ' °C' }
          : { Projected: item.projectedBiodiversity, BAU: item.bauBiodiversity, unit: '%' };

      return { year: item.year, Projected: entry.Projected, 'Business As Usual': entry.BAU, unit: entry.unit };
    }),
    [timelineData.timeline, activeTab],
  );

  return (
    <div className="max-w-container-max mx-auto space-y-gutter w-full min-h-full flex flex-col" id="future-earth-page">

      {/* Header */}
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-secondary mb-2">
            <span className="material-symbols-outlined" aria-hidden="true">public</span>
            <span className="font-label-md text-label-md tracking-wider uppercase">Global Projections</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Future Earth Simulator
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
            Model how your sustainability decisions, scaled to a community level, directly impact global climate metrics.
          </p>
        </div>

        {/* Scenario Preset Selector */}
        <div
          className="bg-surface-container-low border border-white/10 rounded-xl p-2 flex items-center gap-1 w-fit"
          role="group"
          aria-label="Select scenario preset"
        >
          {([
            { id: 'bau',      label: 'Business As Usual', activeClass: 'bg-error/20 text-error border border-error/20' },
            { id: 'moderate', label: 'Moderate Action',   activeClass: 'bg-tertiary/20 text-tertiary border border-tertiary/20' },
            { id: 'netzero',  label: 'Net Zero 2050',     activeClass: 'bg-secondary/20 text-secondary border border-secondary/20 shadow-[0_0_12px_rgba(211,254,50,0.2)]' },
          ] as const).map((s) => (
            <button
              key={s.id}
              onClick={() => handleApplyPreset(s.id)}
              aria-pressed={currentScenario === s.id}
              className={`px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all ${
                currentScenario === s.id ? s.activeClass : 'text-on-surface-variant hover:text-on-surface border border-transparent'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1 h-full min-h-[600px]">

        {/* Left Column: Simulation Controls */}
        <section className="lg:col-span-5 flex flex-col gap-6" aria-label="Simulation control sliders">
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="material-symbols-outlined text-secondary" aria-hidden="true">tune</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Simulation Controls</h2>
              {currentScenario === 'custom' && (
                <span className="bg-white/5 border border-white/10 text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full ml-auto uppercase tracking-wider">
                  Custom Config
                </span>
              )}
            </div>

            <div className="space-y-6 max-h-[650px] overflow-y-auto pr-2 no-scrollbar">
              {ACTION_GROUPS.map((group) => (
                <div key={group.title} className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className={`material-symbols-outlined ${group.color}`} aria-hidden="true">{group.icon}</span>
                    <h3 className="font-label-md text-label-md font-semibold text-on-surface">{group.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {group.items.map((action) => {
                      const progressValue = actions[action.key as keyof ActionState];
                      const sliderId = `slider-${action.key}`;
                      return (
                        <div key={action.key} className="space-y-2">
                          <RangeSlider
                            id={sliderId}
                            label={action.label}
                            description={action.desc}
                            min={0}
                            max={100}
                            value={progressValue}
                            onChange={(v) => updateActionValue(action.key as keyof ActionState, v)}
                            unit="%"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Metrics & Charts */}
        <section className="lg:col-span-7 flex flex-col gap-6" aria-label="Simulation metrics and charts">

          {/* Year Selector */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              Projection Target Timeline
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-2 font-label-md text-label-md font-bold" role="group" aria-label="Select projection year">
                {YEARS.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setActiveYear(yr)}
                    aria-pressed={activeYear === yr}
                    className={`transition-all ${activeYear === yr ? 'text-secondary bg-secondary/10 px-4 py-1 rounded-full shadow-[0_0_12px_rgba(211,254,50,0.3)] border border-secondary/20' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
              <div className="relative w-full h-2 bg-surface-dim rounded-full mt-2 overflow-hidden border border-white/5" aria-hidden="true">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-tertiary to-secondary transition-all duration-300"
                  style={{ width: `${((activeYear - 2025) / 25) * 100}%` }}
                />
                <input
                  type="range"
                  min={2025}
                  max={2050}
                  step={5}
                  value={activeYear}
                  aria-label="Projection year"
                  aria-valuemin={2025}
                  aria-valuemax={2050}
                  aria-valuenow={activeYear}
                  aria-valuetext={`${activeYear}`}
                  onChange={(e) => {
                    const yearVal = parseInt(e.target.value);
                    const snapped = YEARS.reduce((prev, curr) =>
                      Math.abs(curr - yearVal) < Math.abs(prev - yearVal) ? curr : prev,
                    );
                    setActiveYear(snapped);
                  }}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <MetricCards currentData={currentData} />

          {/* Chart */}
          <ProjectionChart chartData={chartData} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-tertiary/10 rounded-full blur-2xl group-hover:bg-tertiary/20 transition-all" aria-hidden="true" />
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">auto_awesome</span>
              <h3 className="font-label-md text-label-md text-tertiary tracking-widest uppercase">AI Simulation Analysis</h3>
            </div>
            <div className="space-y-3 relative z-10" aria-live="polite" aria-atomic="false">
              {dynamicInsights.map((insight, idx) => (
                <div key={idx} className="flex gap-3 items-start border-l-2 border-tertiary/40 pl-3">
                  <p className="font-body-md text-body-md text-on-surface leading-snug">"{insight}"</p>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </div>
  );
};
