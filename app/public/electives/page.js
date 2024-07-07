'use client'

import styles from './electives.module.css'
import ElectiveBlock from '../../../components/ElectiveBlock/ElectiveBlock'
import { useState, useEffect } from 'react';
import supabase from '../../../utils/supabase';

export default function Electives() {
  const [electivesData, setElectivesData] = useState([]);
  const [selectedPathway, setSelectedPathway] = useState('All');
  const [pathways, setPathways] = useState(['Business Technology & Design Pathway', 'Engineering & Design Pathway', 'Medical Pathway', 'Traditional Electives']);

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


  return (
    <div className='feedWrapper'>
      <div className={`slideUp`}>
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

      {electivesData.map && electivesData.map((elective, index) => {
        return (
          <ElectiveBlock
            key={index}
            electiveData={elective}
            color={index % 2 === 0 ? 'blue' : 'red'}
          />
        )
      })}

      </div>
    </div>
  )
}