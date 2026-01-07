import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

import { Label } from "./label";

// --- META DEFINITION ---

const meta: Meta<typeof Label> = {
  title: "shared/Form/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Label text",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Displayed label text or React nodes.",
    },
    className: {
      control: "text",
      description: "Optional className for custom styling.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

// --- STORIES ---

/**
 * Default label sample
 */
export const Default: Story = {};

/**
 * Label paired with an input.
 * Demonstrates practical usage with form fields.
 */
export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email address</Label>
      <input
        id="email"
        type="email"
        className="border rounded px-2 py-1 text-sm"
        placeholder="you@example.com"
      />
    </div>
  ),
};

/**
 * Disabled state preview.
 * Shows how the label looks when a field is disabled.
 */
export const DisabledState: Story = {
  render: () => (
    <div className="flex flex-col gap-2 group-data-[disabled=true]">
      <Label htmlFor="username">Username (disabled)</Label>
      <input
        id="username"
        disabled
        className="border rounded px-2 py-1 text-sm disabled:opacity-50"
      />
    </div>
  ),
};

/**
 * Inline layout.
 * Demonstrates how labels look next to elements instead of above.
 */
export const InlineUsage: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <Label htmlFor="receive">Receive updates</Label>
      <input id="receive" type="checkbox" />
    </div>
  ),
};
