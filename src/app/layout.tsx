import EventProvider from '@providers/EventProvider'
import InformationProvider from '@providers/InformationProvider'
import type { Metadata } from 'next'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { Poppins } from 'next/font/google'
import { Suspense } from 'react'
import Error from './error'
import './globals.scss'
import Loading from './loading'

const poppins = Poppins({
  subsets: ['latin', 'latin-ext', 'devanagari'],
  weight: ['400', '700', '100', '200', '300', '500', '600', '800', '900'],
})
export const metadata: Metadata = {
  title: 'Wordpanda',
  description: 'Learn new words and phrases',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (

    <html lang="en">
      <head>
        <meta name="google-site-verification" content="ctYiVgIDqF93EFA9K-KPFNJsRgtSRLa3m8JrZsxpiw4" />
        <meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body className={poppins.className}>
        <Suspense fallback={<Loading />}>
          <EventProvider />
          <InformationProvider />
        </Suspense>

        <ErrorBoundary errorComponent={Error}>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </ErrorBoundary>

      </body>
    </html >
  )
}
