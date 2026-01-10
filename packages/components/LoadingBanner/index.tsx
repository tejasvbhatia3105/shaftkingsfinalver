export function LoadingBanner() {
  return (
    <div className="animate-loading relative flex h-[220px] w-full items-center justify-center gap-x-8 rounded-[10px] bg-gray-300 p-4 max-[768px]:min-w-full sm:h-[370px]">
      <div className="hidden size-[90px] animate-pulse rounded bg-white/10 font-semibold sm:block lg:w-[220px] lg:h-[100px]"></div>
      <div className="flex h-full flex-col items-center justify-center gap-y-3">
        <div className="h-[20px] w-[300px] animate-pulse bg-white/10 lg:w-[400px]"></div>

        <div className="h-[20px] w-[160px] animate-pulse bg-white/10"></div>
        <div className="flex items-center gap-x-2">
          <div className="h-[25px] w-[90px] animate-pulse rounded bg-white/10"></div>
          <div className="h-[20px] w-[80px] animate-pulse rounded bg-white/10"></div>
        </div>
      </div>
      <div className="hidden size-[90px] animate-pulse rounded bg-white/10 sm:block lg:w-[220px] lg:h-[100px]"></div>
    </div>
  );
}
