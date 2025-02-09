import React, { useState } from 'react';
import { Post, PostComment, User } from '../types/User';
import styles from './UserPost.module.scss';
import ArrowForward from '../assets/ArrowForward.svg';

interface UserPostProps {
  post: Post;
  getUserById: (userId: number) => User;
}

const UserPost: React.FC<UserPostProps> = ({ post, getUserById }) => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(prev => !prev);
  };

  const renderComment = (comment: PostComment) => (
    <div key='${comment.id}' className={styles.userPostCommentContainer}>
      <img
        src={getUserById(comment.userId).image}
        alt="user-image"
        className={styles.userPostCommentUserImage}
      />
      <div className={styles.userPostCommentBody}>{comment.body}</div>
    </div>
  );

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
          {post.comments.slice(0, 3).map(renderComment)}
        </div>
      )}
    </div>
  );
};

export default UserPost; 