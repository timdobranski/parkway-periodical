import './globals.css'

export const metadata = {
  title: 'Parkway Periodical',
  description: 'News & Updates from Parkway Academy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='background'>
          {children}
        </div>
      </body>
    </html>
  )
}
