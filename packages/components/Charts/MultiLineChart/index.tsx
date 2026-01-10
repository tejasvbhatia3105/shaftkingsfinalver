import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';
import { useRef, useState, useEffect, useMemo } from 'react';
import type { NavigatorOptions } from 'highcharts/highstock';
import Highcharts from 'highcharts/highstock';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import { useTheme } from 'next-themes';
import type { MarketPrice, MainMarket } from '@/types/market';
import { getLegendColor } from '@/utils/getLegendColor';
import { cn } from '@/utils/cn';

interface Navigator extends NavigatorOptions {
  top?: number;
}
interface ChartOptions extends Highcharts.Options {
  navigator?: Navigator;
}

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
  HighchartsExportData(Highcharts);
  OfflineExporting(Highcharts);
}

interface MultiLineChartProps {
  data: MarketPrice[][];
  mainMarket: MainMarket;
}

const MultiLineChart = ({ data, mainMarket }: MultiLineChartProps) => {
  const { theme } = useTheme();
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [showSubgraph, setShowSubgraph] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        type: 'spline',
        height: 330,
        backgroundColor: 'transparent',
      },
      boost: {
        enabled: true,
        useGPUTranslations: true,
      },
      exporting: {
        fallbackToExportServer: false,
        enabled: false,
        buttons: {
          contextButton: {
            symbolSize: 20,
            symbolStroke: '#fff',
            symbolFill: 'transparent',
            verticalAlign: 'bottom',
            theme: {
              fill: 'transparent',
              padding: 15,
            },
            states: {
              hover: {
                enabled: false,
              },
              select: {
                fill: 'transparent',
                enabled: false,
              },
            },
            menuItems: ['subgraph', 'grid', 'downloadPDF', 'downloadPNG'],
          },
        },
      },
      exportData: {
        enabled: false,
      },
      navigator: {
        top: 250,
        enabled: showSubgraph,
        height: 50,
        outlineColor: 'transparent',
        maskFill: 'transparent',
        xAxis: {
          labels: {
            enabled: false,
          },
          tickLength: 0,
          lineColor: 'transparent',
          gridLineWidth: 0,
        },
        handles: {
          enabled: false,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        series: {
          color: theme === 'dark' ? '#fff' : '#000',
          opacity: 0.05,
          fillColor: theme === 'dark' ? '#fff' : '#000',
          fillOpacity: 0.05,
        },
      },
      scrollbar: {
        enabled: false,
      },
      rangeSelector: {
        enabled: false,
      },

      title: {
        text: '',
      },

      credits: {
        enabled: false,
      },

      xAxis: {
        type: 'datetime',
        labels: {
          format: '{value:%b %d}',
          style: {
            color: '#888',
          },
          enabled: false,
        },
        tickLength: 0,
        lineColor: '#eaeaea',
        lineWidth: 0,
        plotLines: [],
        gridLineWidth: 0,
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          format: '{value}%',
          align: 'right',
          style: {
            color: theme === 'dark' ? '#fff' : '#000',
            opacity: 0.2,
          },
          y: 2,
          x: 10,
        },
        offset: 20,
        softMax: 100,
        softMin: 0,
        tickPositions: [0, 20, 40, 60, 80, 100],
        gridLineWidth: showGrid ? 1 : 0,
        gridLineDashStyle: 'Dash',
        gridLineColor:
          theme === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)',
        opposite: true,
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        split: false,
        useHTML: true,
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadow: false,
        formatter() {
          const chart = this.points?.[0]?.series?.chart;
          const { x } = this;

          if (!chart || !x || !this.points) return '';

          const date = new Date(x);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedHours = hours % 12 || 12;

          const months = [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC',
          ];

          function capitalize(str: string) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
          }

          const capitalizedMonth = capitalize(months[date.getMonth()]);

          const formattedDate = `${capitalizedMonth} ${date.getDate()}, ${formattedHours}${
            minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''
          } ${ampm.toLowerCase()}`;

          const { chartWidth } = chart;
          const pixelX = chart.xAxis[0].toPixels(x as number, false);
          const labelWidthEstimate = 100;

          let align: 'left' | 'right' | 'center' = 'center';
          if (pixelX + labelWidthEstimate / 2 > chartWidth) {
            align = 'right';
          } else if (pixelX - labelWidthEstimate / 2 < 0) {
            align = 'left';
          }

          chart.xAxis[0].removePlotLine('hover-line');
          chart.xAxis[0].addPlotLine({
            id: 'hover-line',
            color: theme === 'dark' ? '#26292F' : '#e5e5e5',
            width: 1,
            value: x as number,
            label: {
              text: formattedDate,
              align,
              rotation: 0,
              y: 10,
              style: {
                color: theme === 'dark' ? '#A1A7BB' : '#606E85',
                zIndex: 10,
              },
            },
            zIndex: 10,
          });

          return this.points
            .map((point) => {
              const { color } = point;
              const userOptions = point.series.userOptions as unknown as {
                marketId: string;
              };
              const market = mainMarket?.markets.find(
                (item) => Number(item.id) === Number(userOptions.marketId)
              );

              return `
                <div style="background-color: ${
                  color as string
                }; color: white; padding: 4px 6px; border-radius: 2px; font-weight: medium; font-size: 12px; margin-bottom: 4px; width: fit-content;">
                  ${market?.question || 'Unknown'}: ${point.y?.toFixed(0)}%
                </div>`;
            })
            .join('');
        },
      },

      series: data.map((seriesData, index) => {
        const color = getLegendColor(index);

        const uniqueData = seriesData
          .filter(
            (item, i, arr) =>
              i === 0 || Number(item.timestamp) !== Number(arr[i - 1].timestamp)
          )
          .map((point) => [
            new Date(point.timestamp).getTime(),
            point.hypePrice * 100,
          ])
          .sort((a, b) => (a[0] > b[0] ? 1 : -1));
        return {
          name: `Line ${index + 1}`,
          marketId: seriesData?.[0]?.marketId,
          type: 'spline',
          data: uniqueData,
          color: color || '#418FFF',
          lineWidth: 2,
          marker: {
            enabled: false,
            radius: 2,
            symbol: 'circle',
            lineColor: color || '#418FFF',
            lineWidth: 0,
            fillColor: color || '#418FFF',
          },
          dataGrouping: {
            groupAll: true,
            forced: true,
          },
          turboThreshold: 10000,
        };
      }),
      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
          states: {
            hover: {
              lineWidth: 2,
            },
            inactive: {
              enabled: false,
            },
          },
        },
        dataGrouping: {
          groupAll: true,
          forced: true,
          units: ['All Time', ['week', [1]]],
        },
      },

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              chart: {
                height: 250,
              },
            },
          },
        ],
      },
    }),
    [showSubgraph, theme, showGrid, data, mainMarket?.markets]
  );

  useEffect(() => {
    data.forEach((seriesData, index) => {
      const last = seriesData[0];
      const color = getLegendColor(index);

      if (last) {
        options.series?.push({
          data: [[new Date(last.timestamp).getTime(), last.hypePrice * 100]],
          type: 'spline',
          color: color || '#418FFF',
          marker: {
            enabled: true,
            radius: 4,
            symbol: 'circle',
            lineWidth: 0,
            fillColor: '',
          },
          name: '',
          lineWidth: 0,
        });
      }
    });
  }, [data, options.series]);

  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      const { chart } = chartRef.current;

      chart.xAxis[0].removePlotLine('initial-line');
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!chartRef?.current?.chart) return;
      chartRef.current.chart.reflow();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full px-0">
      <div className="relative -mb-6 flex max-h-[330px] items-center justify-between overflow-y-hidden">
        <div className="-ml-3 grow">
          <HighchartsReact
            highcharts={Highcharts}
            constructorType="stockChart"
            options={options}
            ref={chartRef}
          />
        </div>
      </div>

      <div className="relative z-10 flex w-full items-center justify-between">
        <div className="relative ml-auto size-fit" ref={menuRef}>
          {/* <button
            onClick={() => toggleMenu()}
            className="group flex size-[30px] items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/5"
          >
            <IconSetting className="stroke-[#606E85] focus:stroke-white group-hover:stroke-[#0C131F] dark:stroke-[#A1A7BB] dark:group-hover:stroke-white" />
          </button> */}
          {isOpen && (
            <div className="dark:bg-triad-dark-400 absolute bottom-8 right-5 z-50 mt-2 h-[200px] w-[260px] rounded-lg border bg-white p-1 shadow-lg dark:border-white/10">
              <ul className="flex h-full flex-col justify-between">
                <li className="flex h-[48px] items-center justify-between p-2 px-3 text-sm dark:text-white">
                  <span>Activity subgraphic</span>
                  <button
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      showSubgraph
                        ? 'bg-blue-600'
                        : 'bg-[#EAECF0] dark:bg-white/5'
                    )}
                    onClick={() => setShowSubgraph(!showSubgraph)}
                  >
                    <span
                      className={cn(
                        'inline-block size-4 rounded-full bg-white transition-transform',
                        showSubgraph ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </li>

                <li className="flex h-[48px] items-center justify-between p-2 px-3 text-sm dark:text-white">
                  <span>Horizontal grid</span>
                  <button
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      showGrid ? 'bg-blue-600' : 'bg-[#EAECF0] dark:bg-white/5'
                    )}
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <span
                      className={cn(
                        'inline-block size-4 rounded-full bg-white transition-transform',
                        showGrid ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </li>
                <li
                  onClick={() => {
                    chartRef.current?.chart.exportChartLocal(
                      {
                        type: 'application/pdf',
                      },
                      options
                    );
                  }}
                  className="flex h-[48px] cursor-pointer items-center rounded-md p-2 px-3 text-sm hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
                >
                  Download PDF document
                </li>

                <li
                  onClick={() => {
                    chartRef.current?.chart.exportChartLocal(
                      {
                        type: 'image/png',
                      },
                      options
                    );
                  }}
                  className="flex h-[48px] cursor-pointer items-center rounded-md p-2 px-3 text-sm hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
                >
                  Download PNG image
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiLineChart;
