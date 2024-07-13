import './globals.css'
import { AdminProvider } from '../contexts/AdminContext';


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
          <AdminProvider>
            {children}
          </AdminProvider>
        </div>
      </body>
    </html>
  )
}
