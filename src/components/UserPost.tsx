import React, { useState } from 'react';
import { Post } from '../types/User';
import styles from './UserPost.module.scss';
import ArrowForward from '../assets/ArrowForward.svg';
import Comment from './Comment';

interface UserPostProps {
  post: Post;
}

const UserPost: React.FC<UserPostProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(prev => !prev);
  };


  return (
    <div className={styles.userPostItem}>
      <img src={post.image} alt="post-image" className={styles.userPostImage} />
      <button className={styles.userPostViewMoreButton} onClick={toggleComments}>
        <div className={styles.userPostViewMoreText}>
          {showComments ? 'Hide 3 comments' : 'View 3 comments'}
        </div>
        <img
          src={ArrowForward}
          alt="arrow"
          className={`${styles.arrowIcon} ${showComments ? styles.rotated : ''}`}
        />
      </button>
      {showComments && (
        <div className={styles.userPostComments}>
          {post.comments.slice(0, 3).map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPost; 