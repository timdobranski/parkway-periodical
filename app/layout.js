import './globals.css'
import Header from '../components/Header/Header'

export const metadata = {
  title: 'Parkway Periodical',
  description: 'Weekly Updates At Parkway Academy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='appContainer'>
        {children}

        </div>
      </body>
    </html>
  )
}
