export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
}
