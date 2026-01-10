import HighchartsReact from 'highcharts-react-official';
import type { NavigatorOptions } from 'highcharts/highstock';
import Highcharts from 'highcharts/highstock';
import HighchartsExportData from 'highcharts/modules/export-data';
import HighchartsExporting from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import { WinningDirection } from '@/types/market';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { IconArrowGreenUp, IconArrowRedBottom } from '@/components/Icons';
import switchQuestionDateStatus from '@/components/QuestionDateStatus';
import { useMarket } from '@/context/Market';
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

const LineChart = ({
  data,
}: {
  data: {
    time: string;
    date: string;
    value: number;
    price: number;
  }[];
}) => {
  const { theme } = useTheme();
  const { selectedMarket } = useMarket();
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  function getAlignment(
    chart: Highcharts.Chart,
    x: number
  ): 'left' | 'right' | 'center' {
    const { chartWidth } = chart;
    const pixelX = chart.xAxis[0].toPixels(x, false);
    const labelWidthEstimate = 100;

    if (pixelX + labelWidthEstimate / 2 > chartWidth) {
      return 'right';
    }
    if (pixelX - labelWidthEstimate / 2 < 0) {
      return 'left';
    }
    return 'center';
  }

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
            // symbol: '/assets/svg/settigns.svg',
            symbolSize: 20,
            symbolStroke: '#fff',
            symbolFill: 'transparent',
            // align: 'right',
            verticalAlign: 'bottom',
            // x: 10,
            // y: 20,
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
            menuItems: [
              // 'downloadPNG',
              // 'downloadJPEG',
              // 'downloadPDF',
              // 'downloadSVG',
              // 'separator',
              // 'downloadCSV',
              'subgraph',
              'grid',
              'downloadPDF',
              'downloadPNG',
              // 'downloadXLS',
            ],
          },
        },
      },
      exportData: {
        enabled: false,
      },
      navigator: {
        // top: 200,
        top: 250,
        enabled: true,
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
      // title: {
      //   text: `<div style='font-size: 30px; font-weight: 600; color: ${
      //     theme === 'dark' ? '#fff' : '#000'
      //   }'>${Number(
      //     selectedMarket ? selectedMarket.hypePrice * 100 : 0
      //   ).toFixed(0)}% <span style='font-size: 16px; font-weight: 500; color: ${
      //     theme === 'dark' ? '#fff' : '#000'
      //   }'>Chance</span></div>`,
      //   useHTML: true,
      //   align: 'left',
      // },

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
        crosshair: false,
        minPadding: 0.02,
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
          step: 1,
        },
        offset: 20,
        min: 0,
        max: 100,
        endOnTick: true,
        startOnTick: true,
        gridLineWidth: 1,
        gridLineDashStyle: 'Dash',
        gridLineColor:
          theme === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)',
        opposite: true,
        tickPositioner() {
          return [0, 20, 40, 60, 80, 100];
        },
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
          return this.points
            ?.map((point) => {
              const { color } = point;
              // setHoverPrice(Number(point.y?.toFixed(0)));

              return `
                <div style="background-color: ${
                  color as string
                }; color: white; padding: 4px 6px; border-radius: 2px; font-weight: medium; font-size: 12px; margin-bottom: 4px; width: fit-content;">
                  Chance: ${Math.floor(Number(point.y))}%
                </div>`;
            })
            .join('');
        },
      },

      series: [
        {
          name: 'Probability',
          type: 'spline',
          data:
            data?.length > 0
              ? data.map((point) => [
                  new Date(point.time).getTime(),
                  point.price * 100,
                ])
              : [],
          color: theme === 'dark' ? '#418FFF' : '#0052FF',
          lineWidth: 2,
          marker: {
            enabled: false,
            radius: 2,
            symbol: 'circle',
            lineColor: theme === 'dark' ? '#418FFF' : '#0052FF',
            lineWidth: 0,
            fillColor: theme === 'dark' ? '#418FFF' : '#0052FF',
          },
        },
      ],

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
          events: {
            mouseOver(event) {
              const chart = this.points?.[0]?.series?.chart;

              const { x } = event;

              if (!this.points?.length || !chart || !x) return;

              chart?.xAxis?.[0]?.removePlotLine('hover-line');
              chart?.xAxis?.[0]?.addPlotLine({
                id: 'hover-line',
                color: theme === 'dark' ? '#26292F' : '#e5e5e5',
                width: 1,
                value: x,
                label: {
                  text: '', // Função que formata o timestamp
                  align: getAlignment(chart, x),
                  rotation: 0,
                  y: 10,
                  style: {
                    color: '#A1A7BB',
                    zIndex: 10,
                  },
                },
                zIndex: 10,
              });
            },
          },
        },
        dataGrouping: {
          enabled: false,
          forced: true,
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
    [data, theme]
  );

  const renderPercentage = useCallback(
    (x: number | string, price: number) => {
      if (data?.length === 0) return;
      const growth = document.getElementById('growth');
      const percentageColor = document.getElementById('growth-percentage');

      if (!growth || !percentageColor) return;

      const lastDateComparisson = data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];

      const currentPrice = Number(price) / 100;

      const percentageChange =
        lastDateComparisson !== undefined
          ? (currentPrice - lastDateComparisson.price) * 100
          : 0;

      if (percentageChange > 0) {
        document.getElementById('arrow-red')?.classList.add('hidden');
        document.getElementById('arrow-green')?.classList.remove('hidden');
        percentageColor?.classList.add('text-triad-green-200');
        percentageColor?.classList.remove('text-triad-red-300');
      } else {
        document.getElementById('arrow-green')?.classList.add('hidden');
        document.getElementById('arrow-red')?.classList.remove('hidden');
        percentageColor?.classList.remove('text-triad-green-200');
        percentageColor?.classList.add('text-triad-red-300');
      }
      growth.innerHTML = `${Math.floor(percentageChange)
        .toFixed(0)
        .replace('-', '')}%`;
    },
    [data]
  );

  // const lastPriceChange = useMemo(() => {
  //   if (data?.length === 0) return;
  //   const aDayBefore = subDays(new Date(data[data.length - 1].date), 1);

  //   const beforeDataComparisson = data.filter(
  //     (item) => new Date(item.date).getTime() < aDayBefore.getTime()
  //   );
  //   const lastDateComparisson =
  //     beforeDataComparisson[beforeDataComparisson.length - 1];
  //   const currentPrice = Number(selectedMarket?.hypePrice) / 100;

  //   const percentageChange =
  //     lastDateComparisson !== undefined
  //       ? ((currentPrice - lastDateComparisson.price) /
  //           lastDateComparisson.price) *
  //         100
  //       : 0;

  //   return percentageChange;
  // }, [data, selectedMarket?.hypePrice]);

  useEffect(() => {
    if (data?.length === 0) return;
    renderPercentage(
      data[data.length - 1]?.date,
      Number(selectedMarket?.hypePrice) * 100
    );
  }, [data, selectedMarket?.hypePrice, renderPercentage]);

  useEffect(() => {
    if (!chartRef.current || !chartRef.current.chart) return;
    const { chart } = chartRef.current;

    Highcharts.addEvent(chart.container, 'mousemove', (e) => {
      const position = chart?.pointer?.normalize(e as MouseEvent);
      const x = chart.xAxis?.[0]?.toValue(position.chartX);

      if (position.chartY > chart.plotHeight) {
        return;
      }

      if (x) {
        const date = new Date(x);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
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
        const formattedDate = `${
          months[date.getUTCMonth()]
        } ${date.getUTCDate()}, ${formattedHours}${
          minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''
        } ${ampm}`;

        const series = chart.series[0] as unknown as {
          groupedData: Highcharts.Point[];
        };
        let closestPoint: Highcharts.Point | undefined;
        let minDistance = Infinity;

        series?.groupedData?.forEach((point) => {
          const distance = Math.abs(point.x - x);
          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
          }
        });

        const price = closestPoint?.y ?? null;

        const el = document.getElementById('chance-percentage');
        const growth = document.getElementById('growth');

        if (el) {
          el.innerHTML = `${Math.floor(Number(price))}%`;
        }

        if (growth) {
          renderPercentage(x, Number(price));
        }

        const { chartWidth } = chart;
        const pixelX = chart.xAxis[0].toPixels(x, false);
        const labelWidthEstimate = 100;

        let align: 'left' | 'right' | 'center' = 'center';
        if (pixelX + labelWidthEstimate / 2 > chartWidth) {
          align = 'right';
        } else if (pixelX - labelWidthEstimate / 2 < 0) {
          align = 'left';
        }

        chart.xAxis?.[0]?.removePlotLine('hover-date');
        chart.xAxis?.[0]?.addPlotLine({
          id: 'hover-date',
          color: '#26292F',
          width: 1,
          value: x,
          label: {
            text: formattedDate,
            align,
            rotation: 0,
            y: 10,
            style: {
              color: '#A1A7BB',
              zIndex: 10,
            },
          },
        });
      }
    });
  }, [data, renderPercentage, chartRef]);

  return (
    <div className="mx-auto w-full px-0">
      <div className="flex justify-between">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-x-1.5 font-bold text-black dark:text-white sm:flex-col sm:items-start lg:items-center xl:flex-row">
            <h3
              id="chance-percentage"
              className="relative text-3xl xl:text-3xl"
            >
              {Number(
                selectedMarket ? selectedMarket.hypePrice * 100 : 0
              ).toFixed(0)}
              %
            </h3>
            <span className="relative text-xl font-medium lg:text-base">
              Chance
            </span>
            <span
              id="growth-percentage"
              className={cn(
                'flex items-center text-sm font-semibold text-triad-green-200'
              )}
            >
              <IconArrowGreenUp id="arrow-green" />
              <IconArrowRedBottom className="hidden" id="arrow-red" />
              <span id="growth">0%</span>
            </span>
          </div>

          <div className="hidden text-xs">
            {switchQuestionDateStatus({
              date: selectedMarket?.marketEnd.toString() || '',
              hasResolved:
                selectedMarket?.winningDirection !== WinningDirection.NONE,
            })}
          </div>
        </div>
      </div>
      <div className="relative -mb-6 flex max-h-[330px] items-center justify-between overflow-hidden">
        <div
          onMouseLeave={() => {
            const el = document.getElementById('chance-percentage');

            if (el) {
              el.innerHTML = `${Math.floor(
                Number(selectedMarket ? selectedMarket.hypePrice * 100 : 0)
              )}%`;
            }

            const chart = chartRef.current?.chart;

            if (!chart) return;

            chart?.xAxis[0].removePlotLine('hover-date');

            if (data.length === 0) return;

            renderPercentage(
              data[data.length - 1]?.date,
              Number(selectedMarket?.hypePrice) * 100
            );
          }}
          className="-ml-3 grow"
        >
          <HighchartsReact
            highcharts={Highcharts}
            constructorType="stockChart"
            options={options}
            ref={chartRef}
          />{' '}
        </div>
      </div>

      {/* <div className="relative z-10 flex w-full items-center justify-between">
        <div className="relative ml-auto size-fit" ref={menuRef}>
          <button
            onClick={() => toggleMenu()}
            className="group flex size-[30px] items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/5"
          >
            <IconSetting className="stroke-[#606E85] focus:stroke-white group-hover:stroke-[#0C131F] dark:stroke-[#A1A7BB] dark:group-hover:stroke-white" />
          </button>
          {isOpen && (
            <div className="absolute bottom-8 right-5 z-50 mt-2 h-[200px] w-[260px] rounded-lg border bg-white p-1 shadow-lg dark:border-white/10 dark:bg-triad-dark-400">
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
      </div> */}
    </div>
  );
};

export default LineChart;
