'use client'

import styles from './clubs.module.css'
import ElectiveBlock from '../../../../components/ElectiveBlock/ElectiveBlock'
import { useState, useEffect } from 'react';
import supabase from '../../../../utils/supabase';

export default function ClubsPage() {
  const [clubsData, setClubsData] = useState([]);


  useEffect(() => {
    const getElectives = async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('*');

      if (error) {
        console.error('Error fetching electives:', error);
      }

      if (data) {
        console.log('electives data:', data)
        setClubsData(data);
      }
    }
    getElectives();
  }, [])

  if (!clubsData.length) {
    return <div>{`It looks like there aren't any clubs added yet.`}</div>
  }

  return (
    <div className='feedWrapper'>
      <h1 className='whiteTitle'>BEFORE & AFTER SCHOOL CLUBS</h1>

      {clubsData.map((club, index) => {
        return (
          <ElectiveBlock
            key={index}
            electiveData={club}
            color={index % 2 === 0 ? 'blue' : 'red'}
          />
        )
      })}
    </div>
  )
}