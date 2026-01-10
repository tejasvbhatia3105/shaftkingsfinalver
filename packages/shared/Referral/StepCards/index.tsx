const StepCards = () => {
  return (
    <div className="mx-auto mt-5 w-full max-w-[1200px] overflow-x-auto">
      <div className="flex w-max gap-x-3 sm:grid sm:w-full sm:grid-cols-3">
        <div className="relative h-[160px] min-w-[280px] shrink-0 overflow-hidden rounded-[1px] border border-white/5 bg-white/5 p-4">
          <div className="relative z-[1] flex items-center gap-x-3">
            <span className="flex size-10 items-center justify-center bg-[#F8E173] text-2xl font-bold text-black">
              1
            </span>
            <span className="max-w-[293px] text-base font-semibold text-white">
              Copy your unique link and share it with others!
            </span>
          </div>
          <div className="relative z-[1] mx-auto mt-5 w-fit">
            <img
              width={224}
              height={61}
              src="/assets/svg/copy-and-earn.svg"
              alt=""
            />
          </div>
        </div>

        <div className="relative h-[160px] min-w-[280px] shrink-0 overflow-hidden rounded-[1px] border border-white/5 bg-white/5 p-4">
          <div className="relative z-[1] flex items-center gap-x-3">
            <span className="flex size-10 items-center justify-center bg-[#F8E173] text-2xl font-bold text-black">
              2
            </span>
            <span className="max-w-[293px] text-base font-semibold text-white">
              Your referrals trade on Triad, and you earn a share of their fees.
            </span>
          </div>
          <div className="relative z-[1] mx-auto mt-0 w-fit">
            <img
              width={246}
              height={132}
              src="/assets/svg/referral/avatar-arrow.svg"
              alt=""
              className="object-contain"
            />
          </div>
        </div>

        <div className="relative h-[160px] min-w-[280px] shrink-0 overflow-hidden rounded-[1px] border border-white/5 bg-white/5 p-4">
          <div className="relative z-[1] flex items-center gap-x-3">
            <span className="flex size-10 items-center justify-center bg-[#F8E173] text-2xl font-bold text-black">
              3
            </span>
            <span className="max-w-[293px] text-base font-semibold text-white">
              Access your earnings anytime and withdraw to your wallet.
            </span>
          </div>
          <div className="relative z-[1] mx-auto mt-5 w-fit">
            <img
              width={205}
              height={125}
              src="/assets/svg/referral/coins.svg"
              alt=""
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCards;
