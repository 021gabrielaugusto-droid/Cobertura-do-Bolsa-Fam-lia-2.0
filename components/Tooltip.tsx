
import React from 'react';
import type { TooltipData } from '../types';

interface TooltipProps {
  data: TooltipData;
}

export const Tooltip: React.FC<TooltipProps> = ({ data }) => {
  const { x, y, name, value, beneficiariesAccompanied, beneficiariesToAccompany } = data;
  const numberFormatter = new Intl.NumberFormat('pt-BR');

  return (
    <div
      className="absolute bg-slate-800 text-white text-sm rounded-md px-3 py-2 pointer-events-none shadow-lg transform -translate-x-1/2 -translate-y-full -mt-2 transition-opacity duration-200"
      style={{ left: x, top: y }}
      role="tooltip"
    >
      <div className="font-bold">{name}</div>
      <div>Cobertura: <span className="font-semibold">{value}</span></div>
      {beneficiariesToAccompany > 0 && (
         <div className="text-slate-300 text-xs mt-1 border-t border-slate-600 pt-1">
              Beneficiários: {numberFormatter.format(beneficiariesAccompanied)} / {numberFormatter.format(beneficiariesToAccompany)}
          </div>
      )}
    </div>
  );
};
