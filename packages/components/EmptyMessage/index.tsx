import { cn } from '@/utils/cn';
import { PermanentMarker } from '@/utils/fonts';

const EmptyMessage = ({ message }: { message: string }) => {
  return (
    <div
      className={cn(
        'absolute cursor-default inset-0 my-20 flex items-center justify-center text-center text-lg text-gray-600',
        PermanentMarker.className
      )}
    >
      <span>{message}</span>
    </div>
  );
};

export default EmptyMessage;
