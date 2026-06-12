import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  className?: string;
  delay?: number;
}

export function CircularProgress({
  percentage,
  size = 140,
  strokeWidth = 10,
  color = '#16a34a',
  label,
  className,
  delay = 0,
}: CircularProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 70) return '#16a34a'; // Green for high
    if (percentage >= 40) return '#eab308'; // Yellow for medium
    return '#6b7280'; // Gray for low
  };

  const finalColor = color || getColor();

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={finalColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="progress-ring-circle"
            style={{
              transition: 'stroke-dashoffset 1s ease-out',
            }}
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-2xl font-bold"
            style={{ color: finalColor }}
          >
            {Math.round(animatedPercentage)}%
          </span>
        </div>
      </div>
      {/* Label */}
      <span className="text-sm font-medium text-center text-gray-700 max-w-[140px]">
        {label}
      </span>
    </div>
  );
}
