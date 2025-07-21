'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/AxioClient';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  qrcode?: string;
  classId?: number | null;
  createdAt?: string;
  destinationCountry?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  jobName?: string;
  progressNumber?: number;
  isDeleted?: boolean;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) throw new Error('User not found in localStorage');

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.id;
        if (!userId) throw new Error('User ID missing in localStorage user object');

        const response = await API.get(`/user/${userId}`);
        setUser(response.data);
      } catch (error: unknown) {
        console.error('Error fetching user:', error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to fetch user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
