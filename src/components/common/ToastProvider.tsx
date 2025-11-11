// Toast notification provider

import { SnackbarProvider } from 'notistack';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      {children}
    </SnackbarProvider>
  );
};
