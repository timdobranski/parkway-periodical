'use client'

import styles from './staff.module.css'
import supabase from '../../../../utils/supabase';
import { useState, useEffect } from 'react';
import StaffBlock from '../../../../components/StaffBlock/StaffBlock';


export default function StaffPage() {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    const getStaff = async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*');

      if (error) {
        console.error('Error fetching staff:', error);
      }

      if (data) {
        console.log('staff data:', data)
        setStaffData(data);
      }
    }
    getStaff();
  }, [])

  return (
    <div className='feedWrapper'>
      {/* <div className='post'> */}
        <h1 className='whiteTitle'>MEET OUR TEAM</h1>
        {staffData.map((staff, index) => {
          return (
            <StaffBlock
              key={index}
              staff={staff}
              // color={index % 2 === 0 ? 'blue' : 'red'}
            />
          )
        })}
      {/* </div> */}
    </div>
  )

}