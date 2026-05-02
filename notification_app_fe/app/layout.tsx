import type { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from './ThemeRegistry';
import DashboardLayout from './components/DashboardLayout';

export const metadata: Metadata = {
  title: 'NotifyHub',
  description: 'Campus Hiring Evaluation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <DashboardLayout>{children}</DashboardLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
