import { getInitials } from '@/utils/getInitials';

const getDynamicFontSize = (size: number) => {
  if (size <= 20) return 'text-xs';
  if (size <= 30) return 'text-sm';
  if (size <= 40) return 'text-base';
  if (size <= 50) return 'text-lg';
  return 'text-4xl';
};

const TeamLogo = ({
  primaryColor,
  secondaryColor,
  name,
  size = 40,
}: {
  primaryColor: string;
  secondaryColor: string;
  name: string;
  size?: number;
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_36272_8693)">
          <rect width="40" height="40" rx="6" fill={primaryColor} />
          <path
            d="M1 -0.5C0.171573 -0.5 -0.5 0.171573 -0.5 1V3.45731C-0.5 3.96503 -0.243171 4.43828 0.182518 4.71498L19.1825 17.065C19.6796 17.3881 20.3204 17.3881 20.8175 17.065L39.8175 4.71498C40.2432 4.43828 40.5 3.96503 40.5 3.45731V1C40.5 0.171573 39.8284 -0.5 39 -0.5H1Z"
            fill={secondaryColor}
            stroke="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_36272_8693">
            <rect width="40" height="40" rx="6" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <span
        className={`absolute inset-x-0 bottom-0 mx-auto w-fit font-bold text-white ${getDynamicFontSize(
          size
        )}`}
      >
        {getInitials(name)}
      </span>
    </div>
  );
};

export default TeamLogo;
