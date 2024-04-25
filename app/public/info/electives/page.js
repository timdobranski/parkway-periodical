'use client'

import styles from './electives.module.css'
import ElectiveBlock from '../../../../components/ElectiveBlock/ElectiveBlock'
import { useState, useEffect } from 'react';
import supabase from '../../../../utils/supabase';

export default function Electives() {
  const [electivesData, setElectivesData] = useState([]);
  const [selectedPathway, setSelectedPathway] = useState('All');
  const [pathways, setPathways] = useState(['Business Technology & Design Pathway', 'Engineering & Design Pathway', 'Medical Pathway', 'Traditional Electives']);
  const oldElectivesData = [
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
      image: '/images/electives/marineBio2.webp'
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
  useEffect(() => {
    const getElectives = async () => {
      const { data, error } = await supabase
        .from('electives')
        .select('*');

      if (error) {
        console.error('Error fetching electives:', error);
      }

      if (data) {
        console.log('electives data:', data)
        setElectivesData(data);
      }
    }
    getElectives();
  }, [])
  const handleChange = (event) => {
    setSelectedPathway(event.target.value);
  };

  if (!electivesData.length) {
    return <div>Loading...</div>
  }

  return (
    <div className='feedWrapper'>
      {/* <div className={`slideUp`}> */}
      <h1 className='whiteTitle'>ELECTIVES</h1>
      <p className={styles.pageTitle}>Check out all our amazing student elective courses this year, or browse them by pathway!</p>

      <div className={styles.selectPathwayWrapper}>
        <select value={selectedPathway} onChange={handleChange} className={styles.selectPathway}>
          <option value="All">All</option>
          {pathways.map((pathway, index) => (
            <option key={index} value={pathway}>{pathway}</option>
          ))}
        </select>
      </div>

      {electivesData.map((elective, index) => {
        return (
          <ElectiveBlock
            key={index}
            electiveData={elective}
            color={index % 2 === 0 ? 'blue' : 'red'}
          />
        )
      })}

      {/* </div> */}
    </div>
  )
}