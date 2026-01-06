'use client';

import { useMe } from '@entities/session/model/queries';
import { useUserProfile } from '@entities/user/queries';
import { Skeleton } from '@shared/ui';
import { ProfileTabs } from '@widgets/user-profile/profile-tabs';

import { ProfileHeader } from './profile-header';

interface ProfileViewProps {
  userId: string;
}

export function ProfileView({ userId }: Readonly<ProfileViewProps>) {
  const { data: profile, isLoading, error } = useUserProfile(userId);
  const { data: me } = useMe();

  const isOwnProfile = profile?.isOwnProfile || me?.id === profile?.id;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header Skeleton */}
        <div className="bg-card ring-border/50 relative mb-8 rounded-2xl pb-6 shadow-sm ring-1">
          {/* Banner Skeleton */}
          <Skeleton className="h-40 w-full rounded-t-2xl" />

          <div className="px-6">
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-end">
              {/* Avatar Skeleton */}
              <div className="relative z-10 -mt-16">
                <Skeleton className="border-card h-32 w-32 rounded-full border-4" />
              </div>

              {/* User Info Skeleton */}
              <div className="min-w-0 flex-1 pt-2 md:pb-2">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Skeleton className="mb-2 h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio and Stats Skeleton */}
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div>
                  <Skeleton className="mb-2 h-4 w-16" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="bg-card/50 rounded-xl border p-5 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background ring-border/50 flex flex-col items-center justify-center rounded-lg p-3 text-center ring-1">
                    <Skeleton className="mb-2 h-8 w-8 rounded-full" />
                    <Skeleton className="mb-1 h-6 w-8" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <div className="bg-background ring-border/50 flex flex-col items-center justify-center rounded-lg p-3 text-center ring-1">
                    <Skeleton className="mb-2 h-8 w-8 rounded-full" />
                    <Skeleton className="mb-1 h-6 w-8" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <div className="bg-background ring-border/50 flex flex-col items-center justify-center rounded-lg p-3 text-center ring-1">
                    <Skeleton className="mb-2 h-8 w-8 rounded-full" />
                    <Skeleton className="mb-1 h-6 w-8" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <div className="bg-background ring-border/50 flex flex-col items-center justify-center rounded-lg p-3 text-center ring-1">
                    <Skeleton className="mb-2 h-8 w-8 rounded-full" />
                    <Skeleton className="mb-1 h-6 w-8" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs Skeleton */}
        <div className="space-y-6">
          {/* Tabs Header Skeleton */}
          <div className="flex space-x-1 border-b">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-12 w-24" />
          </div>

          {/* Tab Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">Failed to load profile. Please try again.</div>
    );
  }

  if (!profile) {
    return <div className="p-8 text-center">User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader user={profile} isOwnProfile={isOwnProfile ?? false} />
      <ProfileTabs userId={userId} isOwnProfile={isOwnProfile ?? false} />
    </div> // Passed userId to Tabs for future fetching
  );
}
