import React from 'react';
import * as d3 from 'd3';

interface LegendProps {
  colorScale: d3.ScaleThreshold<number, string>;
}

export const Legend: React.FC<LegendProps> = ({ colorScale }) => {
  const colors = colorScale.range();
  
  const labels = [
    "50% - 60%",
    "61% - 70%",
    "71% - 80%",
    "81% - 90%",
    "91% - 100%",
  ];

  const legendItems = colors.map((color, i) => ({
    color,
    label: labels[i],
  }));

  return (
    <div className="absolute bottom-2 right-2 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-md border border-slate-200">
      <h4 className="text-sm font-bold text-slate-700 mb-2">Cobertura (%)</h4>
      <div className="flex flex-col space-y-1">
        {legendItems.map(item => (
          <div key={item.color} className="flex items-center space-x-2">
            <div
              className="w-5 h-5 rounded"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-xs text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};