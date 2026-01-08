import { zodResolver } from '@hookform/resolvers/zod';
import { announcementApi } from '@shared/api/announcement.service';
import { CohortCode } from '@shared/api/classroom.service';
import { getAllFaculties } from '@shared/api/faculty.service';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  ScrollArea,
} from '@shared/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Send } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAnnouncementStore } from '../model/announcement-store';
import { ReleaseAnnouncementFormValues, releaseAnnouncementSchema } from '../model/schema';

// Mock Cohort Codes
const COHORT_CODES = Object.values(CohortCode).filter((v) => typeof v === 'string');

export function ReleaseDialog() {
  const { isOpenRelease, selectedAnnouncement, close } = useAnnouncementStore();
  const queryClient = useQueryClient();

  const form = useForm<ReleaseAnnouncementFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(releaseAnnouncementSchema) as any,
    defaultValues: {
      targetFaculties: [],
      targetCohorts: [],
      specificClassCodes: '',
    },
  });

  // Fetch Faculties
  const { data: facultiesRes } = useQuery({
    queryKey: ['all-faculties-options'],
    queryFn: () => getAllFaculties({ page: 0, size: 100 }),
    enabled: isOpenRelease,
  });
  const faculties = facultiesRes?.data || [];

  useEffect(() => {
    if (isOpenRelease) {
      form.reset({
        targetFaculties: [],
        targetCohorts: [],
        specificClassCodes: '',
      });
    }
  }, [isOpenRelease, form]);

  const mutation = useMutation({
    mutationFn: async (data: ReleaseAnnouncementFormValues) => {
      if (!selectedAnnouncement) throw new Error('No announcement selected');

      // Cleaning class codes input
      const classCodes = data.specificClassCodes
        ? data.specificClassCodes
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      return announcementApi.release(selectedAnnouncement.id, {
        facultyIds: data.targetFaculties,
        schoolYearCodes: data.targetCohorts as CohortCode[],
        classCodes,
      });
    },
    onSuccess: () => {
      toast.success('Phát hành thông báo thành công');
      // Invalidate current announcement detail to update status badge
      if (selectedAnnouncement?.id) {
        queryClient.invalidateQueries({ queryKey: ['announcement', selectedAnnouncement.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      close();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Phát hành thất bại');
    },
  });

  const onSubmit = (data: ReleaseAnnouncementFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpenRelease} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Phát hành thông báo</DialogTitle>
          <DialogDescription>Chọn đối tượng nhận thông báo.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Faculties */}
            <FormField
              control={form.control}
              name="targetFaculties"
              render={() => (
                <FormItem>
                  <FormLabel>Khoa</FormLabel>
                  <ScrollArea className="h-40 rounded-md border p-4">
                    <div className="space-y-2">
                      {faculties.map((faculty: { id: string; facultyName: string }) => (
                        <FormField
                          key={faculty.id}
                          control={form.control}
                          name="targetFaculties"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={faculty.id}
                                className="flex flex-row items-center space-y-0 space-x-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(faculty.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), faculty.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== faculty.id),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{faculty.facultyName}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cohorts */}
            <FormField
              control={form.control}
              name="targetCohorts"
              render={() => (
                <FormItem>
                  <FormLabel>Khóa học</FormLabel>
                  <ScrollArea className="h-32 rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {COHORT_CODES.map((code) => (
                        <FormField
                          key={code}
                          control={form.control}
                          name="targetCohorts"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={code}
                                className="flex flex-row items-center space-y-0 space-x-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(code)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), code])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== code),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{code}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Specific Classes */}
            <FormField
              control={form.control}
              name="specificClassCodes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã lớp cụ thể</FormLabel>
                  <FormControl>
                    <Input placeholder="D20CQCN01-B, D21CQcn02-B..." {...field} />
                  </FormControl>
                  <FormDescription>Ngăn cách bởi dấu phẩy.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={close} disabled={mutation.isPending}>
                Hủy
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Phát hành ngay
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
