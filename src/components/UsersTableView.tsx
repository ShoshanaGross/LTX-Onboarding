import React from 'react';
import styles from './UsersTableView.module.scss';
import { User } from '../types/User';

interface UsersTableViewProps {
  users: User[];
  onUserClick: (userId: string) => void;
  assignRef: (userId: string, element: HTMLDivElement | null) => void;
}

const UsersTableView: React.FC<UsersTableViewProps> = ({ users, onUserClick, assignRef }) => {
  return (
    <div className={styles.userTableContainer}>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr
              key={user.id}
              ref={el => assignRef(user.id, el)}
              onClick={() => onUserClick(user.id)}
              style={{ cursor: 'pointer' }}
            >
              <td>
                <div className={styles.userTableName}>
                  <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>
                {user.address.city}, {user.address.state}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTableView; 