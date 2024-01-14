import Header from '../../components/Header/Header'


export default function PublicLayout({ children }) {
  return (

      <div className='appContainer'>
        <Header />
        {children}
      </div>

  )
}
