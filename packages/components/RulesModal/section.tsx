import { cn } from '@/utils/cn';
import { truncateText } from '@/utils/truncateWallet';
import Link from 'next/link';
import { useCallback } from 'react';

export type SectionData = {
  title: string;
  description: string;
  subDescription?: { title: string; description: string }[];
  subtitle?: string;
};

const Section: React.FC<SectionData> = ({
  title,
  description,
  subDescription,
  subtitle,
}) => {
  const getTextColor = useCallback((text: string) => {
    if (text === 'YES') return 'text-green-500';
    if (text === 'NO') return 'text-red-500';
    return '';
  }, []);

  return (
    <div className="mt-5 flex flex-col border-b border-[#E5E5E5] pb-5 first-of-type:mt-0 last-of-type:border-none dark:border-white/5">
      <span
        dangerouslySetInnerHTML={{ __html: title }}
        className="mb-1.5 text-sm text-black dark:text-white"
      />
      {description && (
        <p
          className="text-xs font-medium text-black dark:text-white"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {subDescription && (
        <div className="mt-2">
          {subDescription.map((sub, idx) => (
            <div key={idx} className="mt-2 flex gap-x-1 px-4">
              <h5
                className={cn('text-xs font-medium', getTextColor(sub.title))}
                dangerouslySetInnerHTML={{ __html: sub.title }}
              />
              <p
                className="text-xs font-medium text-black dark:text-white"
                dangerouslySetInnerHTML={{ __html: sub.description }}
              />
            </div>
          ))}
        </div>
      )}
      {subtitle && (
        <div className="mt-2 text-xs font-medium text-black dark:text-white">
          {subtitle.split(' ').map((word, index) =>
            word.startsWith('https') ? (
              <Link
                key={index}
                href={word}
                target="_blank"
                className="text-shaftkings-gold-200 underline"
              >
                {truncateText(word, 42)}
              </Link>
            ) : (
              <span
                dangerouslySetInnerHTML={{ __html: ` ${word} ` }}
                key={index}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Section;
