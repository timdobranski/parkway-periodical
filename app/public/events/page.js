'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '../../../utils/supabase/client';
import styles from './events.module.css';
import dateFormatter from '../../../utils/dateFormatter';
import timeFormatter from '../../../utils/timeFormatter';

export default function EventsPage() {
  const supabase = createClient();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in "YYYY-MM-DD" format
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gt('date', currentDate); // Filter to get rows where date is greater than the current date

      if (error) {
        console.error('Error fetching events:', error);
      }

      if (data) {
        setData(data);
      }
    };

    getData();
  }, [])


  return (
    <div className='feedWrapper'>
      <div className={`slideUp`}>
        <h1 className='whiteTitle'>EVENTS</h1>
        {data.length ? <p className='centeredWhiteText marginBelow'>{`Check out everything going on at Parkway!`}</p> : null}
        {data.length ? data.map((item, index) => {
          return (
            <div className={styles.itemWrapper} key={index}>
              <div className={styles.infoWrapper}>
                {<p className={`whiteSubTitle ${styles.title}`}>{item.title}</p>}
                {item.date && <p className={`centeredWhiteText ${styles.date}`}>{dateFormatter(item.date)}</p>}
                { item.startTime && <p className={`centeredWhiteText ${styles.startTime}`}>{`${timeFormatter(item.startTime)}${item.endTime && ' - ' + timeFormatter(item.endTime)}`}</p>}
                <div className={styles.divider}></div>
              </div>
              <div className={styles.contentWrapper}>
                {item.url && <Link href={item.url} className='whiteSubTitle centeredText'>{item.title}</Link>}
                {item.description && <p className={`centeredWhiteText ${styles.description}`}>{item.description}</p>}
              </div>
            </div>
          )
        }) :
          <div className={'centeredWhiteText'}>{`It looks like there aren't currently any events scheduled.`}</div>}
      </div>
    </div>
  )
}