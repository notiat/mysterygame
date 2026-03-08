import type { Metadata } from 'next'
import './globals.css'
import ClientErrorMonitor from '@/components/system/ClientErrorMonitor';

export const metadata: Metadata = {
  title: 'OpenCase Platform Beta',
  description: 'Story-driven detective game platform with reusable architecture'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientErrorMonitor />
        {children}
      </body>
    </html>
  )
}