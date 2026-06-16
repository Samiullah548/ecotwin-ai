import React from 'react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = React.memo(({ active, payload, label }) => {
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
