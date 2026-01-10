// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import PredictionStatus from '@/components/PredictionStatus';
import * as ToastComponents from '@/components/Toast';
import { Toast } from '@/components/Toast';
// eslint-disable-next-line no-restricted-imports
import React, { useCallback, useRef, useState } from 'react';
import type { Id } from 'react-toastify';

const { Toastfy } = ToastComponents;

type TransactionStatus = 'creating' | 'signing' | 'created';
type ErrorStep = 'creating' | 'signing' | 'created';

interface ToastStep {
  id: number;
  label: string;
  key: string;
}

interface ToastConfig {
  title: string;
  status: TransactionStatus;
  type: 'info' | 'success' | 'error';
  progress: number;
  forceExpand?: boolean;
  errorStep?: ErrorStep;
  steps?: ToastStep[];
}

export const defaultSteps: ToastStep[] = [
  { id: 1, label: 'Creating Prediction', key: 'creating' as const },
  { id: 2, label: 'Signing Transaction', key: 'signing' as const },
  { id: 3, label: 'Prediction Created', key: 'created' as const },
];


const TOAST_CONFIGS: Record<TransactionStatus, ToastConfig> = {
  creating: {
    title: 'Creating Prediction',
    status: 'creating',
    type: 'info',
    progress: 33,
    steps: defaultSteps
  },
  signing: {
    title: 'Confirming Transaction',
    status: 'signing',
    type: 'info',
    progress: 66,
    steps: defaultSteps
  },
  created: {
    title: 'Prediction Created',
    status: 'created',
    type: 'success',
    progress: 100,
    forceExpand: true,
    steps: defaultSteps
  },
};

const ERROR_CONFIGS: Record<ErrorStep, ToastConfig> = {
  creating: {
    title: 'Failed to open Prediction',
    status: 'creating',
    type: 'error',
    progress: 33,
    errorStep: 'creating',
    steps: defaultSteps
  },
  signing: {
    title: 'Transaction Failed',
    status: 'signing',
    type: 'error',
    progress: 66,
    errorStep: 'signing',
    forceExpand: true,
    steps: defaultSteps
  },
  created: {
    title: 'Prediction Failed',
    status: 'created',
    type: 'error',
    progress: 100,
    errorStep: 'created',
    forceExpand: true,
    steps: defaultSteps
  },
};

export const useTransactionToast = () => {
  const toastIdRef = useRef<Id | null>(null);
  const [currentStatus, setCurrentStatus] =
    useState<TransactionStatus>('creating');
    const currentStepsRef = useRef<ToastStep[]>(defaultSteps);


    const createToastElement = useCallback((config: ToastConfig) => {
      return React.createElement(PredictionStatus, {
        currentStatus: config.status,
        key: `${config.status}-${Date.now()}`,
        errorStep: config.errorStep,
        steps: config.steps || defaultSteps,
      });
    }, []);


  const createToastProps = useCallback(
    (config: ToastConfig) => ({
      title: config.title,
      description: createToastElement(config),
      type: config.type,
      manualProgress: config.progress,
      isDropdown: true, // Toasts de transação sempre devem ser dropdown
      ...(config.forceExpand && { forceExpand: true }),
    }),
    [createToastElement]
  );

  const updateToast = useCallback(
    (status: TransactionStatus) => {
      if (!toastIdRef.current) return;

      const config = {
        ...TOAST_CONFIGS[status],
        steps: currentStepsRef.current,
      };

      try {
        Toast.update(toastIdRef.current, {
          render: () => React.createElement(Toastfy, createToastProps(config)),
          type: config.type,
        });

        setCurrentStatus(status);
      } catch (error) {
        /* empty */
      }
    },
    [createToastProps, currentStepsRef.current]
  );


  const startTransaction = useCallback((customSteps?: ToastStep[]) => {
    const stepsToUse = customSteps ?? defaultSteps;
    currentStepsRef.current = stepsToUse;

    const config = {
      ...TOAST_CONFIGS.creating,
      steps: stepsToUse,
    };

    const id = Toast.show(createToastProps(config));
    toastIdRef.current = id;
    setCurrentStatus('creating');
    return id;
  }, [createToastProps]);



  const updateToSigning = useCallback(() => {
    updateToast('signing');
  }, [updateToast]);

  const updateFinalStatus = useCallback(
    async (delayMs = 6000) => {
      if (!toastIdRef.current) return;

      updateToast('created');

      await new Promise((resolve) => {
        setTimeout(resolve, delayMs);
      });

      Toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    },
    [updateToast]
  );

  const updateToastWithError = useCallback(
    (errorStep: ErrorStep) => {
      if (!toastIdRef.current) return;

      const config = {
        ...ERROR_CONFIGS[errorStep],
        steps: currentStepsRef.current,
      };

      try {
        Toast.update(toastIdRef.current, {
          render: () => React.createElement(Toastfy, createToastProps(config)),
          type: config.type,
        });

        setCurrentStatus(config.status);
      } catch (error) {
        /* empty */
      }
    },
    [createToastProps]
  );


  const finishWithError = useCallback(
    async (error: Error) => {
      let detectedStep: ErrorStep = currentStatus as ErrorStep;

      if (
        error.message?.includes('User rejected') ||
        error.name === 'WalletSignTransactionError'
      ) {
        detectedStep = 'signing';
      }

      if (toastIdRef.current) {
        updateToastWithError(detectedStep);

        await new Promise((resolve) => {
          setTimeout(resolve, 6000);
        });

        Toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      } else {
        const config = ERROR_CONFIGS[detectedStep];
        const id = Toast.show(createToastProps(config));

        setTimeout(() => {
          Toast.dismiss(id);
        }, 6000);
      }
    },
    [currentStatus, updateToastWithError, createToastProps]
  );

  return {
    currentStatus,
    isActive: !!toastIdRef.current,
    startTransaction,
    updateToSigning,
    updateFinalStatus,
    finishWithError,
  };
};
