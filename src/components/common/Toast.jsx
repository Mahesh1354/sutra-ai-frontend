import { Toaster, toast } from 'react-hot-toast';

export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showInfo = (message) => toast(message);

export const ToastProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: '#363636',
        color: '#fff',
      },
      success: {
        duration: 3000,
        style: {
          background: '#10b981',
        },
      },
      error: {
        duration: 4000,
        style: {
          background: '#ef4444',
        },
      },
    }}
  />
);