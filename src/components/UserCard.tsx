import React from 'react';
import { User } from '../types/User';
import styles from './UserCard.module.scss';

interface UserCardProps {
  user: User;
  onUserClick: (userId: string) => void;
}

const UserCard = React.forwardRef<HTMLDivElement, UserCardProps>(({ user, onUserClick }, ref) => {
  return (
    <div ref={ref} className={styles.userCard}>
      <div className={styles.cardTopContainer}>
        <div className={styles.userPostsContainer}>
          {user.posts.slice(0, 3).map((post, index) => (
            <img
              src={post.image}
              alt={`user post-${index + 1}`}
              className={styles.userPost}
              key={index}
            />
          ))}
        </div>
        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className={styles.userImage} />
      </div>
      <div className={styles.cardBottomContainer}>
        <div className={styles.userInfo}>
          <div className={styles.userName}>
            {user.firstName} {user.lastName}
          </div>
          <div className={styles.userAgeLocation}>
            {user.age} | {user.address.city}, {user.address.state}
          </div>
        </div>
        <div className={styles.userEmail}>{user.email}</div>
        <button className={styles.viewDetailsButton} onClick={() => onUserClick(`${user.id}`)}>
          Details
        </button>
      </div>
    </div>
  );
});

export default UserCard;
