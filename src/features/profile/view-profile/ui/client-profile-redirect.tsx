'use client';

import { getMyProfile } from '@entities/user/api/user-api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ClientProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const profile = await getMyProfile();
        if (profile?.id) {
          router.replace(`/profile/${profile.id}`);
        } else {
          router.replace('/login');
        }
      } catch (error) {
        // Only redirect to login for authentication errors
        // For other errors, consider showing an error state or retry option
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) {
          router.replace('/login');
        } else {
          console.error('Failed to fetch profile:', error);
          // Optionally: show error state or retry
          router.replace('/login'); // fallback for now
        }
      }
    };

    fetchAndRedirect();
  }, [router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}
