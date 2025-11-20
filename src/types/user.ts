export interface AuthUser {
  address: string;
  username: string;
  email: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}