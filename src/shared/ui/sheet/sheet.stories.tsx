import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./sheet";

// --- META DEFINITION ---

const meta: Meta<typeof Sheet> = {
  title: "shared/UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Controlled open state of the sheet.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state when the sheet mounts.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    modal: {
      control: "boolean",
      description:
        "When true, user interaction outside of the sheet is disabled.",
    },
    onOpenChange: {
      action: "open changed",
      description: "Callback fired when the open state changes.",
    },
    children: {
      control: false,
      description:
        "Composition of SheetTrigger, SheetContent, SheetHeader, etc.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Sheet>;

// --- HELPERS ---

const TriggerButton: React.FC<React.ComponentProps<"button">> = (props) => (
  <button
    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
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
              className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              defaultValue="Untitled project"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium">Description</span>
            <textarea
              className="min-h-20 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Short description..."
            />
          </label>
        </div>
        <SheetFooter>
          <div className="flex items-center justify-end gap-2">
            <SheetClose asChild>
              <button className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
                Cancel
              </button>
            </SheetClose>
            <button className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90">
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
          <SheetDescription>
            Quick access to the main sections of the app.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1 px-4 py-2 text-sm">
          <button className="rounded-md px-2 py-1 text-left hover:bg-accent">
            Dashboard
          </button>
          <button className="rounded-md px-2 py-1 text-left hover:bg-accent">
            Projects
          </button>
          <button className="rounded-md px-2 py-1 text-left hover:bg-accent">
            Team
          </button>
          <button className="rounded-md px-2 py-1 text-left hover:bg-accent">
            Settings
          </button>
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
          <SheetDescription>
            Adjust filters that affect all visible data.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-wrap gap-3 px-4 pb-4 text-xs">
          <button className="rounded-full border px-3 py-1 hover:bg-accent">
            Last 7 days
          </button>
          <button className="rounded-full border px-3 py-1 hover:bg-accent">
            Last 30 days
          </button>
          <button className="rounded-full border px-3 py-1 hover:bg-accent">
            This year
          </button>
          <button className="rounded-full border px-3 py-1 hover:bg-accent">
            Custom range
          </button>
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
          <SheetDescription>
            Frequently used actions for the current context.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-wrap gap-2 px-4 pb-4 text-xs">
          <button className="rounded-md border px-3 py-1 hover:bg-accent">
            Duplicate
          </button>
          <button className="rounded-md border px-3 py-1 hover:bg-accent">
            Archive
          </button>
          <button className="rounded-md border px-3 py-1 hover:bg-accent">
            Share
          </button>
          <button className="rounded-md border px-3 py-1 hover:bg-accent">
            Delete
          </button>
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
        <TriggerButton>
          {open ? "Close sheet" : "Open controlled sheet"}
        </TriggerButton>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Controlled sheet</SheetTitle>
          <SheetDescription>
            This sheet is fully controlled by React state.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <button className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
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
