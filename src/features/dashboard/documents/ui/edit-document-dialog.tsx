'use client';

import { Document } from '@entities/document/model/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateDocumentMetadata } from '@shared/api/document.service';
import { getErrorMessage } from '@shared/lib/utils';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@shared/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  subjectId: z.string().uuid('Invalid subject ID'),
});

interface EditDocumentDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDocumentDialog({ document, open, onOpenChange }: EditDocumentDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: document.title,
      description: document.description,
      subjectId: document.subject?.id || '',
    },
  });

  // Reset form when document changes
  useEffect(() => {
    if (document) {
      form.reset({
        title: document.title,
        description: document.description,
        subjectId: document.subject?.id || '',
      });
    }
  }, [document, form]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => updateDocumentMetadata(document.id, values),
    onSuccess: () => {
      toast.success('Document updated successfully');
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Document Metadata</DialogTitle>
          <DialogDescription>
            Update information for &quot;{document.title}&quot;. You cannot change the file itself.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Document title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the document..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Note: Subject selection would ideally use a ComboBox fetching subjects. 
                 For simplicity/MVP, keeping it as hidden/read-only or text input if needed.
                 Assuming user can't easily change subject without a proper selector UI which requires fetching subjects.
                 For this phase, let's keep it as text input but perhaps disable it or map it if we had subject list.
                 Given the prompt "Edit Title/Description/Subject", I'll leave it as a hidden ID or simple input if necessary, 
                 but a Subject Selector is cleaner.
                 Let's stick to simple input for ID for now (as existing schema uses ID), or ideally proper select.
                 Since I don't have the subject list fetching logic in this component, I will create a simple Input for now 
                 but label it "Subject ID" (MVP) or just hide it if too complex.
                 The User asked to edit Subject. I'll provide input for Subject ID (as text) but warn it's raw ID. 
                 Better: Just hide it for now if logic is missing from prompts?
                 Re-read: "Edit: Opens a Dialog to edit Title/Description/Subject".
                 I'll add it as a text input for now.
             */}
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Subject ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
