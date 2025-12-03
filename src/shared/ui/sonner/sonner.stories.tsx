import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { toast } from "sonner";

// --- META DEFINITION ---

const meta: Meta<typeof Toaster> = {
  title: "shared/UI/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: {
      control: "inline-radio",
      options: ["light", "dark", "system"],
      description: "Theme applied to toast notifications.",
    },
    position: {
      control: "inline-radio",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      description: "Placement of toaster container.",
    },
    richColors: {
      control: "boolean",
      description: "Enables richer accent colors per toast type.",
    },
    expand: {
      control: "boolean",
      description: "Expands toast width to available space.",
    },
  },
  args: {
    position: "top-right",
    richColors: true,
    expand: false,
  },
};

export default meta;

type Story = StoryObj<typeof Toaster>;

// --- STORIES ---

/**
 * Basic toaster render. Contains a demo button to trigger a toast.
 */
export const Default: Story = {
  render: (args) => (
    <div className="space-y-4 flex flex-col items-center">
      <button
        onClick={() => toast("Hello from toast! 🎉")}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
      >
        Show Toast
      </button>
      <Toaster {...args} />
    </div>
  ),
};

/**
 * Toaster with success, error, and loading variants.
 * Demonstrates richer toast interactions.
 */
export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-2 flex-col">
      <button
        className="px-4 py-2 rounded-md bg-green-600 text-white"
        onClick={() => toast.success("Success message!")}
      >
        Success toast
      </button>
      <button
        className="px-4 py-2 rounded-md bg-red-600 text-white"
        onClick={() => toast.error("Something went wrong!")}
      >
        Error toast
      </button>
      <button
        className="px-4 py-2 rounded-md bg-blue-600 text-white"
        onClick={() =>
          toast.promise(new Promise((r) => setTimeout(r, 1500)), {
            loading: "Loading...",
            success: "Completed!",
            error: "Failed!",
          })
        }
      >
        Promise toast
      </button>

      <Toaster {...args} />
    </div>
  ),
};

/**
 * Expanded toaster showing wide layout.
 */
export const Expanded: Story = {
  args: {
    expand: true,
  },
  render: (args) => (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={() => toast("Wide toast message example")}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
      >
        Show Expanded Toast
      </button>
      <Toaster {...args} />
    </div>
  ),
};
