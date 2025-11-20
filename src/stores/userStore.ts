import { AuthUser } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  removeUser: () => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  removeAccessToken: () => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
  removeRefreshToken: () => void;
  processLogout: boolean;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        set({ user });
      },
      removeUser: () => {
        set({ user: null });
      },
      accessToken: null,
      setAccessToken: (token) => {
        if (!token) {
          set({ accessToken: null });
        } else {
          set({ accessToken: token });
        }
      },
      removeAccessToken: () => {
        set({ accessToken: null });
      },
      refreshToken: null,
      setRefreshToken: (token) => {
        if (!token) {
          set({ refreshToken: null });
        } else {
          set({ refreshToken: token });
        }
      },
      removeRefreshToken: () => {
        set({ refreshToken: null });
      },
      processLogout: false,
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, processLogout: true });
        set({ processLogout: false });
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
