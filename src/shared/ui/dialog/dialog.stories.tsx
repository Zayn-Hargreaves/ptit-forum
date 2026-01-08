import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AlertTriangle, Check, Copy, Trash } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

// --- META DEFINITION ---

const meta: Meta<typeof Dialog> = {
  title: 'shared/UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {},
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Trạng thái mở/đóng của Dialog (Controlled).',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Sự kiện khi trạng thái mở/đóng thay đổi.',
    },
    modal: {
      control: 'boolean',
      description: 'Chặn tương tác với bên ngoài (mặc định: true).',
    },
    children: {
      control: false,
      description: 'Các thành phần con (Trigger, Content...).',
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Dialog>;

// --- STORIES ---

/**
 * Default Story.
 * Basic usage with Title, Description, and a Close button.
 */
export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
        Open Dialog
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              defaultValue="Pedro Duarte"
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring col-span-3 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              defaultValue="@peduarte"
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring col-span-3 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-md bg-black px-3 text-sm font-medium text-white shadow transition-colors hover:bg-black/90"
          >
            Save changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Custom Content & No Close Button.
 * Using `showCloseButton={false}` and custom layout.
 */
export const DestructiveAction: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors">
        <Trash className="mr-2 h-4 w-4" />
        Delete Account
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <div className="flex flex-col items-center gap-2 text-center sm:text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-center">
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="mt-4 gap-2 sm:justify-center">
          <DialogClose className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium shadow-sm transition-colors">
            Cancel
          </DialogClose>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-3 text-sm font-medium text-white shadow transition-colors hover:bg-red-600/90">
            Yes, delete account
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Stateful Dialog.
 * Managing open/close state externally (Controlled).
 */
export const StatefulDialog: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">Current State: {open ? 'Open' : 'Closed'}</p>
        <Dialog {...args} open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm">
            Share Link
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <label htmlFor="link" className="sr-only">
                  Link
                </label>
                <input
                  id="link"
                  defaultValue="https://ui.shadcn.com/docs/installation"
                  readOnly
                  className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                />
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-black text-white shadow hover:bg-black/90"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy</span>
              </button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium shadow-sm transition-colors">
                Close
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};
