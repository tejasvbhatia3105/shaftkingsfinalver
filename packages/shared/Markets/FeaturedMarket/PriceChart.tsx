'use client';

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import type { MarketPrice, Activity } from '@/types/market';
import { JetBrainsMonoFont, OrbitronFont } from '@/utils/fonts';
import socket from '@/utils/socket';

type PriceChartProps = {
  hypePrice: number;
  flopPrice: number;
  yesSideName: string;
  noSideName: string;
  priceHistory?: MarketPrice[];
  marketEndTime?: number; // Unix timestamp in ms
  formattedDate?: string;
  formattedTime?: string;
  marketId?: string; // For subscribing to live trades
};

type LiveTrade = {
  id: string;
  amount: number;
  timestamp: number;
};

type HoverData = {
  x: number;
  pixelX: number; // Actual pixel position relative to chart container
  hypeValue: number;
  flopValue: number;
  timestamp: Date;
  hypeY: number;
  flopY: number;
} | null;

// Simple countdown timer component with DD:HH:MM:SS format
const SimpleCountdown = ({ target, className }: { target: number; className?: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const endDate = target * 1000;
      const diff = Math.max(0, endDate - now);
      
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, [target]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <span className={className}>
      {pad(timeLeft.days)}:{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
    </span>
  );
};

const PriceChart: React.FC<PriceChartProps> = ({ 
  hypePrice, 
  flopPrice, 
  yesSideName, 
  noSideName,
  priceHistory = [],
  marketEndTime = 0,
  formattedDate = '',
  formattedTime = '',
  marketId = '',
}) => {
  const [hoverData, setHoverData] = useState<HoverData>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [liveTrades, setLiveTrades] = useState<LiveTrade[]>([]);

  // Subscribe to live trade activity
  useEffect(() => {
    if (!marketId) return;

    const channel = `ACTIVITY_EVENT_${marketId}`;

    const handleActivity = (event: Activity) => {
      // Calculate trade amount in dollars
      const shares = Number(event.shares) / 1_000_000;
      const price = Number(event.price) / 1_000_000;
      const amount = Math.round(shares * price);
      
      if (amount > 0) {
        const newTrade: LiveTrade = {
          id: event.id || `${Date.now()}-${Math.random()}`,
          amount,
          timestamp: Date.now(),
        };

        setLiveTrades(prev => {
          // Keep only last 8 trades, add new one at the beginning
          const updated = [newTrade, ...prev].slice(0, 8);
          return updated;
        });

        // Remove the trade after animation (5 seconds)
        setTimeout(() => {
          setLiveTrades(prev => prev.filter(t => t.id !== newTrade.id));
        }, 5000);
      }
    };

    socket.off(channel);
    socket.on(channel, handleActivity);

    return () => {
      socket.off(channel);
    };
  }, [marketId]);

  // Use real price history if available (need at least 2 points for a line), otherwise generate mock data
  const chartData = useMemo(() => {
    if (priceHistory.length >= 2) {
      const hypeData: number[] = [];
      const flopData: number[] = [];
      const timestamps: Date[] = [];
      
      const sorted = [...priceHistory].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      const sampleRate = Math.max(1, Math.floor(sorted.length / 30));
      const sampled = sorted.filter((_, i) => i % sampleRate === 0);
      
      // Ensure we have at least 2 sampled points
      if (sampled.length < 2) {
        sampled.push(sorted[sorted.length - 1]);
      }
      
      sampled.forEach((price) => {
        const hype = Number(price.hypePrice) / 1_000_000;
        const flop = Number(price.flopPrice) / 1_000_000;
        
        hypeData.push(Math.max(0.01, Math.min(0.99, hype || 0.5)));
        flopData.push(Math.max(0.01, Math.min(0.99, flop || 0.5)));
        timestamps.push(new Date(price.timestamp));
      });
      
      // Verify we have valid data
      if (hypeData.length >= 2 && flopData.length >= 2) {
        return { hypeData, flopData, timestamps };
      }
    }
    
    // Fallback: Generate mock historical data (always generates 20 points)
    console.log('Using mock chart data - priceHistory had', priceHistory.length, 'points');
    const points = 20;
    const hypeData: number[] = [];
    const flopData: number[] = [];
    const timestamps: Date[] = [];
    
    const now = new Date();
    for (let i = 0; i < points; i++) {
      const monthsBack = 8 - (i / (points - 1)) * 8;
      timestamps.push(subMonths(now, monthsBack));
    }
    
    let hype = 0.35;
    let flop = 0.65;
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const targetHype = hypePrice;
      const targetFlop = flopPrice;
      
      const noise = Math.sin(i * 1.5) * 0.08 * (1 - progress);
      
      hype = hype + (targetHype - hype) * 0.12 + noise;
      flop = flop + (targetFlop - flop) * 0.12 - noise;
      
      hype = Math.max(0.05, Math.min(0.95, hype));
      flop = Math.max(0.05, Math.min(0.95, flop));
      
      hypeData.push(hype);
      flopData.push(flop);
    }
    
    return { hypeData, flopData, timestamps };
  }, [hypePrice, flopPrice, priceHistory]);

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'];

  const width = 400;
  const height = 200;
  const paddingLeft = 10;
  const paddingRight = 80; // More space for labels on right
  const paddingTop = 20;
  const paddingBottom = 20;

  // Label height (name + percentage + spacing)
  const labelHeight = 45;
  const minLabelSpacing = 10;

  // Get Y position for a value (0-1 range to SVG coordinates)
  const getY = useCallback((value: number) => {
    return paddingTop + (1 - value) * (height - paddingTop - paddingBottom);
  }, []);

  // Calculate adjusted label positions to prevent overlap and stay in bounds
  const getAdjustedLabelPositions = useCallback((hypeY: number, flopY: number) => {
    const minY = paddingTop + 15; // Top bound
    const maxY = height - paddingBottom - 10; // Bottom bound
    
    let adjustedHypeY = hypeY;
    let adjustedFlopY = flopY;
    
    // Calculate the distance between labels
    const distance = Math.abs(adjustedHypeY - adjustedFlopY);
    const minDistance = labelHeight + minLabelSpacing;
    
    // If labels would overlap, push them apart
    if (distance < minDistance) {
      const midPoint = (adjustedHypeY + adjustedFlopY) / 2;
      const halfMinDistance = minDistance / 2;
      
      if (adjustedHypeY < adjustedFlopY) {
        // Hype is above flop
        adjustedHypeY = midPoint - halfMinDistance;
        adjustedFlopY = midPoint + halfMinDistance;
      } else {
        // Flop is above hype
        adjustedFlopY = midPoint - halfMinDistance;
        adjustedHypeY = midPoint + halfMinDistance;
      }
    }
    
    // Clamp to bounds
    adjustedHypeY = Math.max(minY, Math.min(maxY, adjustedHypeY));
    adjustedFlopY = Math.max(minY, Math.min(maxY, adjustedFlopY));
    
    // After clamping, check again for overlap and adjust
    const newDistance = Math.abs(adjustedHypeY - adjustedFlopY);
    if (newDistance < minDistance) {
      if (adjustedHypeY < adjustedFlopY) {
        adjustedFlopY = Math.min(maxY, adjustedHypeY + minDistance);
      } else {
        adjustedHypeY = Math.min(maxY, adjustedFlopY + minDistance);
      }
    }
    
    return { adjustedHypeY, adjustedFlopY };
  }, []);

  // Get X position for an index
  const getX = useCallback((index: number, total: number) => {
    if (total <= 1) return paddingLeft + (width - paddingLeft - paddingRight) / 2;
    return paddingLeft + (index / (total - 1)) * (width - paddingLeft - paddingRight);
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current || chartData.hypeData.length === 0) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const chartWidth = rect.width;
    
    if (chartWidth === 0) return;
    
    // Map mouse position directly to SVG viewBox coordinates
    // This ensures the line appears exactly under the cursor
    const svgX = (relativeX / chartWidth) * width;
    
    // Clamp to the drawable area (between padding)
    const clampedSvgX = Math.max(paddingLeft, Math.min(width - paddingRight, svgX));
    
    // Calculate normalized position within the data area for finding data points
    const dataAreaWidth = width - paddingLeft - paddingRight;
    const normalizedDataX = Math.max(0, Math.min(1, (clampedSvgX - paddingLeft) / dataAreaWidth));
    
    // Find the nearest data point for values/timestamp
    const dataLength = chartData.hypeData.length;
    const dataIndex = Math.round(normalizedDataX * (dataLength - 1));
    const clampedIndex = Math.max(0, Math.min(dataLength - 1, dataIndex));
    
    const hypeValue = chartData.hypeData[clampedIndex];
    const flopValue = chartData.flopData[clampedIndex];
    
    // Guard against undefined values
    if (hypeValue === undefined || flopValue === undefined || !chartData.timestamps[clampedIndex]) {
      return;
    }
    
    // Interpolate Y positions based on cursor position for smoother line following
    const exactIndex = normalizedDataX * (dataLength - 1);
    const lowerIndex = Math.floor(exactIndex);
    const upperIndex = Math.min(lowerIndex + 1, dataLength - 1);
    const fraction = exactIndex - lowerIndex;
    
    const interpolatedHype = chartData.hypeData[lowerIndex] + 
      (chartData.hypeData[upperIndex] - chartData.hypeData[lowerIndex]) * fraction;
    const interpolatedFlop = chartData.flopData[lowerIndex] + 
      (chartData.flopData[upperIndex] - chartData.flopData[lowerIndex]) * fraction;
    
    setHoverData({
      x: clampedSvgX,
      pixelX: relativeX,
      hypeValue,
      flopValue,
      timestamp: chartData.timestamps[clampedIndex],
      hypeY: getY(interpolatedHype),
      flopY: getY(interpolatedFlop),
    });
  }, [chartData, getY]);

  const handleMouseLeave = useCallback(() => {
    setHoverData(null);
  }, []);

  // Get the hover index for splitting the line (returns fractional index for more precise dimming)
  const getHoverIndex = useCallback(() => {
    if (!hoverData) return -1;
    const normalizedX = (hoverData.x - paddingLeft) / (width - paddingLeft - paddingRight);
    // Return the exact fractional index for precise splitting
    return normalizedX * (chartData.hypeData.length - 1);
  }, [hoverData, chartData.hypeData.length]);

  // Convert data to SVG path with dimming after hover point
  const createPathWithDim = (data: number[], color: string) => {
    const hoverIndex = getHoverIndex();
    
    const allPoints = data.map((value, index) => {
      const x = getX(index, data.length);
      const y = getY(value);
      return `${x},${y}`;
    });
    
    if (hoverIndex === -1 || !hoverData) {
      return (
        <polyline
          points={allPoints.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }
    
    // Calculate the exact hover point position (interpolated)
    const lowerIdx = Math.floor(hoverIndex);
    const upperIdx = Math.min(lowerIdx + 1, data.length - 1);
    const fraction = hoverIndex - lowerIdx;
    
    // Interpolate the value at the exact hover position
    const interpolatedValue = data[lowerIdx] + (data[upperIdx] - data[lowerIdx]) * fraction;
    const hoverX = hoverData.x;
    const hoverY = getY(interpolatedValue);
    const hoverPoint = `${hoverX},${hoverY}`;
    
    const beforePoints: string[] = [];
    const afterPoints: string[] = [];
    
    // Add points before the hover position
    data.forEach((value, index) => {
      if (index <= lowerIdx) {
        const x = getX(index, data.length);
        const y = getY(value);
        beforePoints.push(`${x},${y}`);
      }
    });
    
    // Add the interpolated hover point to both segments
    beforePoints.push(hoverPoint);
    afterPoints.push(hoverPoint);
    
    // Add points after the hover position
    data.forEach((value, index) => {
      if (index > lowerIdx) {
        const x = getX(index, data.length);
        const y = getY(value);
        afterPoints.push(`${x},${y}`);
      }
    });
    
    return (
      <>
        <polyline
          points={beforePoints.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={afterPoints.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
      </>
    );
  };

  // Right side percentage labels
  const rightLabels = ['70', '60', '50', '40', '30', '20'];

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Date / Timer / Time Row - part of chart */}
      {marketEndTime > 0 && (
        <div className="flex items-center justify-center gap-8 mb-3">
          <span className="text-white/50 text-xs tracking-[0.2em] uppercase">{formattedDate}</span>
          
          {/* Timer - compact yellow box */}
          <div 
            className={`bg-[#F7B519] rounded px-4 py-1.5 ${OrbitronFont.className}`}
            style={{
              boxShadow: '0 0 15px rgba(247, 181, 25, 0.5)'
            }}
          >
            <SimpleCountdown
              target={marketEndTime / 1000}
              className="text-black text-base font-bold tracking-[0.08em]"
            />
          </div>
          
          <span className="text-white/50 text-xs tracking-[0.2em] uppercase">{formattedTime}</span>
        </div>
      )}

      <div className="flex flex-1">
        {/* Left side - Live trade notifications */}
        <div className="relative w-[60px] pr-2 py-1 overflow-hidden">
          <div className="absolute inset-0 flex flex-col-reverse justify-start gap-1 overflow-hidden">
            {liveTrades.map((trade, index) => (
              <div
                key={trade.id}
                className="text-[#2dd4bf] text-[11px] font-mono tracking-tight animate-slide-up-fade"
                style={{
                  animation: 'slideUpFade 5s ease-out forwards',
                  opacity: 1 - (index * 0.1),
                }}
              >
                +${trade.amount}
              </div>
            ))}
          </div>
          <style jsx>{`
            @keyframes slideUpFade {
              0% {
                transform: translateY(20px);
                opacity: 0;
              }
              10% {
                transform: translateY(0);
                opacity: 1;
              }
              80% {
                transform: translateY(-10px);
                opacity: 0.7;
              }
              100% {
                transform: translateY(-30px);
                opacity: 0;
              }
            }
          `}</style>
        </div>
        
        {/* Chart Area */}
        <div 
          ref={chartRef}
          className="flex-1 relative cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Timestamp at top when hovering - positioned using pixel coordinates */}
          {hoverData && (
            <div 
              className="absolute text-white/80 text-[11px] font-mono tracking-wide pointer-events-none whitespace-nowrap z-30"
              style={{
                left: `${hoverData.pixelX}px`,
                top: '-20px',
                transform: 'translateX(-50%)',
              }}
            >
              {format(hoverData.timestamp, 'MMM d, yyyy h:mma').toUpperCase()}
            </div>
          )}
          <svg 
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Dotted vertical grid lines */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line
                key={`v-${i}`}
                x1={paddingLeft + (i / 7) * (width - paddingLeft - paddingRight)}
                y1={paddingTop}
                x2={paddingLeft + (i / 7) * (width - paddingLeft - paddingRight)}
                y2={height - paddingBottom}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="2,6"
              />
            ))}

            {/* Horizontal grid lines */}
            {rightLabels.map((_, i) => {
              const y = paddingTop + (i / (rightLabels.length - 1)) * (height - paddingTop - paddingBottom);
              return (
                <line
                  key={`h-${i}`}
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="2,6"
                />
              );
            })}
            
            {/* Hype line (red) */}
            {createPathWithDim(chartData.hypeData, '#ef4444')}
            
            {/* Flop line (blue) */}
            {createPathWithDim(chartData.flopData, '#60a5fa')}

            {/* Hover vertical line */}
            {hoverData && !isNaN(hoverData.x) && !isNaN(hoverData.hypeY) && !isNaN(hoverData.flopY) && (
              <>
                <line
                  x1={hoverData.x}
                  y1={paddingTop}
                  x2={hoverData.x}
                  y2={height - paddingBottom}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1"
                />
                
                {/* Hype dot */}
                <circle
                  cx={hoverData.x}
                  cy={hoverData.hypeY}
                  r="4"
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth="2"
                />
                
                {/* Flop dot */}
                <circle
                  cx={hoverData.x}
                  cy={hoverData.flopY}
                  r="4"
                  fill="#60a5fa"
                  stroke="white"
                  strokeWidth="2"
                />
              </>
            )}

            {/* Right side dynamic labels - positioned with anti-overlap logic */}
            {hoverData && (() => {
              const { adjustedHypeY, adjustedFlopY } = getAdjustedLabelPositions(hoverData.hypeY, hoverData.flopY);
              return (
                <g className={JetBrainsMonoFont.className}>
                  {/* Hype label - right side */}
                  <text
                    x={width - paddingRight + 8}
                    y={adjustedHypeY - 14}
                    fill="#ef4444"
                    fontSize="10"
                    fontWeight="400"
                    textAnchor="start"
                  >
                    {yesSideName.toUpperCase()}
                  </text>
                  <text
                    x={width - paddingRight + 8}
                    y={adjustedHypeY + 6}
                    fill="#ef4444"
                    fontSize="20"
                    fontWeight="400"
                    textAnchor="start"
                  >
                    {Math.round(hoverData.hypeValue * 100)}%
                  </text>

                  {/* Flop label - right side */}
                  <text
                    x={width - paddingRight + 8}
                    y={adjustedFlopY - 14}
                    fill="#60a5fa"
                    fontSize="10"
                    fontWeight="400"
                    textAnchor="start"
                  >
                    {noSideName.toUpperCase()}
                  </text>
                  <text
                    x={width - paddingRight + 8}
                    y={adjustedFlopY + 6}
                    fill="#60a5fa"
                    fontSize="20"
                    fontWeight="400"
                    textAnchor="start"
                  >
                    {Math.round(hoverData.flopValue * 100)}%
                  </text>
                </g>
              );
            })()}

            {/* Static right side labels when NOT hovering */}
            {!hoverData && (() => {
              const { adjustedHypeY, adjustedFlopY } = getAdjustedLabelPositions(getY(hypePrice), getY(flopPrice));
              return (
                <g className={JetBrainsMonoFont.className}>
                  {/* Current hype price label */}
                  <text
                    x={width - paddingRight + 8}
                    y={adjustedHypeY - 14}
                    fill="#ef4444"
                    fontSize="10"
                    fontWeight="400"
                    textAnchor="start"
                  >
                    {yesSideName.toUpperCase()}
                  </text>
                  <text
                    x={width - paddingRight + 8}
                    y={adjustedHypeY + 6}
                    fill="#ef4444"
                    fontSize="20"
                    fontWeight="400"
                    textAnchor="start"
                  >
                    {Math.round(hypePrice * 100)}%
                  </text>

                  {/* Current flop price label */}
                  <text
                    x={width - paddingRight + 8}
                    y={adjustedFlopY - 14}
                    fill="#60a5fa"
                    fontSize="10"
                    fontWeight="400"
                    textAnchor="start"
                  >
                    {noSideName.toUpperCase()}
                  </text>
                  <text
                    x={width - paddingRight + 8}
                    y={adjustedFlopY + 6}
                    fill="#60a5fa"
                    fontSize="20"
                    fontWeight="400"
                    textAnchor="start"
                  >
                    {Math.round(flopPrice * 100)}%
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* Right side Y-axis numeric labels */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-white/25 text-[10px] py-1 pr-1 font-mono">
            {rightLabels.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* X-axis month labels */}
      <div className="flex justify-between text-white/35 text-[10px] pt-2 pl-10 pr-20 uppercase tracking-widest font-medium">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
};

export default PriceChart;
