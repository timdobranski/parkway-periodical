'use client'

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { createClient } from '../../../utils/supabase/client';
import styles from './home.module.css';
import Video from '../../../components/Video/Video';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';
import PhotoCarousel from '../../../components/PhotoCarousel/PhotoCarousel';
import PrimeText from '../../../components/PrimeText/PrimeText';
import WelcomeSlideshow from '../../../components/WelcomeSlideshow/WelcomeSlideshow';
import SearchAndFilterBar from '../../../components/SearchAndFilterBar/SearchAndFilterBar';
import PostTitle from '../../../components/PostTitle/PostTitle';
import dateFormatter from '../../../utils/dateFormatter';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft, faShare, faCalendarDays, faPen, faGear } from '@fortawesome/free-solid-svg-icons';
import { useRouter, usePathname } from 'next/navigation';
import useOnlineStatus from '../../../utils/useOnlineStatus';
import { useAdmin } from '../../../contexts/AdminContext';



export default function Home({ introRunning, setIntroRunning }) {
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser, authUser, setAuthUser } = useAdmin();
  const supabase = createClient();
  const isOnline = useOnlineStatus();
  const [posts, setPosts] = useState([]);
  const searchParams = useSearchParams();
  const [tagId, setTagId] = useState(null)
  const [searchQuery, setSearchQuery] = useState(null);
  const [displayType, setDisplayType] = useState('all') // options are: all, id, tag, search
  const [postTags, setPostTags]  = useState([]);
  const [showLinkCopied, setShowLinkCopied] = useState(false);
  const router = useRouter();
  let postId = searchParams.get('postId');
  const pathname = usePathname();


  // const skipIntro = useSearchParams('skipIntro');
  // const [introRunning, setIntroRunning] = useState(true);

  // get and set user, tags, and posts
  useEffect(() => {
    getTags();
    getPosts({ tagId, searchQuery, postId });
  }, [tagId, searchQuery, postId ]);


  // get and parse post data
  const getPosts = async ({ tagId, searchQuery, postId } = {}) => {
    let query = supabase
      .from('posts')
      .select('*');

    if (tagId) {
      console.log('TAG ID: ', tagId)
      {postId && removeQueryString()}
      setSearchQuery(null);
      postId = null;
      // setDisplayType('tag');
      // Fetch post IDs from post_tags where tag_id matches
      const { data, error: postTagError } = await supabase
        .from('post_tags')
        .select('post')
        .eq('tag', tagId);

      if (postTagError) {
        console.error('Error fetching post tags:', postTagError);
        return;
      }
      const postTagData = data;
      const postIds = postTagData.map(pt => pt.post);
      query = query.in('id', postIds);
    } else if (searchQuery) {
      setTagId(null)
      setDisplayType('search');
      query = query.ilike('searchableText', `%${searchQuery}%`);
    } else if (postId) {
      console.log('POST ID REGISTERED: ', postId)
      setDisplayType('id');
      query = query.eq('id', postId);
    } else {
      setDisplayType('all');
      query = query.order('id', { ascending: false });
    }

    const { data, error } = await query;
    if (data) {
      const parsedData = data.map(post => ({
        ...post,
        content: JSON.parse(post.content)
      }));

      // console.log('new posts state: ', parsedData);
      setPosts(parsedData);
    }

    if (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // get post tags
  const getTags = async () => {
    const { data, error } = await supabase.from('tags').select('*');
    if (data) {
      console.log('tags: ', data);
      setPostTags([{name: 'All Posts', id: 'all'}, ...data]);
    }
    if (error) {
      console.error('Error fetching tags:', error);
    }
  };
  // helper to remove post ID query string
  const removeQueryString = () => {
    postId = null;
    router.push(pathname);
  };
  // get posts with tag id when tag ID changes
  useEffect(() => {
    if (tagId) {
      getPosts({ tagId, searchQuery, postId });
    } else {
      getPosts({ tagId, searchQuery, postId })
    }
  }, [tagId]);
  // get posts with postId when postId changes
  useEffect(() => {
    if (postId) {
      getPosts({postId: postId});
    }
  }, [postId]);


  const handleFilterChange = (event) => {
    console.log('inside handle filter change')
    const value = event.target.value;
    console.log('value: ', value);
    setTagId(value === 'all' ? null : parseInt(value));
  };
  const noResultsMessage = (
    <p className={styles.noResultsMessage}>{`It looks like there aren't any posts for this ${displayType === 'search' ? 'search' : 'category'} yet`}</p>
  )
  // reset posts to all
  const resetPosts = () => {
    setTagId(null);
    setSearchQuery(null);
    getPosts();
    removeQueryString();
  }

  // copy post url to clipboard
  const handleShareClick = (id) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/public/home/?postId=${id}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShowLinkCopied(id);
        setTimeout(() => {
          setShowLinkCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy the link: ', err);
      });
  };



  const renderedPosts = (
    <>
    {/* <div className='slideUp'> */}


      {searchQuery &&
        <>
          <p className={styles.searchStatus} style={ searchQuery ? {display: 'inline-block'} : {display: 'none'}}>
            {`Search results for "${searchQuery}"`}
          </p>
        </>
      }
      {tagId &&
        <>
          <p className={styles.viewingPostsMessage}>{`Viewing posts tagged as `}
            <span className={styles.tagLabel}>
              {postTags.find(tag => tag.id === tagId).name}
            </span>
          </p>
        </>
      }
      {/* {postId &&
        <>
          <p className={styles.viewingPostsMessage}>{`Viewing post #${postId} `}
          </p>
        </>
      } */}
      {posts && posts.length === 0 && noResultsMessage}
      {postId || tagId || searchQuery ?
        <button className={styles.viewStatusButton} onClick={resetPosts}>View All Posts
        </button> : null
      }


      {posts &&
    posts.map((post, i) => (
      <div className='post' key={i}>
        {user && post.author === user.id &&
              <button
                className={styles.editPostButton}
                onClick={() => router.push(`/admin/new-post/?postId=${post.id}`)}
              >
                <FontAwesomeIcon icon={faGear} className={styles.editPostIcon}/>
              </button>
        }
        {post.content.map((block, index) => (
          <React.Fragment key={index}>
            {block.type === 'title' && (
              <PostTitle
                src={block}
                authorId={post.author}
                id={post.id}
                viewContext='view'
              />
            )
            }
            {block.type === 'text' && (
              <div className='blockWrapper'>
                <PrimeText
                  src={block}
                  viewContext='view'
                />
              </div>
            )}
            {block.type === 'photo' && (
              <div className='blockWrapper'>
                <PhotoBlock
                // key={index}
                // blockIndex={index}
                // updatePhotoContent={(files) => updatePhotoContent(index, files)}
                  isEditable={false}
                  photo={block.content[0]}
                // setActiveBlock={setActiveBlock}
                />
              </div>
            )}
            {block.type === 'carousel' && (
              <div className='blockWrapper'>
                <PhotoCarousel
                  photos={block.content}
                />
              </div>
            )}
            {block.type === 'video' && (
              <div className='blockWrapper'>
                <Video
                  src={block}
                />
              </div>
            )}
          </React.Fragment>
        ))}
        <div className={styles.postFooter}>
          <p className={`${styles.linkCopyConfirm} ${showLinkCopied === post.id ? styles.show : ''}`}>Link copied!</p>
          <div className={styles.createdAtWrapper}>
            <FontAwesomeIcon icon={faCalendarDays} className={styles.createdAtIcon} />
            <p className={styles.createdAt}>{dateFormatter(post.created_at)}</p>
          </div>
          <div className={styles.shareWrapper}
            onClick={() => handleShareClick(post.id)}
          >
            <FontAwesomeIcon icon={faShare} className={styles.shareIcon} />
            <p className={styles.shareLabel}>Share</p>
          </div>
        </div>
      </div>

    ))}
    {/* </div> */}
    </>
  );


  if (!isOnline) {
    return (
      <p className={styles.offlineMessage}>{`It looks like you're offline. Check your internet connection, and try refreshing the page.`}</p>
    )
  }

  return (
    <div className='feedWrapper' >
      <div className={`slideUp`}>
      <WelcomeSlideshow />
      <SearchAndFilterBar
        postTags={postTags}
        tagId={tagId}
        setTagId={setTagId}
        handleFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        setSearch={setSearchQuery}
        getPosts={getPosts}
      />
      { introRunning ? null : renderedPosts}
      </div>
    </div>
  );
}
