'use client'

import styles from './electives.module.css'
import Elective from '../../../components/ElectiveOrClub/ElectiveOrClub'
import ElectiveMobile from '../../../components/ElectiveOrClubMobile/ElectiveOrClubMobile'
import { useState, useEffect, Fragment } from 'react';
import { createClient } from '../../../utils/supabase/client';

export default function Electives() {
  const supabase = createClient();
  const [electivesData, setElectivesData] = useState([]);
  const [selectedPathway, setSelectedPathway] = useState('All');
  const [pathways, setPathways] = useState(['Business Technology & Design Pathway', 'Engineering & Design Pathway', 'Medical Pathway', 'Traditional Electives']);

  // fetch all electives on page load
  useEffect(() => {
    const getElectives = async () => {
      const { data, error } = await supabase
        .from('electives')
        .select('*');

      if (error) {
        console.error('Error fetching electives:', error);
      }

      if (data) {
        console.log('electives data:', data);
        setElectivesData(data);
      }
    }

    getElectives();
  }, []);


  const handleChange = (event) => {
    setSelectedPathway(event.target.value);
  };

  const filteredElectives = electivesData.filter(elective =>
    selectedPathway === 'All' || elective.pathway === selectedPathway
  );

  return (
    <div className='feedWrapper'>
      <div className={`slideUp`}>
        <h1 className='whiteTitle'>ELECTIVES</h1>
        <div className='selectWrapper'>
          <select value={selectedPathway} onChange={handleChange} className='selectContent'>
            <option value="All">All</option>
            {pathways.map((pathway, index) => (
              <option key={index} value={pathway}>{pathway}</option>
            ))}
          </select>
        </div>

        {filteredElectives.length > 0 ? (
          <>
            <p className={styles.pageTitle}>
              Check out all our amazing student elective courses this year, or browse them by pathway!
            </p>

            <>
              {filteredElectives.map((elective, index) => (
                <Fragment key={index}>
                  <Elective
                    data={elective}
                    titleSide={index % 2 === 0 ? 'left' : 'right'}
                  />
                  <ElectiveMobile
                    data={elective}
                    titleSide={index % 2 === 0 ? 'left' : 'right'}
                  />
                </Fragment>
              ))}
            </>
          </>
        ) : (
          selectedPathway === 'All' ? (
            <p className='centeredWhiteText'>{`All this year's new electives coming soon!`}</p>
          ) : (
            <p className='centeredWhiteText'>{`No electives found for ${selectedPathway}`}</p>
          )
        )}
      </div>
    </div>
  );

}