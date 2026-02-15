'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '../../../utils/supabase/client';
import { useAdmin } from '../../../contexts/AdminContext';
import adminUI from '../adminUI.module.css';


export default function AdminHomePage() {
  useAdmin();
  const supabase = createClient();
  const sections = [
    {
      type: 'posts',
      title: 'POSTS',
      listHref: '/admin/list?type=posts',
      newHref: '/admin/new-post',
      countLabel: 'Total Posts',
    },
    {
      type: 'electives',
      title: 'ELECTIVES',
      listHref: '/admin/list?type=electives',
      newHref: '/admin/new-content?type=electives',
      countLabel: 'Total Electives',
    },
    {
      type: 'clubs',
      title: 'CLUBS',
      listHref: '/admin/list?type=clubs',
      newHref: '/admin/new-content?type=clubs',
      countLabel: 'Total Clubs',
    },
    {
      type: 'links',
      title: 'LINKS',
      listHref: '/admin/list?type=links',
      newHref: '/admin/new-content?type=links',
      countLabel: 'Total Links',
    },
  ];

  const types = sections.map((section) => section.type);

  const [typeCounts, setTypeCounts] = useState(() =>
    types.reduce((accumulator, type) => {
      accumulator[type] = 0;
      return accumulator;
    }, {})
  );

  async function getEntryCount(type) {
    try {
      const { data, error, count } = await supabase
        .from(type)
        .select('id', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching data:', error);
        return 0; // or handle the error as needed
      }

      return count;
    } catch (error) {
      console.error('Error in getEntryCount:', error);
      return 0; // or handle the error as needed
    }
  }
  useEffect(() => {
    async function fetchCounts() {
      const counts = await Promise.all(types.map(async (type) => {
        const count = await getEntryCount(type);
        return { type, count };
      }));

      setTypeCounts(
        counts.reduce((accumulator, { type, count }) => {
          accumulator[type] = count;
          return accumulator;
        }, {})
      );
    }

    fetchCounts();
  }, []);
  return (
    <div className='adminPageWrapper'>
      <div className={adminUI.pageInner}>
        <h1 className={`${adminUI.pageTitle} pageTitle`}>ADMIN HOME</h1>
        <div className={adminUI.cardGrid}>
          {sections.map((section) => (
            <div key={section.type} className={adminUI.card}>
              <div className={adminUI.cardHeader}>
                <Link href={section.listHref}>
                  <h2 className={adminUI.cardTitleLink}>{section.title}</h2>
                </Link>

                <Link href={section.newHref} className={adminUI.primaryAction}>
                  <FontAwesomeIcon icon={faAdd} className={adminUI.primaryActionIcon} />
                  <span>New</span>
                </Link>
              </div>

              <div className={adminUI.cardBody}>
                <p className={adminUI.metaLine}>{`${section.countLabel}: ${typeCounts[section.type] ?? 0}`}</p>
                <Link href={section.listHref} className={adminUI.secondaryLink}>View all</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}