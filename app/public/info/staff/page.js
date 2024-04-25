'use client'

import styles from './staff.module.css'
import supabase from '../../../../utils/supabase';
import { useState, useEffect } from 'react';
import StaffBlock from '../../../../components/StaffBlock/StaffBlock';


export default function StaffPage() {
  const [staffData, setStaffData] = useState([]);
  const departments = ['Administration', 'Counseling', 'English', 'Fine Arts', 'Foreign Language', 'Math', 'Physical Education', 'Science', 'Social Studies', 'Special Education', 'Technology', 'Other'];
  const [selectedDepartment, setSelectedDepartment] = useState('All');

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
  const handleChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  return (
    <div className='feedWrapper'>
      {/* <div className='post'> */}
      <h1 className='whiteTitle'>MEET OUR TEAM</h1>

      <p className='centeredWhiteText'>Just a few of the people who make Parkway a great place to go to school! Browse all, or filter by department</p>

      <div className={styles.selectDepartmentWrapper}>
        <select value={selectedDepartment} onChange={handleChange} className={styles.selectDepartment}>
          <option value="All">All</option>
          {departments.map((department, index) => (
            <option key={index} value={department}>{department}</option>
          ))}
        </select>
      </div>

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