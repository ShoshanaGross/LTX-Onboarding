import React from 'react';
import { PostComment } from '../types/User';
import styles from './Comment.module.scss';
import { useUserStore } from '../stores/userStore';

interface CommentProps {
  comment: PostComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const users = useUserStore(state => state.users);

  const getUserById = (id: string) => {
    const foundUser = users.find(user => user.id === `${id}`);
    return foundUser || users[0];
  };

  return (
    <div className={styles.userPostCommentContainer}>
      <img
        src={getUserById(`${comment.userId}`).image}
        alt="user-image"
        className={styles.userPostCommentUserImage}
      />
      <div className={styles.userPostCommentBody}>{comment.body}</div>
    </div>
  );
};

export default Comment; 