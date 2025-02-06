import React from 'react';
import UserCard from './UserCard';
import { User } from '../types/User';
import styles from './CardsGridView.module.scss';

interface CardsGridViewProps {
  users: User[];
  onUserClick: (userId: string) => void;
  assignRef: (userId: string, element: HTMLDivElement | null) => void;
}

const CardsGridView: React.FC<CardsGridViewProps> = ({ users, onUserClick, assignRef }) => {
  return (
    <div className={styles.userGrid}>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onUserClick={onUserClick}
          ref={el => assignRef(user.id, el)}
        />
      ))}
    </div>
  );
};

export default CardsGridView; 