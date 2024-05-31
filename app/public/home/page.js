'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../../../utils/supabase';
import styles from './home.module.css';
import Video from '../../../components/Video/Video';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';
import PhotoCarousel from '../../../components/PhotoCarousel/PhotoCarousel';
import PrimeText from '../../../components/PrimeText/PrimeText';
import WelcomeSlideshow from '../../../components/WelcomeSlideshow/WelcomeSlideshow';
import SearchAndFilterBar from '../../../components/SearchAndFilterBar/SearchAndFilterBar';
import Intro from '../../../components/Intro/Intro';
import PostTitle from '../../../components/PostTitle/PostTitle';
import { format } from 'date-fns';
import dateFormatter from '../../../utils/dateFormatter';
import { useSearchParams } from 'next/navigation';
import Header from '../../../components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft, faShare, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export default function Home({ introRunning, setIntroRunning }) {
  const [posts, setPosts] = useState([]);
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const [tagId, setTagId] = useState(null)
  const [searchQuery, setSearchQuery] = useState(null);
  const [displayType, setDisplayType] = useState('all') // options are: all, id, tag, search
  const [postTags, setPostTags]  = useState([]);
  const [showLinkCopied, setShowLinkCopied] = useState(false);

  // const skipIntro = useSearchParams('skipIntro');
  // const [introRunning, setIntroRunning] = useState(true);

  // get and parse post data
  const getPosts = async ({ tagId, searchQuery, postId } = {}) => {
    let query = supabase
      .from('posts')
      .select('*');

    if (tagId) {
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
  // get posts with tag id when tag ID changes
  useEffect(() => {
    if (tagId) {
    getPosts({tagId: tagId});
    }
  }, [tagId]);
  useEffect(() => {
    if (postId) {
    getPosts({postId: postId});
    }
  }, [postId]);
  // get tags when the page loads
  useEffect(() => {
    getTags();
  }, [])


  const handleFilterChange = (event) => {
    const value = event.target.value;
    setTagId(value === 'all' ? null : parseInt(value));
  };

  const noResultsMessage = (
    <p className='centeredWhiteText'>{`It looks like there aren't any posts for this ${displayType === 'search' ? 'search' : 'category'} yet`}</p>
  )
  // reset posts to all
  const resetPosts = () => {
    setTagId(null);
    setSearchQuery(null);
    getPosts();
  }
  // copy post url to clipboard
  const handleShareClick = (id) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/public/home/postId=${id}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShowLinkCopied(true);
        setTimeout(() => {
          setShowLinkCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy the link: ', err);
      });
  };

  const renderedPosts =
    <div className={styles.feedWrapperContainer}>
      {/* <div className='topFeedShadow'></div> */}
      <div className='feedWrapper'>
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
        {postId &&
        <>
          <p className={styles.viewingPostsMessage}>{`Viewing post #${postId} `}
          </p>
        </>
        }
        {posts.length === 0 && noResultsMessage}
        {postId || tagId || searchQuery ?
          <button className={styles.viewStatusButton} onClick={resetPosts}>View All Posts
          </button> : null
        }


        {posts &&
    posts.map((post, i) => (
      <div className='post' key={i}>
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
          <p className={`${styles.linkCopyConfirm} ${showLinkCopied ? styles.show : ''}`}>Link copied!</p>
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
      </div>
    </div>


  return (
    <>
      { introRunning ? null : renderedPosts}
    </>
  );
}
