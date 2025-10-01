import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => (
  <div className="w-full bg-slate-200 rounded-full h-2.5">
    <div
      className="bg-teal-500 h-2.5 rounded-full"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);
