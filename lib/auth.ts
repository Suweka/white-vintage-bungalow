export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
};

export const getAdminUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : null;
};

export const setAuthToken = (token: string, user: AdminUser): void => {
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminUser', JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
