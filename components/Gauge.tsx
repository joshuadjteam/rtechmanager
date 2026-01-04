
import React from 'react';

interface GaugeProps {
  percentage: number;
  label: string;
  sublabelText: string;
}

export const Gauge: React.FC<GaugeProps> = ({ percentage, label, sublabelText }) => {
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[180px] h-[180px]">
        {/* Background Track */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-zinc-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress Bar */}
          <circle
            className={`${percentage > 90 ? 'text-red-500' : 'text-green-500'} transition-all duration-1000 ease-in-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{label}</h4>
        <p className="text-xs font-mono text-zinc-400 mt-1">{sublabelText}</p>
      </div>
    </div>
  );
};
