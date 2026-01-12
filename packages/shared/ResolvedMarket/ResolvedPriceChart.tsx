'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { JetBrainsMonoFont } from '@/utils/fonts';

type PricePoint = {
  timestamp: Date;
  leftPrice: number;
  rightPrice: number;
};

type Props = {
  priceHistory: PricePoint[];
  leftName: string;
  rightName: string;
};

const ResolvedPriceChart = ({ priceHistory, leftName, rightName }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<{
    x: number;
    timestamp: Date;
    leftPrice: number;
    rightPrice: number;
  } | null>(null);

  // Chart dimensions
  const width = 800;
  const height = 350;
  const paddingLeft = 50;
  const paddingRight = 80;
  const paddingTop = 40;
  const paddingBottom = 50;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Scale functions
  const getX = useCallback((index: number, total: number) => {
    if (total <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (total - 1)) * chartWidth;
  }, [chartWidth]);

  const getY = useCallback((value: number) => {
    // Y axis: 0% at bottom, 100% at top
    return paddingTop + chartHeight - (value * chartHeight);
  }, [chartHeight]);

  // Generate paths
  const { leftPath, rightPath } = useMemo(() => {
    if (priceHistory.length < 2) return { leftPath: '', rightPath: '' };

    const leftPoints = priceHistory.map((p, i) => 
      `${getX(i, priceHistory.length)},${getY(p.leftPrice)}`
    ).join(' ');

    const rightPoints = priceHistory.map((p, i) => 
      `${getX(i, priceHistory.length)},${getY(p.rightPrice)}`
    ).join(' ');

    return {
      leftPath: `M ${leftPoints.replace(' ', ' L ')}`,
      rightPath: `M ${rightPoints.replace(' ', ' L ')}`,
    };
  }, [priceHistory, getX, getY]);

  // Y-axis labels
  const yAxisLabels = [0, 25, 50, 75, 100];

  // X-axis labels (dates)
  const xAxisLabels = useMemo(() => {
    if (priceHistory.length === 0) return [];
    const labels: { label: string; x: number }[] = [];
    const step = Math.max(1, Math.floor(priceHistory.length / 5));
    
    for (let i = 0; i < priceHistory.length; i += step) {
      labels.push({
        label: format(priceHistory[i].timestamp, 'MMM d'),
        x: getX(i, priceHistory.length),
      });
    }
    
    // Always include last point
    if (labels.length > 0) {
      const lastIdx = priceHistory.length - 1;
      labels.push({
        label: format(priceHistory[lastIdx].timestamp, 'MMM d'),
        x: getX(lastIdx, priceHistory.length),
      });
    }
    
    return labels;
  }, [priceHistory, getX]);

  // Handle mouse move for hover
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current || priceHistory.length < 2) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgX = (mouseX / rect.width) * width;

    // Find closest data point
    let closestIdx = 0;
    let closestDist = Infinity;

    priceHistory.forEach((_, i) => {
      const x = getX(i, priceHistory.length);
      const dist = Math.abs(x - svgX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    const point = priceHistory[closestIdx];
    setHoverData({
      x: getX(closestIdx, priceHistory.length),
      timestamp: point.timestamp,
      leftPrice: point.leftPrice,
      rightPrice: point.rightPrice,
    });
  }, [priceHistory, getX, width]);

  const handleMouseLeave = useCallback(() => {
    setHoverData(null);
  }, []);

  if (priceHistory.length < 2) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        Not enough data to display chart
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid lines */}
        {yAxisLabels.map((label) => (
          <line
            key={label}
            x1={paddingLeft}
            y1={getY(label / 100)}
            x2={width - paddingRight}
            y2={getY(label / 100)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels */}
        {yAxisLabels.map((label) => (
          <text
            key={label}
            x={paddingLeft - 10}
            y={getY(label / 100)}
            fill="rgba(255,255,255,0.4)"
            fontSize="12"
            textAnchor="end"
            dominantBaseline="middle"
            className={JetBrainsMonoFont.className}
          >
            {label}%
          </text>
        ))}

        {/* X-axis labels */}
        {xAxisLabels.map((item, i) => (
          <text
            key={i}
            x={item.x}
            y={height - paddingBottom + 25}
            fill="rgba(255,255,255,0.4)"
            fontSize="11"
            textAnchor="middle"
            className={JetBrainsMonoFont.className}
          >
            {item.label}
          </text>
        ))}

        {/* Left competitor line (blue) - Asher */}
        <polyline
          points={priceHistory.map((p, i) => 
            `${getX(i, priceHistory.length)},${getY(p.leftPrice)}`
          ).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right competitor line (red) - Tristan */}
        <polyline
          points={priceHistory.map((p, i) => 
            `${getX(i, priceHistory.length)},${getY(p.rightPrice)}`
          ).join(' ')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover elements */}
        {hoverData && (
          <>
            {/* Vertical line */}
            <line
              x1={hoverData.x}
              y1={paddingTop}
              x2={hoverData.x}
              y2={height - paddingBottom}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Left price dot */}
            <circle
              cx={hoverData.x}
              cy={getY(hoverData.leftPrice)}
              r="5"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />

            {/* Right price dot */}
            <circle
              cx={hoverData.x}
              cy={getY(hoverData.rightPrice)}
              r="5"
              fill="#ef4444"
              stroke="white"
              strokeWidth="2"
            />

            {/* Timestamp label */}
            <rect
              x={hoverData.x - 60}
              y={paddingTop - 30}
              width="120"
              height="24"
              rx="4"
              fill="#F7B519"
            />
            <text
              x={hoverData.x}
              y={paddingTop - 14}
              fill="black"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
              className={JetBrainsMonoFont.className}
            >
              {format(hoverData.timestamp, 'MMM d, h:mma')}
            </text>
          </>
        )}

        {/* Legend */}
        <g transform={`translate(${width - paddingRight + 10}, ${paddingTop + 20})`}>
          {/* Left competitor */}
          <circle cx="8" cy="0" r="5" fill="#3b82f6" />
          <text x="20" y="4" fill="#3b82f6" fontSize="12" className={JetBrainsMonoFont.className}>
            {leftName}
          </text>
          {hoverData && (
            <text x="20" y="18" fill="#3b82f6" fontSize="14" fontWeight="bold" className={JetBrainsMonoFont.className}>
              {Math.round(hoverData.leftPrice * 100)}%
            </text>
          )}

          {/* Right competitor */}
          <circle cx="8" cy="50" r="5" fill="#ef4444" />
          <text x="20" y="54" fill="#ef4444" fontSize="12" className={JetBrainsMonoFont.className}>
            {rightName}
          </text>
          {hoverData && (
            <text x="20" y="68" fill="#ef4444" fontSize="14" fontWeight="bold" className={JetBrainsMonoFont.className}>
              {Math.round(hoverData.rightPrice * 100)}%
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};

export default ResolvedPriceChart;

