import { cn } from '@/utils/cn';

const CurrentQuestion: React.FC<{
  data: {
    currentQuestion?: string;
    image?: string;
  };
}> = ({ data }) => {
  return (
    <div className="m-0.5 flex w-full flex-row items-start justify-between sm:mt-0 md:items-center">
      <div className="flex flex-col gap-6 lg:mt-2 lg:flex-row xl:mt-0">
        <>
          <div className="lg:size-[84px]">
            <img
              src={data.image}
              className="size-full min-h-[70px] max-w-[70px] rounded-[1px] object-cover md:min-w-[50px] lg:h-[84px] lg:min-w-[84px]"
              alt={data.image || 'Market Image'}
            />
          </div>
          <div className="flex w-full flex-col justify-center lg:w-11/12">
            <span
              className={cn(
                'text-xl lg:text-3xl font-semibold text-shaftkings-dark-100 dark:text-white'
              )}
            >
              {data.currentQuestion}
            </span>
          </div>
        </>
      </div>
    </div>
  );
};

export default CurrentQuestion;
