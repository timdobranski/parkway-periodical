import './globals.css'
import { Suspense } from 'react';
import { AdminProvider } from '../contexts/AdminContext';
import { Analytics } from "@vercel/analytics/react"


const url = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  metadataBase: new URL(url),
  title: 'Parkway Periodical',
  description: 'News & Updates from Parkway Academy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
