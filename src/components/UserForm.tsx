import React, { useState, useEffect } from 'react';
import { User } from '../types/User';
import { ImageInput } from './ImageInput';
import styles from './UserForm.module.scss';

interface UserFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
  image: string;
  imageFile: File | null;
  address_address: string;
  address_city: string;
  address_state: string;
  address_country: string;
}

export interface TransformedUserData extends Omit<UserFormData, 'age' | 'address_address' | 'address_city' | 'address_state' | 'address_country' | 'imageFile'> {
  age: number;
  posts: [];
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

interface UserFormProps {
  user?: User;
  onSubmit: (userData: TransformedUserData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const defaultFormData: UserFormData = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  email: '',
  phone: '',
  image: '',
  imageFile: null,
  address_address: '',
  address_city: '',
  address_state: '',
  address_country: ''
};

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, isEdit }) => {
  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age.toString(),
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        image: user.image,
        imageFile: null,
        address_address: user.address.address,
        address_city: user.address.city,
        address_state: user.address.state,
        address_country: user.address.country
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    console.log('imageUrl', imageUrl);
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const hasInvalidField = Object.entries(formData).some(([key, value]) => {
      if (key === 'age' || key === 'imageFile') return false;
      return !value.trim().length;
    });

    if (hasInvalidField) {
      setError('Fields cannot be empty or contain only spaces');
      return;
    }

    try {
      const transformedData: TransformedUserData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        image: formData.imageFile ? formData.imageFile.name : formData.image,
        posts: [],
        address: {
          address: formData.address_address,
          city: formData.address_city,
          state: formData.address_state,
          country: formData.address_country
        }
      };
      await onSubmit(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const renderField = (label: string, name: string, value: string, type: string = 'text') => (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        required
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.gridContainer}>
        {renderField('First Name', 'firstName', formData.firstName)}
        {renderField('Last Name', 'lastName', formData.lastName)}
        {renderField('Age', 'age', formData.age, 'number')}
        {renderField('Gender', 'gender', formData.gender)}
        {renderField('Email', 'email', formData.email, 'email')}
        {renderField('Phone', 'phone', formData.phone, 'tel')}
        
        <ImageInput
          initialImage={formData.image}
          onImageChange={handleImageChange}
          onError={setError}
        />
        
        <h3>Address</h3>
        {renderField('Street Address', 'address_address', formData.address_address)}
        {renderField('City', 'address_city', formData.address_city)}
        {renderField('State', 'address_state', formData.address_state)}
        {renderField('Country', 'address_country', formData.address_country)}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonContainer}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={styles.saveButton}>
          {isEdit ? 'Save Changes' : 'Create User'}
        </button>
      </div>
    </form>
  );
};
