import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HowDoYouFindMe',
  description: 'Discover your online presence',
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