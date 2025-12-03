import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Skeleton } from "./skeleton";

// --- META DEFINITION ---

const meta: Meta<typeof Skeleton> = {
  title: "shared/UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: {
      control: "text",
      description: "Custom className applied to the skeleton wrapper.",
    },
  },
  args: {
    className: "h-4 w-24",
  },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

// --- STORIES ---

/**
 * Basic single skeleton block.
 */
export const Default: Story = {
  render: (args) => <Skeleton {...args} />,
};

/**
 * Skeletons shaped like lines of text.
 */
export const TextLines: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-32" />
    </div>
  ),
};

/**
 * Card-style skeleton: title, image, and body text.
 */
export const Card: Story = {
  render: () => (
    <div className="w-80 rounded-md border bg-background p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  ),
};

/**
 * Avatar + text skeleton row.
 * Often used in list items or chat UIs.
 */
export const AvatarRow: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Table-like skeleton.
 * Good for representing loading state of data tables.
 */
export const Table: Story = {
  render: () => (
    <div className="w-[480px] rounded-md border bg-background p-3 space-y-3 text-xs">
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  ),
};
