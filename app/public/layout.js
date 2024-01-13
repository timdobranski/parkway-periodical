import Header from '../../components/Header/Header'


export default function RootLayout({ children }) {
  return (

      <div className='appContainer'>
        <Header />
        {children}
      </div>

  )
}
