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
import ContentLayout from '../../../components/ContentLayout/ContentLayout';
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
  const [postId, setPostId] = useState(searchParams.get('postId'));
  const feedWrapperRef = useRef(null);
  const schoolYear = '2024-25';

  // FETCHING & RENDERING POSTS
  const [displayType, setDisplayType] = useState('recent') // options are: recent, id, category, search
  const [addPostsHandler, setAddPostsHandler] = useState(null);

  const [posts, setPosts] = useState([]); // the array of posts which will be rendered

  const [selectedPost, setSelectedPost] = useState(null); // state to hold the post selected by ID

  const [recentPosts, setRecentPosts] = useState([]); // default array of recent posts if no tag or search query

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultPosts, setSearchResultPosts] = useState({}); // separate array of posts from search results

  const [tagId, setTagId] = useState('')
  const [tagResultPosts, setTagResultPosts] = useState({}); // separate array of posts from tag results

  const postFetchLimit = 1; // fetches this many posts on page load and again on scroll to bottom of feed
  const [noMorePosts, setNoMorePosts] = useState(false);


  // get category tags
  useEffect(() => {
    const getTags = async () => {
      const { data, error } = await supabase.from('tags').select('*');
      if (data) {
        // console.log('tags: ', data);
        setPostTags([{name: 'All Posts', id: 'all'}, ...data]);
      }
      if (error) {
        console.error('Error fetching tags:', error);
      }
    };
    getTags();
  }, [])

  // fetches new posts based on the current displayType state
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

  // detect user reaching the bottom of the feed and trigger fetching more posts
  useEffect(() => {
    const feedWrapper = feedWrapperRef.current;

    const handleScroll = () => {
      const isBottom = feedWrapper.scrollHeight - feedWrapper.scrollTop <= feedWrapper.clientHeight + 1;
      if (isBottom && !noMorePosts) {
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
    };

    if (feedWrapper) {
      feedWrapper.addEventListener('scroll', handleScroll);
      feedWrapper.addEventListener('touchmove', handleScroll); // Add touchmove listener for mobile devices
    }

    // Cleanup the event listeners
    return () => {
      if (feedWrapper) {
        feedWrapper.removeEventListener('scroll', handleScroll);
        feedWrapper.removeEventListener('touchmove', handleScroll); // Remove touchmove listener
      }
    };
  }, [handleAddPosts]);

  // USER INPUT TO TRIGGER POST FETCHING
  // when user selects post category, get posts with that tag and add to the category's post array
  useEffect(() => {
    // console.log('CATEGORY TAG CHANGED: ', tagId)
    if (tagId) {
      removeQueryString();
      addToTagResultPosts();
    } else if (tagId !== '') {
      resetPosts();
    }
  }, [tagId]);

  // when user enters a search query, get posts with that query and add to the search result array
  useEffect(() => {
    // console.log('SEARCH QUERY CHANGED: ', searchQuery)
    if (searchQuery && searchQuery !== null) {
      setDisplayType('search')
      addToSearchResultPosts();
    } else if (searchQuery !== '') {
      resetPosts();
    }
  }, [searchQuery]);


  useEffect(() => {
    // console.log('Post ID: ', postId)
    if (postId) {
      setDisplayType('id')
      const postIdNumber = parseInt(postId);
      const getPostById = async () => {
        const { data, error } = await supabase
          .from('posts')
          .select('id, content, author, created_at')
          .eq('id', postIdNumber)
          .single()

        if (error) {
          console.error('Error fetching post:', error)
          return null
        }
        const parsedData = { ...data, content: JSON.parse(data.content) }
        console.log('PARSED POST DATA: ', parsedData)
        setSelectedPost([parsedData])
      }
      getPostById(postId)
    }

  }, [postId])

  // when the type of post view changes, remove the 'no more posts' message and reset the addPosts handler to the appropriate function
  useEffect(() => {
    // console.log('DISPLAY TYPE CHANGED: ', displayType)
    setNoMorePosts(false);  // reset noMorePosts when displayType changes

    // on page load or user select, render recent unfiltered posts
    if (displayType === 'recent') {
      setAddPostsHandler(addToRecentPosts);
    }
    // if category tag is selected, render posts with that tag
    if (displayType === 'category') {
      setAddPostsHandler(addToTagResultPosts);
    }
    if (displayType === 'search') {
      setAddPostsHandler(addToSearchResultPosts);
    }
  }, [displayType])


  // WHEN NEW POSTS ARE DETECTED
  // if more posts are added to a category tag array, switch to rendering them
  useEffect(() => {
    if (tagResultPosts[tagId]) {
      setPosts(tagResultPosts[tagId]);
      setDisplayType('category')
    }
  }, [tagResultPosts])

  // if more posts are added to a search result array, switch to rendering them
  useEffect(() => {
    if (searchResultPosts[searchQuery]) {
      setPosts(searchResultPosts[searchQuery]);
    }
  }, [searchResultPosts])

  // if more posts are added to the general feed, switch to rendering them
  useEffect(() => {
    if (recentPosts.length > 0) {
      if (displayType === 'recent' && !postId) {
        setPosts(recentPosts);
      }
    }
  }, [recentPosts])

  useEffect(() => {
    setPosts(selectedPost);
  }, [selectedPost])

  // HELPER EFFECTS TO LOG VALUES
  useEffect(() => {
    // console.log('POSTS CHANGED: ', posts)
  }, [posts])
  useEffect(() => {
    // console.log('CATEGORY POSTS CHANGED: ', tagResultPosts)
  }, [tagResultPosts])

  const removeDuplicates = (arr, key) => {
    const seen = new Set();
    return arr.filter(item => {
      const k = key(item);
      return seen.has(k) ? false : seen.add(k);
    });
  };
  // get and set posts from category tag ID
  const addToTagResultPosts = async () => {
    const getMorePostsByTagId = async (schoolYear, tagId, lastId) => {
      let query = supabase
        .from('posts')
        .select('*, post_tags!inner(post)')
        .eq('post_tags.tag', tagId)

        .eq('schoolYear', schoolYear)
        .order('sortOrder', { ascending: false })
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
      } else {
        setNoMorePosts(false);
      }
      const parsedData = data.map(post => ({ ...post, content: JSON.parse(post.content) }))

      return parsedData
    }
    // get the array of posts for the current category tag
    const tagArray = tagResultPosts[tagId] || [];
    // get the id to start from when fetching new posts by id
    const lastPostId = tagArray.length > 0 ? tagArray[tagArray.length - 1].sortOrder : null;

    // const lastPostId = tagResultPosts[tagId] && tagResultPosts[tagId].length ? tagResultPosts[tagId][tagResultPosts.length - 1].id : null;
    const taggedPosts = await getMorePostsByTagId(schoolYear, tagId, lastPostId);
    // utility to remove duplicate posts from the array, if any

    if (taggedPosts) {
      setTagResultPosts(prevTagResultPosts => {
        const newTaggedPosts = removeDuplicates(taggedPosts, post => post.id); // Assuming each post has a unique 'id'
        const newPosts = prevTagResultPosts[tagId]
          ? removeDuplicates([...prevTagResultPosts[tagId], ...newTaggedPosts], post => post.id)
          : newTaggedPosts;

        return {
          ...prevTagResultPosts,
          [tagId]: newPosts,
        };
      });
    } else {
      console.log('NO POSTS RETURNED')
    }
  }
  // get and set posts from search query
  const addToSearchResultPosts = async () => {
    const getMorePostsBySearch = async (schoolYear, searchQuery, lastId) => {
      let query = supabase
        .from('posts')
        .select('*')
        .ilike('searchableText', `%${searchQuery}%`)

        .eq('schoolYear', schoolYear)
        .order('sortOrder', { ascending: false })
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
      } else {
        setNoMorePosts(false);
      }
      const parsedData = data.map(post => ({ ...post, content: JSON.parse(post.content) }))

      return parsedData
    }
    // get the array of posts for the current category tag
    const searchQueryArray = searchResultPosts[searchQuery] || [];
    // get the id to start from when fetching new posts by id
    const lastPostId = searchQueryArray.length > 0 ? searchQueryArray[searchQueryArray.length - 1].id : null;

    // const lastPostId = tagResultPosts[tagId] && tagResultPosts[tagId].length ? tagResultPosts[tagId][tagResultPosts.length - 1].id : null;
    const matchingPosts = await getMorePostsBySearch(schoolYear, searchQuery, lastPostId);

    if (matchingPosts) {
      setSearchResultPosts(prevSearchResultPosts => {
        const newMatchingPosts = removeDuplicates(matchingPosts, post => post.id); // Assuming each post has a unique 'id'
        const newPosts = prevSearchResultPosts[searchQuery]
          ? removeDuplicates([...prevSearchResultPosts[searchQuery], ...newMatchingPosts], post => post.id)
          : newMatchingPosts;

        return {
          ...prevSearchResultPosts,
          [searchQuery]: newPosts,
        };
      });
    } else {
      console.log('NO POSTS RETURNED')
    }
  }
  // get and set general list of posts
  const addToRecentPosts = async () => {
    const getRecentPosts = async (schoolYear, lastId) => {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('schoolYear', schoolYear)
        .order('sortOrder', { ascending: false })
        .order('id', { ascending: false })
        .limit(postFetchLimit)

      // Only apply the 'less than' filter if lastId is provided and not null
      if (lastId != null) {
        query = query.lt('sortOrder', lastId)
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

    const lastPostId = recentPosts.length ? recentPosts[recentPosts.length - 1].sortOrder : null;
    const newRecentPosts = await getRecentPosts(schoolYear, lastPostId);

    if (newRecentPosts) {
      setRecentPosts([...recentPosts, ...newRecentPosts]);
    } else {
      console.log('NO POSTS RETURNED')
    }
  }
  // helper to remove post ID query string from url when navigating away from a single post view
  const removeQueryString = () => {
    setPostId(null);
    router.replace(pathname);
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
    console.log('resetting posts')
    setDisplayType('recent');

    if (tagId) {setTagId('');} // if run from the dropdown, will already be null. if run from button, will be set to null

    if (searchQuery) {setSearchQuery('')};

    if (postId) {
      removeQueryString();
    }

  }

  // copy post url to clipboard
  const handleShareClick = (id) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/home/?postId=${id}`;

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

      {displayType === 'search' &&
        <>
          <p className={styles.searchStatus} style={ searchQuery ? {display: 'inline-block'} : {display: 'none'}}>
            {`Search results for "${searchQuery}"`}
          </p>
        </>
      }
      {displayType === 'category' &&
        <>
          <p className={styles.viewingPostsMessage}>{`Viewing posts tagged as `}
            <span className={styles.tagLabel}>
              {postTags.find(tag => tag.id === tagId)?.name}
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
      {displayType !== 'recent' ?
        <button className={styles.viewStatusButton}
          onClick={() => {
            resetPosts();
            if (postId) {
              // setPostId(null);
              removeQueryString();}
          }}>
          View All Posts
        </button> : null
      }


      {posts &&
    posts.map((post, i) => (
      <div className='post' key={i}>
        {user && post.author === user.id &&
              <button
                className={styles.editPostButton}
                onClick={() => router.push(`/admin/new-post/?id=${post.id}`)}
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
                  video={block.content[0]}
                />
              </div>
            )}

            {block.type === 'flexibleLayout' && (
              <ContentLayout
                block={block}
                viewContext='view'
                orientation='horizontal'
                user={user}
              />
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
    <div className='feedWrapper' ref={feedWrapperRef}>
      <div className={`slideUp`}>
        <WelcomeSlideshow />
        <SearchAndFilterBar
          postTags={postTags}
          tagId={tagId}
          // setTagId={setTagId}
          handleFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          setSearch={setSearchQuery}
          // getPosts={getPosts}
        />

        {renderedPosts}

        {noMorePosts && posts?.length ?
          <p className='centeredWhiteText'>{`You've reached the end! No more posts to display.`}</p> :
          null
        }

      </div>
    </div>
  );
}
