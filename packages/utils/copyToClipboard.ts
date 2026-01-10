import { Toast } from '@/components/Toast';

export function copyToClipboard(value: string | undefined) {
  if (!value) return;

  void navigator.clipboard.writeText(value);
  Toast.show({
    title: 'Copy to clipboard!',
    type: 'success',
  });
}
