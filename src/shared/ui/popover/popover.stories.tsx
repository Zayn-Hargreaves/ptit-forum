import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "./popover";

// --- META DEFINITION ---

const meta: Meta<typeof Popover> = {
  title: "shared/UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {},
  argTypes: {
    open: {
      control: "boolean",
      description: "Controlled open state of the popover.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state when the popover mounts.",
    },
    modal: {
      control: "boolean",
      description:
        "When true, interaction outside the popover is disabled while it is open.",
    },
    onOpenChange: {
      action: "open changed",
      description: "Callback fired when the open state changes.",
    },
    children: {
      control: false,
      description:
        "Composition of PopoverTrigger, PopoverContent, and optional PopoverAnchor.",
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
      <PopoverTrigger className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Popover title</p>
          <p className="text-xs text-muted-foreground">
            This is a basic popover. You can place any content here, such as
            text, links, or small forms.
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
      <PopoverTrigger className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
        Rename project
      </PopoverTrigger>
      <PopoverContent>
        <form className="space-y-3 text-sm">
          <div className="space-y-1">
            <label
              htmlFor="project-name"
              className="text-xs font-medium text-foreground"
            >
              Project name
            </label>
            <input
              id="project-name"
              className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              defaultValue="Untitled project"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90"
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
        <span className="text-xs text-muted-foreground">Top</span>
        <Popover {...args}>
          <PopoverTrigger className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
            Top
          </PopoverTrigger>
          <PopoverContent side="top">
            <p className="text-xs">This popover appears above the trigger.</p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Right</span>
        <Popover {...args}>
          <PopoverTrigger className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
            Right
          </PopoverTrigger>
          <PopoverContent side="right">
            <p className="text-xs">This popover appears to the right.</p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Bottom</span>
        <Popover {...args}>
          <PopoverTrigger className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
            Bottom
          </PopoverTrigger>
          <PopoverContent side="bottom">
            <p className="text-xs">This popover appears below the trigger.</p>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Left</span>
        <Popover {...args}>
          <PopoverTrigger className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
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
        <PopoverAnchor className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground">
          Anchor element
        </PopoverAnchor>
        <PopoverTrigger className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
          Toggle popover
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-xs text-muted-foreground">
            This popover is positioned relative to the anchor element, not just
            the trigger.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
