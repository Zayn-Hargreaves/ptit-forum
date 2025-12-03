import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Progress } from "./progress";

// --- META DEFINITION ---

const meta: Meta<typeof Progress> = {
  title: "shared/UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: 40,
  },
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100 },
      description: "Current progress value (0–100).",
      table: {
        defaultValue: { summary: "40" },
      },
    },
    className: {
      control: "text",
      description: "Custom className applied to the progress root.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Progress>;

// --- STORIES ---

/**
 * Basic progress bar.
 * Simple 40% completion example.
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <Progress {...args} />
      <span className="text-xs text-muted-foreground">
        {args.value}% complete
      </span>
    </div>
  ),
};

/**
 * Progress with a label above and value text below.
 * Common pattern for forms, uploads, or setup flows.
 */
export const WithLabel: Story = {
  args: {
    value: 65,
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Uploading files</span>
        <span className="text-muted-foreground">{args.value}%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
};

/**
 * Different thickness variants using className overrides.
 */
export const Sizes: Story = {
  args: {
    value: 50,
  },
  render: (args) => (
    <div className="flex w-64 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Thin</span>
        <Progress {...args} className="h-1" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Default</span>
        <Progress {...args} className="h-2" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Thick</span>
        <Progress {...args} className="h-3" />
      </div>
    </div>
  ),
};

// Small demo component for the animated story
const AnimatedDemo: React.FC = () => {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setValue((prev) => (prev >= 100 ? 0 : prev + 5)),
      400
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex w-72 flex-col gap-2">
      <Progress value={value} />
      <span className="text-xs text-muted-foreground">Loading… {value}%</span>
    </div>
  );
};

/**
 * Animated example.
 * Progress value loops from 0 → 100, then restarts.
 */
export const Animated: Story = {
  render: () => <AnimatedDemo />,
};
