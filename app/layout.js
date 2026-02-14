import './globals.css'
import { Suspense } from 'react';
import { AdminProvider } from '../contexts/AdminContext';
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const GA_MEASUREMENT_ID = 'G-6QX4YMTYQK';

export const metadata = {
  metadataBase: new URL(
    siteUrl
      ? (siteUrl.startsWith('http://') || siteUrl.startsWith('https://')
          ? siteUrl
          : siteUrl.startsWith('localhost')
            ? `http://${siteUrl}`
            : `https://${siteUrl}`)
      : 'http://localhost:3000'
  ),
  title: 'Parkway Periodical',
  description: 'News & Updates from Parkway Academy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body>
        <div className='background'>
          <Analytics />
          <AdminProvider>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </AdminProvider>
        </div>
      </body>
    </html>
  )
}
