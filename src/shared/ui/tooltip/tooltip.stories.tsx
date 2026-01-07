import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";

// --- META DEFINITION ---

const meta = {
  title: "shared/UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    open: {
      control: "boolean",
      description:
        "Controlled open state of the tooltip. When provided, the tooltip behaves as a controlled component.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state of the tooltip in uncontrolled mode.",
    },
    onOpenChange: {
      table: {
        category: "Events",
      },
      control: false,
      description:
        "Callback fired when the open state changes. Receives the next boolean value.",
    },
    // Props from Tooltip.Root (Radix) that are commonly used
    delayDuration: {
      table: { disable: true }, // handled at provider level in this design
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Basic tooltip attached to a button, using the default positioning.
 */
export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <button className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent">
          Hover me
        </button>
      </TooltipTrigger>
      <TooltipContent>Simple tooltip content</TooltipContent>
    </Tooltip>
  ),
};

/**
 * Tooltip with different placements to showcase the `side` prop.
 */
export const Placements: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
            Top
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          Placed above the trigger
        </TooltipContent>
      </Tooltip>

      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
            Right
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={4}>
          Placed to the right
        </TooltipContent>
      </Tooltip>

      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
            Bottom
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          Placed below the trigger
        </TooltipContent>
      </Tooltip>

      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
            Left
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={4}>
          Placed to the left
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * Tooltip with richer content, combining title-like text and description.
 */
export const RichContent: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <button className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent">
          What is this?
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs space-y-1">
        <p className="text-xs font-semibold">Advanced analytics</p>
        <p className="text-[11px] opacity-90">
          Get insights about visitors, top pages, and conversion funnels in
          real-time.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Example where multiple tooltips are wrapped in a shared TooltipProvider,
 * demonstrating how you might set global behavior like delay duration.
 */
export const WithProvider: Story = {
  render: () => (
    <TooltipProvider delayDuration={200}>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
              Profile
            </button>
          </TooltipTrigger>
          <TooltipContent>View and edit your profile.</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
              Settings
            </button>
          </TooltipTrigger>
          <TooltipContent>Manage your account settings.</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
              Help
            </button>
          </TooltipTrigger>
          <TooltipContent>Open the documentation center.</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

/**
 * Small helper component to demonstrate a controlled tooltip,
 * where you can toggle visibility manually.
 */
function ControlledExample(props: React.ComponentProps<typeof Tooltip>) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-3">
      <Tooltip {...props} open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
            Hover or focus me
          </button>
        </TooltipTrigger>
        <TooltipContent>Controlled tooltip content</TooltipContent>
      </Tooltip>

      <button
        type="button"
        className="rounded-md border px-2 py-1 text-xs hover:bg-accent"
        onClick={() => setOpen((prev) => !prev)}
      >
        Toggle tooltip programmatically (current: {open ? "open" : "closed"})
      </button>
    </div>
  );
}

/**
 * Controlled tooltip example syncing the open state with React state.
 */
export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
  parameters: {
    controls: {
      // Avoid conflicting with internal controlled state
      exclude: ["open", "defaultOpen", "onOpenChange"],
    },
  },
};
