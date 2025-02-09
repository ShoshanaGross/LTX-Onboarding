import React, { useState, useMemo } from 'react';
import { User } from '../types/User';
import styles from './EditUser.module.scss';
import { useParams, useNavigate} from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

export const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const users = useUserStore(state => state.users);
  const deleteUser = useUserStore(state => state.deleteUser);
  const updateUser = useUserStore((state) => state.updateUser);
  
  const user = useMemo(() => users.find(u => u.id === id), [users, id]);

  const [formData, setFormData] = useState(user ? {
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    email: user.email,
    gender: user.gender,
    city: user.address.city,
    state: user.address.state
  } : null);

  if (!user || !formData) {
    return <div>User not found</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === 'age' ? Number(value) : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      age: formData.age,
      email: formData.email,
      gender: formData.gender,
      address: {
        ...user.address,
        city: formData.city,
        state: formData.state
      }
    };
    try {
      await updateUser(updatedUser);
      navigate(-1);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDelete = async () => {
    if (!user || !window.confirm('Are you sure you want to delete this user?')) {
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.gridContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={styles.input}
            required
            min="0"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Gender</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.saveButton}
        >
          Save Changes
        </button>
      </div>
      <div className={styles.buttonContainer}>
        <button
            type="button"
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            Delete User
          </button>
      </div>
    </form>
  );
};
