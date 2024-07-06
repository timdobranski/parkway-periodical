'use client'

import styles from './links.module.css'
import { useState, useEffect } from 'react';
import supabase from '../../../../utils/supabase';
import Link from 'next/link';


export default function LinksPage() {

  const [linksData, setLinksData] = useState([]);

  useEffect(() => {
    const getLinks = async () => {
      const { data, error } = await supabase
        .from('links')
        .select('*');

      if (error) {
        console.error('Error fetching links:', error);
      }

      if (data) {
        console.log('links data:', data)
        setLinksData(data);
      }
    }
    getLinks();
  }, [])

  if (!linksData.length) {
    return <div>{`It looks like there aren't any links added yet.`}</div>
  }

  return (
    <div className='feedWrapper'>
      <h1 className='whiteTitle'>RESOURCES</h1>
      <p className='centeredWhiteText marginBelow'>{`Below you'll find links to helpful resources for Parkway families:`}</p>
      {linksData.map((link, index) => {
        return (
          <div className={styles.linkWrapper} key={index}>
            <Link href={link.url} className='whiteSubTitle centeredText'>{link.title}</Link>
            {link.description && <p className='centeredWhiteText'>{link.description}</p>}
          </div>
        )
      })}
    </div>
  )

}