import Header from '../../components/Header/Header'
import { Gallery } from 'react-grid-gallery';

export default function PublicLayout({ children }) {

  const images = [
    { src: '/images/intro/1.png', width: 320, height: 212,  },

  ];

  return (

      <>
        <Header />
        <div className='publicPageWrapper'>
          {children}
        </div>
      </>

  )
}
