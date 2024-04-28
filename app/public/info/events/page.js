'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import supabase from '../../../../utils/supabase';
import styles from './events.module.css';
import dateFormatter from '../../../../utils/dateFormatter';
import timeFormatter from '../../../../utils/timeFormatter';

export default function EventsPage() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Error fetching links:', error);
      }

      if (data) {
        setData(data);
      }
    }
    getData();
  }, [])

  if (!data.length) {
    return <div>{`It looks like there aren't any events added yet.`}</div>
  }
  return (
    <div className='feedWrapper'>
      <h1 className='whiteTitle'>EVENTS</h1>
      <p className='centeredWhiteText marginBelow'>{`Check out everything going on at Parkway!`}</p>
      {data.map((item, index) => {
        return (
          <div className={styles.itemWrapper} key={index}>
            <div className={styles.infoWrapper}>
              {<p className={`whiteSubTitle ${styles.title}`}>{item.title}</p>}
              {item.date && <p className={`centeredWhiteText ${styles.date}`}>{dateFormatter(item.date)}</p>}
              <p className={`centeredWhiteText ${styles.startTime}`}>{`${timeFormatter(item.startTime)} - ${timeFormatter(item.endTime)}`}</p>
              <div className={styles.divider}></div>
            </div>
            <div className={styles.contentWrapper}>
              {item.url && <Link href={item.url} className='whiteSubTitle centeredText'>{item.title}</Link>}
              {item.description && <p className={`centeredWhiteText ${styles.description}`}>{item.description}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}