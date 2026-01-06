import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

// --- META DEFINITION ---

const meta: Meta<typeof Form> = {
  title: 'shared/Form/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {},
  argTypes: {
    children: {
      control: false,
      description: 'Form content composed with FormField, FormItem, FormLabel, FormControl, etc.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Form>;

// --- STORIES ---

/**
 * Basic form with a single field.
 * Demonstrates how to wire up react-hook-form with the Form helpers.
 */
export const Basic: Story = {
  render: () => {
    const form = useForm<{ email: string }>({
      defaultValues: {
        email: '',
      },
    });

    function onSubmit(values: { email: string }) {
      alert(`Submitted: ${JSON.stringify(values, null, 2)}`);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] space-y-6">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address.',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 text-sm shadow-sm outline-none focus-visible:ring-1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll only use this for account-related messages.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow"
          >
            Submit
          </button>
        </form>
      </Form>
    );
  },
};

/**
 * Login form with multiple fields.
 * Showcases reusing FormField and error handling on both inputs.
 */
export const LoginForm: Story = {
  render: () => {
    const form = useForm<{ email: string; password: string }>({
      defaultValues: {
        email: '',
        password: '',
      },
    });

    function onSubmit(values: { email: string; password: string }) {
      alert(`Login values: ${JSON.stringify(values, null, 2)}`);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[380px] space-y-6">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required.',
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 text-sm shadow-sm outline-none focus-visible:ring-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{
              required: 'Password is required.',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long.',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 text-sm shadow-sm outline-none focus-visible:ring-1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use at least 6 characters for a stronger password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 w-full items-center justify-center rounded-md px-4 text-sm font-medium shadow"
          >
            Sign in
          </button>
        </form>
      </Form>
    );
  },
};

/**
 * Form with live validation and inline messages.
 * Uses `mode: 'onChange'` to update error messages as the user types.
 */
export const LiveValidation: Story = {
  render: () => {
    const form = useForm<{ username: string }>({
      defaultValues: { username: '' },
      mode: 'onChange',
    });

    return (
      <Form {...form}>
        <form className="w-[360px] space-y-6">
          <FormField
            control={form.control}
            name="username"
            rules={{
              required: 'Username is required.',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters.',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <input
                    placeholder="your-username"
                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 text-sm shadow-sm outline-none focus-visible:ring-1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This will be visible to other users.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  },
};

/**
 * Form with a custom FormMessage.
 * Shows how you can provide your own message while still using the hook state.
 */
export const CustomMessage: Story = {
  render: () => {
    const form = useForm<{ code: string }>({
      defaultValues: { code: '' },
    });

    function onSubmit(values: { code: string }) {
      alert(`Code submitted: ${values.code}`);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px] space-y-6">
          <FormField
            control={form.control}
            name="code"
            rules={{
              required: 'Code is required.',
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite code</FormLabel>
                <FormControl>
                  <input
                    placeholder="ABC-123"
                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 text-sm shadow-sm outline-none focus-visible:ring-1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the invite code you received from your admin.
                </FormDescription>
                <FormMessage>
                  {/* This will be overridden by validation message when invalid */}
                  Please enter a valid invite code.
                </FormMessage>
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow"
          >
            Join
          </button>
        </form>
      </Form>
    );
  },
};
