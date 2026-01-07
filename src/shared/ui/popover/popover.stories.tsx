import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './popover';

// --- META DEFINITION ---

const meta: Meta<typeof Popover> = {
  title: 'shared/UI/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {},
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state of the popover.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when the popover mounts.',
    },
    modal: {
      control: 'boolean',
      description: 'When true, interaction outside the popover is disabled while it is open.',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback fired when the open state changes.',
    },
    children: {
      control: false,
      description: 'Composition of PopoverTrigger, PopoverContent, and optional PopoverAnchor.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

// --- STORIES ---

/**
 * Default popover.
 * Simple trigger button with some text content.
 */
export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow">
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Popover title</p>
          <p className="text-muted-foreground text-xs">
            This is a basic popover. You can place any content here, such as text, links, or small
            forms.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Popover containing a small form.
 * Common pattern for rename dialogs, quick edits, etc.
 */
export const WithForm: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm">
        Rename project
      </PopoverTrigger>
      <PopoverContent>
        <form className="space-y-3 text-sm">
          <div className="space-y-1">
            <label htmlFor="project-name" className="text-foreground text-xs font-medium">
              Project name
            </label>
            <input
              id="project-name"
              className="border-input bg-background focus-visible:ring-ring flex h-8 w-full rounded-md border px-2 text-xs shadow-sm outline-none focus-visible:ring-1"
              defaultValue="Untitled project"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium shadow"
            >
              Save
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Placement gallery.
 * Shows how popovers look on different sides of the trigger.
 */
export const PlacementGallery: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Top</span>
        <Popover {...args}>
          <PopoverTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm">
            Top
          </PopoverTrigger>
          <PopoverContent side="top">
            <p className="text-xs">This popover appears above the trigger.</p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Right</span>
        <Popover {...args}>
          <PopoverTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm">
            Right
          </PopoverTrigger>
          <PopoverContent side="right">
            <p className="text-xs">This popover appears to the right.</p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Bottom</span>
        <Popover {...args}>
          <PopoverTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm">
            Bottom
          </PopoverTrigger>
          <PopoverContent side="bottom">
            <p className="text-xs">This popover appears below the trigger.</p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Left</span>
        <Popover {...args}>
          <PopoverTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm">
            Left
          </PopoverTrigger>
          <PopoverContent side="left">
            <p className="text-xs">This popover appears to the left.</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};

/**
 * Popover with anchor.
 * Shows how PopoverAnchor can be used for advanced positioning.
 */
export const WithAnchor: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <Popover {...args}>
        <PopoverAnchor className="bg-secondary text-secondary-foreground inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium">
          Anchor element
        </PopoverAnchor>
        <PopoverTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-sm">
          Toggle popover
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-muted-foreground text-xs">
            This popover is positioned relative to the anchor element, not just the trigger.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
