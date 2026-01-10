import AppProvider from '@/context/index';
import { ThemeProvider } from 'next-themes';
import { type ReactNode } from 'react';
import { ToastContainer as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AppProvider>
        <Toast
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          limit={5}
        />

        <div className="relative h-auto min-h-full w-full dark:bg-shaftkings-dark-400 ">
          <div>{children}</div>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}
