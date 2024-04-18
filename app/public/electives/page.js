import styles from './electives.module.css'
import ElectiveBlock from '../../../components/ElectiveBlock/ElectiveBlock'

export default function Electives() {
  const electivesData = [
    {
      title: 'Engineering & Skateboarding Design',
      description: `The design and construction of skateboard decks, ramps, and skateparks includes a lot of
      engineering! In this class you will learn all about foundational engineer concepts, use
      design/engineering software, and maybe learn how to do an ollie!!!`,
      cte: true,
      type: 'Trimester/Cycle',
      image: '/images/electives/sciOfSkate3.webp'
    },
    {
      title: 'Marine Biology',
      description: `If you want to learn to dance or if you are already a pro - This is the class for you! By joining this
      class you become a member of the PKMS Hip Hop Dance Crew! You will learn the
      fundamentals of hip hop dance and choreography. But, it isn't just learning in the studio - You
      are going to perform at PKMS events throughout the year! *No Experience Required
      (Possible Field Trip: High School Dance Program)`,
      cte: false,
      type: 'Year Long',
      image: '/images/electives/marineBio.webp'
    },
    {
      title: 'Hip Hop Dance',
      description: `If you want to learn to dance or if you are already a pro - This is the class for you! By joining this
      class you become a member of the PKMS Hip Hop Dance Crew! You will learn the
      fundamentals of hip hop dance and choreography. But, it isn't just learning in the studio - You
      are going to perform at PKMS events throughout the year! *No Experience Required
      (Possible Field Trip: High School Dance Program)`,
      cte: false,
      type: 'Year Long',
      image: '/images/electives/hipHopDance.webp'
    },

  ];


  return (
    <div className='feedWrapper'>
      <h1 className={styles.pageTitle}>Check out our amazing student elective courses this year!</h1>
      {electivesData.map((elective, index) => {
        return (
          <ElectiveBlock
            key={index}
            electiveData={elective}
            color={index % 2 === 0 ? 'blue' : 'red'}
          />
        )
      })}

    </div>
  )
}