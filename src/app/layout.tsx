import { Lato } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const lato = Lato({ weight: ['400', '700'], subsets: ['latin'] })

export const metadata = {
  title: 'Pacer Watch',
  description: 'Running Pace Calculator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={lato.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
