import './globals.css'
import Header from '../components/Header/Header'


export const metadata = {
  title: 'Parkway Periodical',
  description: 'News And Parkway Academy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='appContainer'>
        <Header />
        {children}
      </body>
    </html>
  )
}
