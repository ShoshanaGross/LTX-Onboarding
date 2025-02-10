import { User } from '../types/User';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('http://localhost:3300/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  return data;
};
