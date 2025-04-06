import type { Metadata } from 'next'
import './globals.css'
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
        {children}
      </body>
    </html>
  )
}
