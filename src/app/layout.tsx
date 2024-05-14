import EventProvider from '@providers/EventProvider'
import InformationProvider from '@providers/InformationProvider'
import { QueryParamProvider } from '@providers/QueryParamProvider'
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
  description: `Explore uma nova abordagem envolvente para aprender idiomas com nosso site inovador. Descubra como integrar o aprendizado de idiomas com suas atividades de streaming favoritas, aproveitando legendas de filmes e séries para aprimorar suas habilidades linguísticas. Com uma plataforma abrangente que inclui jogos interativos, estatísticas detalhadas de progresso e suporte a múltiplos idiomas, nosso site oferece uma experiência personalizada e divertida para estudantes de todos os níveis. Aproveite uma jornada de aprendizado envolvente e eficaz, onde assistir a filmes se torna uma oportunidade de aprimorar suas habilidades linguísticas. Comece sua aventura de aprendizado conosco hoje!`,
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-757587162"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-757587162');`}}
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
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport"
          content="width=device-width, height=device-height,  initial-scale=1.0,  maximum-scale=1.0, user-scalable=no; user-scalable=0;"
        />

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
      <body
        className={poppins.className}
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

      </body>
    </html >
  )
}
