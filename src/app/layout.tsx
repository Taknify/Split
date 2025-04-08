import type { Metadata } from 'next'
import './globals.css'
import SessionProvider from '@/providers/SessionProvider'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Split App | Effortlessly Split Bills with Friends',
  description: 'Split expenses with friends and family using virtual cards. No more awkward money conversations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
