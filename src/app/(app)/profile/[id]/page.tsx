import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getUserProfile } from '@entities/user/api/user-api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientProfileRedirect } from '@features/profile/view-profile/ui/client-profile-redirect';
import { ProfileView } from '@features/profile/view-profile/ui/profile-view';

export const metadata: Metadata = {
  title: 'User Profile | Ptit Forum',
  description: 'View user profile, posts and documents.',
};

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  if (id === 'me') {
    return <ClientProfileRedirect />;
  }

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['profile', id],
      queryFn: () => getUserProfile(id),
    });
  } catch (error: unknown) {
    // Handle user not found
    if (error instanceof Error && error.message.includes('404')) {
      notFound();
    }
    // Re-throw other errors to be caught by error boundary
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView userId={id} />
    </HydrationBoundary>
  );
}
