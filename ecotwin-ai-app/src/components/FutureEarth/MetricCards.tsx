import React from 'react';

export interface ProjectionData {
  year: number;
  bauEmissions: number;
  projectedEmissions: number;
  bauCO2: number;
  projectedCO2: number;
  bauTemp: number;
  projectedTemp: number;
  bauBiodiversity: number;
  projectedBiodiversity: number;
  bauSeaLevel: number;
  projectedSeaLevel: number;
  seaLevelAvoided: number;
}

interface MetricCardsProps {
  currentData: ProjectionData;
}

export const MetricCards: React.FC<MetricCardsProps> = React.memo(({ currentData }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      { label: 'Temp Delta',    value: `${currentData.projectedTemp.toFixed(2)}°C`, bau: `BAU: ${currentData.bauTemp.toFixed(2)}°C`, color: 'border-r-secondary text-secondary' },
      { label: 'Biodiversity',  value: `${currentData.projectedBiodiversity}%`,     bau: `BAU: ${currentData.bauBiodiversity}%`,     color: 'border-r-primary text-primary'     },
      { label: 'Sea Avoided',   value: `${currentData.seaLevelAvoided.toFixed(2)}m`,bau: `Rise BAU: ${currentData.bauSeaLevel.toFixed(2)}m`, color: 'border-r-tertiary text-tertiary'  },
      { label: 'Atmos. CO₂',   value: `${currentData.projectedCO2} ppm`,           bau: `BAU: ${currentData.bauCO2} ppm`,           color: 'border-r-outline-variant text-on-surface' },
    ].map((metric) => (
      <div key={metric.label} className={`glass-panel rounded-xl p-4 flex flex-col border-r-2 ${metric.color.split(' ')[0]} shadow-lg`}>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">{metric.label}</span>
        <div className="flex items-baseline gap-1 mt-2">
          <span className={`font-display-lg text-[28px] md:text-[32px] transition-all leading-none ${metric.color.split(' ')[1]}`}>{metric.value}</span>
        </div>
        <span className="text-[10px] text-on-surface-variant mt-2 block">{metric.bau}</span>
      </div>
    ))}
  </div>
));

MetricCards.displayName = 'MetricCards';
