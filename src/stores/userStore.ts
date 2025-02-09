import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { User } from '../types/User'
import { fetchUsers } from '../services/userService'

interface UserState {
  users: User[]
  setUsers: (users: User[]) => void
  initializeUsers: () => Promise<void>
  updateUser: (updatedUser: User) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      users: [],
      setUsers: (users) => set({ users }),
      initializeUsers: async () => {
        const dbUsers = await fetchUsers()
        set({ users: dbUsers })
      },
      updateUser: async (updatedUser: User) => {
        try {
          // First update the database
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

          // If database update successful, update local state
          set((state) => ({
            users: state.users.map((user) => 
              user.id === updatedUser.id ? updatedUser : user
            )
          }));
        } catch (error) {
          console.error('Failed to update user:', error);
          throw error;
        }
      },
      deleteUser: async (userId) => {
        try {
          // First delete from the database
          const response = await fetch(`http://localhost:3300/users/${userId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to delete user: ${errorData}`);
          }

          // If database deletion successful, update local state
          set((state) => ({
            users: state.users.filter((user) => user.id !== userId)
          }));
        } catch (error) {
          console.error('Failed to delete user:', error);
          throw error;
        }
      }
    }),
    {
      name: 'user-storage',  // name for the localStorage key
      storage: createJSONStorage(() => localStorage)
    }
  )
) 