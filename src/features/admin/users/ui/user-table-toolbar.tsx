import { zodResolver } from '@hookform/resolvers/zod';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/ui/button/button';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form/form';
import { Input } from '@/shared/ui/input/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select/select';

import { UserSearchFormValues, userSearchSchema } from '../model/schema';

interface UserTableToolbarProps<TData> {
  table: Table<TData>;
  onFiltersChange: (filters: UserSearchFormValues) => void;
}

export function UserTableToolbar<TData>({ onFiltersChange }: UserTableToolbarProps<TData>) {
  const form = useForm<UserSearchFormValues>({
    resolver: zodResolver(userSearchSchema),
    defaultValues: {
      email: '',
      fullName: '',
      studentCode: '',
      classCode: '',
      enable: 'all',
    },
  });

  const onSubmit = (data: UserSearchFormValues) => {
    console.log('SearchForm Submitted:', data);
    onFiltersChange(data);
  };

  // Watch for changes and debounce if needed, or stick to explicit submit/enter.
  // For now, let's use explicit 'Enter' or blur on inputs, or a search button.
  // Actually, standard Pattern is often auto-search or search button.
  // Let's rely on standard form submission for filters or simpler onChange.

  // Let's use a "Search" button or simple useEffect debounce could be better but let's stick to simple "Enter" key approach via form submit or specific inputs.
  // Actually `onKeydown` Enter.

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Tên người dùng..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Mã SV..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Mã lớp..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enable"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">
              Tìm kiếm
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                form.reset({
                  email: '',
                  fullName: '',
                  studentCode: '',
                  classCode: '',
                  enable: 'all',
                });
                onFiltersChange({
                  email: undefined,
                  fullName: undefined,
                  studentCode: undefined,
                  classCode: undefined,
                  enable: 'all',
                });
              }}
            >
              Đặt lại
              <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
