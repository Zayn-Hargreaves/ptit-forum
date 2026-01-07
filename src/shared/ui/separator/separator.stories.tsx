import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Separator } from "./separator";

// --- META DEFINITION ---

const meta: Meta<typeof Separator> = {
  title: "shared/UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation of the separator line.",
      table: {
        defaultValue: { summary: "horizontal" },
      },
    },
    decorative: {
      control: "boolean",
      description:
        "Whether the separator is purely decorative (accessibility attribute).",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    className: {
      control: "text",
      description: "Custom className styling.",
    },
  },
  args: {
    orientation: "horizontal",
    decorative: true,
  },
};

export default meta;

type Story = StoryObj<typeof Separator>;

// --- STORIES ---

/**
 * Default separator for dividing UI regions.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <span className="text-sm">Above</span>
      <Separator {...args} />
      <span className="text-sm">Below</span>
    </div>
  ),
};

/**
 * Vertical separator for side-by-side layout.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex h-16 items-center gap-4">
      <span className="text-sm">Left</span>
      <Separator {...args} />
      <span className="text-sm">Right</span>
    </div>
  ),
};

/**
 * Thick custom separator using class overrides.
 */
export const Styled: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <span className="text-sm">Section Title</span>
      <Separator {...args} className="h-2 bg-primary" />
      <span className="text-muted-foreground text-xs">Content below</span>
    </div>
  ),
};

/**
 * Decorative turned off to allow screen reader announcement.
 */
export const Accessible: Story = {
  args: {
    orientation: "horizontal",
    decorative: false,
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <span className="text-sm">Header</span>
      <Separator {...args} />
      <span className="text-sm">Footer</span>
    </div>
  ),
};
