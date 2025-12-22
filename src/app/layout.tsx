import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenCase',
  description: 'A web-based detective game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}