import './globals.css'
import type { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'

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
      <body>
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID!} />
        {children}
        </body>
    </html>
  )
}