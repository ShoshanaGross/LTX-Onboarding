import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { User } from '../types/User'
import { fetchUsers, deleteUserFromDB, updateUserInDB } from '../services/userService'

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
          const updatedUserInDB = await updateUserInDB(updatedUser);
          set((state) => ({
            users: state.users.map((user) => 
              user.id === updatedUserInDB.id ? updatedUserInDB : user
            )
          }));
        } catch (error) {
          console.error('Failed to update user:', error);
          throw error;
        }
      },
      deleteUser: async (userId: string) => {
        try {
          await deleteUserFromDB(userId);
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