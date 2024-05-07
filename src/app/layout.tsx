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
  subsets: ['latin', 'latin-ext'],
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

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
        <link rel="manifest" href="/favicon/site.webmanifest"/>
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#2d89ef"/>
        <meta name="theme-color" content="#ffffff"/>
          <meta name="viewport" 
          content="width=device-width, height=device-height,  initial-scale=1.0, user-scalable=no;user-scalable=0;"/>
        <script dangerouslySetInnerHTML={{
          __html:`
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:4972560,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `
        }}/>
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
