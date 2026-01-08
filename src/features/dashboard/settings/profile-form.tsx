'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { getMyProfile, updateProfile } from '@shared/api/user.service';
import { getErrorMessage } from '@shared/lib/utils';
import { useAuth } from '@shared/providers/auth-provider';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Skeleton,
} from '@shared/ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Validate file size/type
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  phone: z.string().optional(),
  studentCode: z.string().optional(),
  classCode: z.string().optional(),
  image: z
    .any()
    .refine((file) => !file || file instanceof File, 'Expected a file')
    .refine(
      (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB.`,
    )
    .refine(
      (file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'Only .jpg, .jpeg, .png and .webp formats are supported.',
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user: authUser, refreshSession } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      studentCode: '',
      classCode: '',
    },
  });

  // Sync form with profile data when loaded
  useEffect(() => {
    if (userProfile) {
      form.reset({
        fullName: userProfile.fullName || '',
        phone: userProfile.phone || '',
        studentCode: userProfile.studentCode || '',
        classCode: userProfile.classCode || '',
      });
    }
  }, [userProfile, form]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      refreshSession();
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
      console.error(error);
    },
  });

  function onSubmit(values: ProfileFormValues) {
    // Construct payload
    const payload = {
      fullName: values.fullName,
      phone: values.phone,
      studentCode: values.studentCode,
      classCode: values.classCode,
      image: values.image instanceof File ? values.image : undefined,
    };
    mutation.mutate(payload);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Manual validation check
      const validationResult = profileSchema.shape.image.safeParse(file);
      if (!validationResult.success) {
        // Access issues safely
        if (validationResult.error.issues && validationResult.error.issues.length > 0) {
          toast.error(validationResult.error.issues[0].message);
        } else {
          toast.error('Invalid file');
        }
        return;
      }

      form.setValue('image', file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoadingProfile) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>This is how others will see you on the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="group relative cursor-pointer" onClick={triggerFileInput}>
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={previewUrl || userProfile?.avatarUrl || authUser?.avatarUrl}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg">
                      {(userProfile?.fullName || authUser?.fullName)?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Profile Picture</h4>
                  <p className="text-muted-foreground text-xs">
                    Click the image to upload new avatar.
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="09xxx..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Code</FormLabel>
                      <FormControl>
                        <Input placeholder="B21..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Code</FormLabel>
                      <FormControl>
                        <Input placeholder="D21..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <Input value={authUser?.email} disabled readOnly />
              <p className="text-muted-foreground text-xs">Email cannot be changed.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
