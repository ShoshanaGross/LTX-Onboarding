import { User } from '../types/User';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('http://localhost:3300/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  return data;
};

export const updateUserInDB = async (updatedUser: User): Promise<User> => {
  const response = await fetch(`http://localhost:3300/users/${updatedUser.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser)
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to update user: ${errorData}`);
  }

  const data = await response.json();
  return data;
};

export const deleteUserFromDB = async (userId: string): Promise<void> => {
  const response = await fetch(`http://localhost:3300/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to delete user: ${errorData}`);
  }
};
