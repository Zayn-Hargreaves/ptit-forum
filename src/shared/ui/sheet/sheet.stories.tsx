import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

// --- META DEFINITION ---

const meta: Meta<typeof Sheet> = {
  title: 'shared/UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state of the sheet.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when the sheet mounts.',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    modal: {
      control: 'boolean',
      description: 'When true, user interaction outside of the sheet is disabled.',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback fired when the open state changes.',
    },
    children: {
      control: false,
      description: 'Composition of SheetTrigger, SheetContent, SheetHeader, etc.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Sheet>;

// --- HELPERS ---

const TriggerButton: React.FC<React.ComponentProps<'button'>> = (props) => (
  <button
    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow"
    {...props}
  />
);

// --- STORIES ---

/**
 * Default sheet sliding in from the right.
 * Commonly used for settings panels or detail views.
 */
export const Default: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <TriggerButton>Open sheet</TriggerButton>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Project settings</SheetTitle>
          <SheetDescription>
            Configure basic information and preferences for this project.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-3 px-4 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Name</span>
            <input
              className="border-input bg-background focus-visible:ring-ring h-8 rounded-md border px-2 text-xs shadow-sm outline-none focus-visible:ring-1"
              defaultValue="Untitled project"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Description</span>
            <textarea
              className="border-input bg-background focus-visible:ring-ring min-h-20 rounded-md border px-2 py-1 text-xs shadow-sm outline-none focus-visible:ring-1"
              placeholder="Short description..."
            />
          </label>
        </div>
        <SheetFooter>
          <div className="flex items-center justify-end gap-2">
            <SheetClose asChild>
              <button className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm">
                Cancel
              </button>
            </SheetClose>
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium shadow">
              Save changes
            </button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding in from the left side.
 * Often used for navigation or sidebars.
 */
export const FromLeft: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <TriggerButton>Open sidebar</TriggerButton>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Quick access to the main sections of the app.</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1 px-4 py-2 text-sm">
          <button className="hover:bg-accent rounded-md px-2 py-1 text-left">Dashboard</button>
          <button className="hover:bg-accent rounded-md px-2 py-1 text-left">Projects</button>
          <button className="hover:bg-accent rounded-md px-2 py-1 text-left">Team</button>
          <button className="hover:bg-accent rounded-md px-2 py-1 text-left">Settings</button>
        </nav>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding down from the top.
 * Useful for banners, command palettes, or global filters.
 */
export const FromTop: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <TriggerButton>Open top sheet</TriggerButton>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Global filter</SheetTitle>
          <SheetDescription>Adjust filters that affect all visible data.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-wrap gap-3 px-4 pb-4 text-xs">
          <button className="hover:bg-accent rounded-full border px-3 py-1">Last 7 days</button>
          <button className="hover:bg-accent rounded-full border px-3 py-1">Last 30 days</button>
          <button className="hover:bg-accent rounded-full border px-3 py-1">This year</button>
          <button className="hover:bg-accent rounded-full border px-3 py-1">Custom range</button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Sheet sliding up from the bottom.
 * Commonly used on mobile for actions or detail previews.
 */
export const FromBottom: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger asChild>
        <TriggerButton>Open bottom sheet</TriggerButton>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick actions</SheetTitle>
          <SheetDescription>Frequently used actions for the current context.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-wrap gap-2 px-4 pb-4 text-xs">
          <button className="hover:bg-accent rounded-md border px-3 py-1">Duplicate</button>
          <button className="hover:bg-accent rounded-md border px-3 py-1">Archive</button>
          <button className="hover:bg-accent rounded-md border px-3 py-1">Share</button>
          <button className="hover:bg-accent rounded-md border px-3 py-1">Delete</button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Controlled sheet example.
 * Uses React state to control the open/close behavior.
 */
const ControlledDemo: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <TriggerButton>{open ? 'Close sheet' : 'Open controlled sheet'}</TriggerButton>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Controlled sheet</SheetTitle>
          <SheetDescription>This sheet is fully controlled by React state.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <button className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm">
              Close from inside
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
