'use client'

import styles from './links.module.css'
import { useState, useEffect } from 'react';
import { createClient }from '../../../utils/supabase/client';
import Link from 'next/link';


export default function LinksPage() {
  const supabase = createClient();
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


  return (
    <div className='feedWrapper'>
      <div className={`slideUp`}>
        <h1 className='whiteTitle'>LINKS</h1>
        <p className='centeredWhiteText marginBelow'>{`Below you'll find links to helpful resources for Parkway families:`}</p>
        <div className='selectWrapper'>
        <select className='selectContent'>
          <option value="default">All Resources</option>
          <option value="default">ESS</option>
          <option value="default">Library</option>
          <option value="default">PE</option>
        </select>
        </div>
        {linksData.length ? linksData.map((link, index) => {
          return (
            <div className={styles.linkWrapper} key={index}>
              <Link href={link.url} className='whiteSubTitle centeredText'>{link.title}</Link>
              {link.description && <p className='centeredWhiteText'>{link.description}</p>}
            </div>
          )
        }) :
          <div className='centeredWhiteText'>{`It looks like there aren't currently any links available.`}</div>}
      </div>
    </div>
  )

}