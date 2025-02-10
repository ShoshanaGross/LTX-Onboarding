import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { UserForm } from './UserForm';
import styles from './CreateUser.module.scss';
import type { TransformedUserData } from './UserForm';
import type { User } from '../types/User';

const CreateUser = () => {
  const navigate = useNavigate();
  const users = useUserStore(state => state.users);
  const setUsers = useUserStore(state => state.setUsers);

  const handleSubmit = async (formData: TransformedUserData) => {
    try {
      const response = await fetch('http://localhost:3300/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const newUser = (await response.json()) as User;
      setUsers([...users, newUser]);
      navigate('/');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  return (
    <div className={styles.createUser}>
      <h2>Create New User</h2>
      <UserForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
        isEdit={false}
      />
    </div>
  );
};

export default CreateUser; 