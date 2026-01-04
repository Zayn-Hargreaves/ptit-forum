import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ScrollArea, ScrollBar } from "./scroll-area";

// --- META DEFINITION ---

const meta: Meta<typeof ScrollArea> = {
  title: "shared/UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: {
      control: "text",
      description: "Custom className applied to the ScrollArea root.",
    },
    children: {
      control: false,
      description: "Content that will be scrollable.",
    },
    type: {
      control: "radio",
      options: ["auto", "always", "scroll", "hover"],
      description:
        "Scroll area behavior for showing scrollbars (prop from Radix).",
    },
    scrollHideDelay: {
      control: "number",
      description:
        'Delay in milliseconds before hiding scrollbars when using `type="hover"`.',
    },
  },
  args: {
    type: "auto",
  },
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

// Helper: generate some fake content
const ParagraphList = ({ count = 10 }: { count?: number }) => (
  <div className="space-y-3 text-sm">
    {Array.from({ length: count }).map((_, i) => (
      <p key={i}>
        This is item <span className="font-medium">#{i + 1}</span> in the
        scrollable content area.
      </p>
    ))}
  </div>
);

// --- STORIES ---

/**
 * Default vertical scroll area.
 * Demonstrates simple overflow for a long block of content.
 */
export const Default: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="w-64 h-40 rounded-md border bg-background p-3"
    >
      <ParagraphList count={12} />
    </ScrollArea>
  ),
};

/**
 * Scroll area with custom height and padding.
 * Useful for panels, sidebars or dropdown menus.
 */
export const Compact: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="w-56 h-28 rounded-md border bg-background px-3 py-2"
    >
      <ParagraphList count={8} />
    </ScrollArea>
  ),
};

/**
 * Horizontal scrolling example.
 * Shows how ScrollBar can be used manually with horizontal orientation.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-72">
      <ScrollArea className="w-full overflow-hidden rounded-md border bg-background">
        <div className="flex w-[600px] gap-3 p-3 text-sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 w-32 items-center justify-center rounded-md border bg-muted"
            >
              Card {i + 1}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ),
};

/**
 * Both directions: vertical + horizontal overflow.
 * Good for large grids, tables, or code blocks.
 */
export const BothDirections: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="w-72 h-48 rounded-md border bg-background p-2"
    >
      <div className="w-[640px] h-[360px] rounded-md border bg-muted/30 p-3 text-xs">
        <p className="mb-2 font-medium text-foreground">Scrollable grid area</p>
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="flex h-10 items-center justify-center rounded-md bg-muted"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

/**
 * Scroll area styled like a dropdown menu body.
 * Shows a more "real" app scenario for usage.
 */
export const MenuLike: Story = {
  render: (args) => (
    <ScrollArea
      {...args}
      className="w-56 max-h-60 rounded-md border bg-popover p-1 text-sm shadow-md"
    >
      <ul className="space-y-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <li
            key={i}
            className="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
          >
            <span>Option {i + 1}</span>
            <span className="text-[10px] text-muted-foreground">
              {i + 1} / 20
            </span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};
