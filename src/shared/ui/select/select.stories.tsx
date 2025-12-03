import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectValue,
} from "./select";

// --- META DEFINITION ---

const meta: Meta<typeof Select> = {
  title: "shared/Form/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    defaultValue: undefined,
  },
  argTypes: {
    defaultValue: {
      control: "text",
      description: "Initial selected value (uncontrolled).",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    value: {
      control: "text",
      description: "Controlled selected value.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the entire select.",
    },
    onValueChange: {
      action: "value changed",
      description: "Called when the selected value changes.",
    },
    children: {
      control: false,
      description:
        "Composition of SelectTrigger, SelectContent, SelectItem, etc.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

// --- DEMO COMPONENTS FOR HOOK USAGE ---

const ControlledDemo: React.FC = () => {
  const [value, setValue] = React.useState("light");

  return (
    <div className="flex flex-col gap-3">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Theme</SelectLabel>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Selected: <span className="font-medium">{value}</span>
      </p>
    </div>
  );
};

// --- STORIES ---

/**
 * Basic select with a simple list of items.
 */
export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Select with grouped options and labels.
 * Useful for organizing items into categories.
 */
export const WithGroups: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="pear">Pear</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="tomato">Tomato</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/**
 * Size variants using the `size` prop on SelectTrigger.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="w-16 text-xs text-muted-foreground">Default</span>
        <Select defaultValue="md">
          <SelectTrigger className="w-[180px]" size="default">
            <SelectValue placeholder="Default size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-16 text-xs text-muted-foreground">Small</span>
        <Select defaultValue="md">
          <SelectTrigger className="w-[180px]" size="sm">
            <SelectValue placeholder="Small size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Controlled select example.
 * Uses React state to drive the selected value.
 */
export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

/**
 * Disabled select.
 * The trigger and list items are not interactive.
 */
export const Disabled: Story = {
  render: (args) => (
    <Select {...args} disabled defaultValue="apple">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
};
