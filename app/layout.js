import './globals.css'
import Header from '../components/Header/Header'


export const metadata = {
  title: 'Parkway Periodical',
  description: 'News And Parkway Academy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Header />

      <body>{children}</body>
    </html>
  )
}
