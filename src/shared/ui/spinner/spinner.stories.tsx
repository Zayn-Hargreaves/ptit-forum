import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Spinner } from "./spinner";

// --- META DEFINITION ---

const meta: Meta<typeof Spinner> = {
  title: "shared/UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: {
      control: "text",
      description: "Custom Tailwind classes applied to the spinner element.",
    },
    width: {
      control: "text",
      table: { disable: true }, // Spinner inherits props; width will pass via className
    },
    height: {
      control: "text",
      table: { disable: true }, // Same reason
    },
  },
  args: {
    className: "text-muted-foreground",
  },
};

export default meta;

// Story type must reference meta to correctly infer args
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Basic spinning loader with default styling.
 */
export const Default: Story = {
  render: (args) => <Spinner {...args} />,
};

/**
 * Larger-sized spinner to demonstrate size customization.
 */
export const Large: Story = {
  args: {
    className: "size-10 text-primary",
  },
  render: (args) => <Spinner {...args} />,
};

/**
 * Spinner inside a button to simulate loading state.
 */
export const InsideButton: Story = {
  render: (args) => (
    <button
      disabled
      className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white opacity-80"
    >
      <Spinner {...args} className="size-4" />
      Processing...
    </button>
  ),
};

/**
 * Spinner shown inline inside text to mimic async content rendering.
 */
export const Inline: Story = {
  render: (args) => (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      Fetching data
      <Spinner {...args} className="size-3" />
    </p>
  ),
};
