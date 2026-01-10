const LoadingMarket = () => (
  <div className="animate-loading flex h-[220px] w-full items-center justify-between rounded-[1px] p-4 flex-col">
    <div className="hidden sm:block" />
    <div className="flex max-sm:flex-col items-center w-full h-full justify-between">
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-x-2">
          <div className="animate-loading size-[60px] rounded dark:bg-shaftkings-gray-600 max-sm:size-10" />

          <div className="flex flex-col gap-y-2">
            <div className="animate-loading h-6 w-48 rounded dark:bg-shaftkings-gray-600  max-sm:h-4 max-sm:w-28" />
            <div className="animate-loading h-6 w-32 rounded dark:bg-shaftkings-gray-600 max-sm:h-4 max-sm:w-24" />
          </div>
        </div>

        <div className="flex items-center sm:hidden gap-x-2">
          <div className="flex flex-col gap-y-2">
            <div className="animate-loading h-6 w-48 rounded dark:bg-shaftkings-gray-600  max-sm:h-4 max-sm:w-28" />
            <div className="animate-loading h-6 w-32 rounded dark:bg-shaftkings-gray-600 ml-auto max-sm:h-4 max-sm:w-24" />
          </div>

          <div className="animate-loading size-[60px] rounded dark:bg-shaftkings-gray-600 max-sm:size-10" />
        </div>
      </div>

      <div className="w-full h-2.5 sm:hidden animate-loading" />

      <div className="flex w-full justify-end items-end flex-col gap-x-2.5 gap-y-3 max-sm:flex-row">
        <div className="animate-loading h-12 w-64 rounded dark:bg-shaftkings-gray-600 max-sm:w-full" />
        <div className="animate-loading h-12 w-64 rounded dark:bg-shaftkings-gray-600 max-sm:w-full" />
      </div>
    </div>

    <div className="w-full h-4 rounded-[1px] max-sm:hidden animate-loading" />
  </div>
);

export default LoadingMarket;
