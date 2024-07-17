'use client'

import getPosts from '../../../utils/getPosts';
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
import { faShare, faCalendarDays, faGear } from '@fortawesome/free-solid-svg-icons';
import { useRouter, usePathname } from 'next/navigation';
import useOnlineStatus from '../../../utils/useOnlineStatus';
import { useAdmin } from '../../../contexts/AdminContext';


export default function Home({ introRunning, setIntroRunning }) {
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser, authUser, setAuthUser } = useAdmin();
  const supabase = createClient();
  const isOnline = useOnlineStatus();
  const searchParams = useSearchParams();
  const [postTags, setPostTags]  = useState([]);
  const [showLinkCopied, setShowLinkCopied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  let postId = searchParams.get('postId');
  const schoolYear = '2024-25';

  // FETCHING & RENDERING POSTS
  const [displayType, setDisplayType] = useState('recent') // options are: recent, id, category, search
  const [addPostsHandler, setAddPostsHandler] = useState(null);

  const [posts, setPosts] = useState([]); // the array of posts which will be rendered

  const [recentPosts, setRecentPosts] = useState([]); // default array of recent posts if no tag or search query

  const [searchQuery, setSearchQuery] = useState(null);
  const [searchResultPosts, setSearchResultPosts] = useState([]); // separate array of posts from search results

  const [tagId, setTagId] = useState(null)
  const [tagResultPosts, setTagResultPosts] = useState([]); // separate array of posts from tag results

  const postFetchLimit = 1;
  const [noMorePosts, setNoMorePosts] = useState(false);

  useEffect(() => {
    setNoMorePosts(false);
    if (displayType === 'recent') {
      setAddPostsHandler(addToRecentPosts);
    }
    if (displayType === 'category') {
      setAddPostsHandler(addToTagResultPosts);
    }
    if (displayType === 'search') {
      setAddPostsHandler(null);
    }
  }, [displayType])

  // if more posts are fetched from a tag, add them to the main posts array
  useEffect(() => {
    if (tagResultPosts.length > 0) {
      setPosts(tagResultPosts);
    }
  }, [tagResultPosts])
  // if more posts are fetched for the general feed, add them to the main posts array
  useEffect(() => {
    if (recentPosts.length > 0) {
      setPosts(recentPosts);
    }
  }, [recentPosts])
  // on page mount, if there's no postId, add recent posts to the feed
  useEffect(() => {
    if (!postId) {
      addToRecentPosts()
    }
  }, [])

  // when user selects post category, get posts with that tag
  useEffect(() => {
    if (tagId) {
      setDisplayType('category')
      addToTagResultPosts();
    } else {
      resetPosts();
    }
  }, [tagId]);

  // get posts with postId when postId changes
  useEffect(() => {
    if (postId) {
    }
  }, [postId]);


  // get and set posts from tag ID
  const addToTagResultPosts = async () => {
    const getMorePostsByTagId = async (schoolYear, tagId, lastId) => {
      let query = supabase
        .from('posts')
        .select('*, post_tags!inner(post)')
        .eq('post_tags.tag', tagId)

        .eq('schoolYear', schoolYear)
        .order('id', { ascending: false })
        .limit(postFetchLimit)

      // Only apply the 'less than' filter if lastId is provided and not null
      if (lastId != null) {
        query = query.lt('id', lastId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching posts:', error)
        return null
      }
      if (data.length < postFetchLimit) {
        setNoMorePosts(true);
      }
      const parsedData = data.map(post => ({ ...post, content: JSON.parse(post.content) }))

      return parsedData
    }

    const lastPostId = tagResultPosts.length ? tagResultPosts[tagResultPosts.length - 1].id : null;
    const taggedPosts = await getMorePostsByTagId(schoolYear, tagId, lastPostId);

    if (taggedPosts) {
      setTagResultPosts([...tagResultPosts, ...taggedPosts]);
    } else {
      console.log('NO POSTS RETURNED')
    }
  }
  // get category tags on page load
  useEffect(() => {
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
    getTags();
  }, []);

  const addToRecentPosts = async () => {
    const getRecentPosts = async (schoolYear, lastId) => {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('schoolYear', schoolYear)
        .order('id', { ascending: false })
        .limit(postFetchLimit)

      // Only apply the 'less than' filter if lastId is provided and not null
      if (lastId != null) {
        query = query.lt('id', lastId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching posts:', error)
        return null
      }
      if (data.length < postFetchLimit) {
        setNoMorePosts(true);
      }
      const parsedData = data.map(post => ({ ...post, content: JSON.parse(post.content) }))

      return parsedData
    }

    const lastPostId = recentPosts.length ? recentPosts[recentPosts.length - 1].id : null;
    const newRecentPosts = await getRecentPosts(schoolYear, lastPostId);

    if (newRecentPosts) {
      setRecentPosts([...recentPosts, ...newRecentPosts]);
    } else {
      console.log('NO POSTS RETURNED')
    }
  }
  // helper to remove post ID query string from url when navigating away from a single post view
  const removeQueryString = () => {
    postId = null;
    router.push(pathname);
  };
  const handleFilterChange = (event) => {
    console.log('inside handle filter change')
    const value = event.target.value;
    console.log('value: ', value);
    setTagId(value === 'all' ? null : parseInt(value));
  };
  const noResultsMessage = (
    <p className={styles.noResultsMessage}>{`It looks like there aren't any posts for this ${displayType === 'search' ? 'search' : 'category'} yet`}</p>
  )
  // should run when 'view all posts' button is clicked or when all is selected from the dropdown
  const resetPosts = () => {

    setDisplayType('recent');

    if (tagId) {setTagId(null);} // if run from the dropdown, will already be null. if run from button, will be set to null

    setSearchQuery(null);

    if (postId) {removeQueryString();}
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
  const handleAddPosts = () => {
    if (displayType === 'recent') {
      addToRecentPosts();
    }
    if (displayType === 'category') {
      addToTagResultPosts();
    }
    if (displayType === 'search') {
      addToSearchResultPosts();
    }
  }

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
        {noMorePosts ?
          <p className='centeredWhiteText'>{`You've reached the end! No more posts to display.`}</p>
          :
          <button className={styles.viewStatusButton} onClick={handleAddPosts}>Fetch More Posts</button>}

      </div>
    </div>
  );
}
