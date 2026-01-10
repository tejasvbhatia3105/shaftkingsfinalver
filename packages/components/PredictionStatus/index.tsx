import {
  IconLoadingSecondary,
  IconOutErrorCircle,
  IconSuccess,
} from '../Icons';

interface PredictionStatusProps {
  currentStatus: string;
  errorStep?: 'creating' | 'signing' | 'created';
  steps: {
    id: number;
    label: string;
    key: string;
  }[];
}

const PredictionStatus = ({
  currentStatus,
  errorStep,
  steps,
}: PredictionStatusProps) => {
  const getStepStatus = (stepKey: string) => {
    const stepOrder: Record<string, number> = {
      creating: 1,
      signing: 2,
      created: 3,
    };

    const currentOrder = stepOrder[currentStatus];
    const thisStepOrder = stepOrder[stepKey];

    if (errorStep === stepKey) {
      return 'failed';
    }

    if (errorStep) {
      const errorOrder = stepOrder[errorStep];

      if (thisStepOrder < errorOrder) return 'completed';

      if (thisStepOrder > errorOrder) return 'pending';
    }

    if (thisStepOrder === currentOrder && currentStatus === 'created')
      return 'completed';

    if (thisStepOrder < currentOrder) return 'completed';
    if (thisStepOrder === currentOrder && !errorStep) return 'current';

    return 'pending';
  };

  const renderIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <IconSuccess className="size-5 fill-green-500" />;
      case 'failed':
        return <IconOutErrorCircle className="size-5 fill-red-500" />;
      case 'current':
        return <IconLoadingSecondary />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-y-3">
      {steps.map((step) => {
        const status = getStepStatus(step.key);
        return (
          <div key={step.id} className="flex items-center gap-1.5 last:mb-0">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-triad-dark-100 dark:font-medium dark:text-white">
              <span>{step.id}/3</span>
              <span>{step.label}</span>
            </div>
            <div>{renderIcon(status)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default PredictionStatus;
