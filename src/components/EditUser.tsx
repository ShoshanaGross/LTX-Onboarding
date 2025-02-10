import  { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { UserForm } from './UserForm';
import type { TransformedUserData } from './UserForm';
import styles from './EditUser.module.scss';
import { User } from '../types/User';

export const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, deleteUser, updateUser } = useUserStore();
  
  const user = useMemo(() => users.find(u => u.id === id), [users, id]);

  if (!user) {
    return <div>User not found</div>;
  }

  const handleSubmit = async (formData: TransformedUserData) => {
    const updatedUser: User = {
      ...user,
      ...formData,
      posts: user.posts,
    };

    await updateUser(updatedUser);
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await deleteUser(user.id);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className={styles.editUser}>
      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteButton}
        >
          Delete User
        </button>
      </div>
      <h2>Edit User</h2>
      <UserForm
        user={user}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isEdit={true}
      />
    </div>
  );
};
