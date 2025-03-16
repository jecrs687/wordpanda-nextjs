import EventProvider from '@providers/EventProvider'
import InformationProvider from '@providers/InformationProvider'
import { MetaTagsProvider } from '@providers/MetaTags.provide'
import { QueryParamProvider } from '@providers/QueryParamProvider'
import { ThemeProvider } from '@providers/ThemeProvider'
import type { Metadata } from 'next'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Suspense } from 'react'
import Error from './error'
import './globals.css'
import Loading from './loading'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'WordPanda - Aprimore seu vocabulário',
  description: 'Aprenda novos idiomas enquanto assiste seus filmes e séries favoritos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (

    <html lang="en" suppressHydrationWarning>
      <head>

        <MetaTagsProvider />
        <meta name="google-site-verification" content="ctYiVgIDqF93EFA9K-KPFNJsRgtSRLa3m8JrZsxpiw4" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-757587162" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-757587162');`}}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6674406373472669"
          crossOrigin="anonymous"
        />

        <script dangerouslySetInnerHTML={{
          __html: `function gtag_report_conversion(url) {
        var callback = function () {
          if (typeof(url) != 'undefined') {
            window.location = url;
          }
        };
        gtag('event', 'conversion', {
            'send_to': 'AW-757587162/vE9bCKuSxa4ZENq5n-kC',
            'event_callback': callback
        });
        return false;
      }`
        }} />


        <script dangerouslySetInnerHTML={{
          __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:4972560,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `
        }} />
        <meta property="og:site_name" content="Wordpanda" />
        <meta property="og:title" content="Wordpanda" />
        <meta property="og:description" content="Fique preparado para ver seus filmes e aumente seu vocabulário!" />
        <meta property="og:image" content="https://www.wordpanda.app/assets/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:updated_time" content="1440432930" />
        <link
          rel="preload"
          href="/fonts/Stand-Alone.otf"
          as="font"
          type="font/opentype"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>
            <EventProvider />
            <InformationProvider />
            <QueryParamProvider />
          </Suspense>
          <ErrorBoundary errorComponent={Error}>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html >
  )
}
