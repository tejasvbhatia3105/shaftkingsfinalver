// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-shadow */

export default function Loading() {
  return (
    <div className="relative z-20 mx-auto flex h-screen w-full max-w-[1280px] flex-col gap-x-6 px-2.5 pt-11 md:flex-row">
      <div className="w-full md:max-w-[calc(100%-380px)]">
        <div className="w-full">
          <div className="flex w-full">
            <div className="mb-4 flex w-full flex-col">
              <div className="flex w-full items-center md:gap-x-5">
                <div className="animate-loading flex min-h-[70px] w-full max-w-[70px] rounded-xl bg-black/10 dark:bg-shaftkings-gray-600 lg:h-[84px] lg:min-w-[84px]" />
                <div>
                  <div className="animate-loading h-[36px] w-full rounded bg-black/10 dark:bg-shaftkings-gray-600 lg:w-[600px]" />
                </div>
              </div>

              <div className="my-[18px] flex size-full max-h-[30px] items-center justify-between">
                <div className="flex w-2/4 items-center justify-end gap-x-1">
                  {Array.from({ length: 3 }).map((_, key) => (
                    <div
                      key={key}
                      className="animate-loading relative mt-2 h-4 w-full rounded-[1px] bg-black/10 dark:bg-shaftkings-gray-600 lg:mt-0 lg:min-w-[130px]"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-end gap-x-1">
                  {Array.from({ length: 2 }).map((_, key) => (
                    <div
                      key={key}
                      className="animate-loading relative mt-2 size-[30px] rounded bg-black/10 dark:bg-shaftkings-gray-600 lg:mt-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex h-[345px] flex-col gap-y-2">
          <div className="flex size-full items-center gap-x-1">
            {Array.from({ length: 1 }).map((_, key) => (
              <div
                key={key}
                className="relative size-full overflow-hidden rounded-[10px] border bg-black/10 dark:border-shaftkings-gray-600/40 dark:bg-transparent"
              >
                <svg
                  viewBox="0 0 500 400"
                  preserveAspectRatio="none"
                  className="absolute left-0 top-0 size-full animate-pulse"
                >
                  {Array.from({ length: 9 }).map((_, i) => {
                    const y = (400 / 8) * i;
                    return (
                      <line
                        key={i}
                        x1="0"
                        y1={y}
                        x2="500"
                        y2={y}
                        stroke="#37404e "
                        strokeWidth="1"
                        strokeDasharray="4,6"
                      />
                    );
                  })}

                  <path
                    d="M 0 300 Q 100 200 200 250 T 400 200 T 500 250"
                    fill="none"
                    stroke="#37404e"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ))}
          </div>
          <div className="flex size-full max-h-10 items-center justify-between">
            <div className="flex h-full w-2/4 items-center justify-end gap-x-1">
              {Array.from({ length: 1 }).map((_, key) => (
                <div
                  key={key}
                  className="animate-loading relative mt-2 size-full rounded-[1px] bg-black/10 dark:bg-shaftkings-gray-600 lg:mt-0 lg:min-w-[130px]"
                />
              ))}
            </div>
            <div className="flex items-center justify-end gap-x-1">
              {Array.from({ length: 1 }).map((_, key) => (
                <div
                  key={key}
                  className="animate-loading relative mt-2 size-[30px] rounded bg-black/10 dark:bg-shaftkings-gray-600 lg:mt-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-2 hidden h-[440px] w-full flex-col justify-between rounded-xl border border-black/10 p-4 dark:border-shaftkings-gray-600/40 md:flex lg:mt-0 lg:w-[345px]">
        <div className="flex items-center gap-x-2">
          <div className="animate-loading size-[42px] min-h-[42px] min-w-[42px] rounded-lg bg-black/10 dark:bg-shaftkings-gray-600"></div>

          <div className="w-full">
            <div className="animate-loading h-[17px] w-full rounded bg-black/10 dark:bg-shaftkings-gray-600" />
            <div className="animate-loading mt-0.5 h-3.5 w-1/4 rounded bg-black/10 dark:bg-shaftkings-gray-600" />
          </div>
        </div>
        <div className="animate-loading mt-5 h-7 w-full rounded bg-black/10 dark:bg-shaftkings-gray-600" />

        <div className="mt-4 flex items-center gap-x-2">
          <div className="animate-loading h-12 w-full rounded bg-black/10 dark:bg-shaftkings-gray-600" />
          <div className="animate-loading  h-12 w-full rounded bg-black/10 dark:bg-shaftkings-gray-600" />
        </div>

        <div className="mt-auto flex flex-col items-center gap-2">
          <div className="flex w-full items-center gap-x-1">
            {Array.from({ length: 4 }).map((_, key) => (
              <div
                key={key}
                className="animate-loading h-7 w-full rounded-[1px] bg-black/10 dark:bg-shaftkings-gray-600"
              />
            ))}
          </div>

          <div className="animate-loading h-12 w-full rounded bg-black/10 dark:bg-shaftkings-gray-600" />
        </div>
      </div>
    </div>
  );
}
