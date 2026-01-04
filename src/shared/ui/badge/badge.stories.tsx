import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Rocket } from "lucide-react";
import * as React from "react";
import { Badge } from "./badge";

// --- META DEFINITION ---

const meta: Meta<typeof Badge> = {
  title: "shared/UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },

  args: {
    children: "Badge",
  },

  argTypes: {
    variant: {
      description: "The visual style of the badge.",
      control: {
        type: "select",
      },
      options: ["default", "secondary", "destructive", "outline"],
    },
    children: {
      description: "The content of the badge (text, icon, etc.)",
      control: "text",
    },
    asChild: {
      table: { disable: true },
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The default badge style. This is the primary variant.
 */
export const Default: Story = {
  args: {
    variant: "default",
    children: "Default",
  },
};

/**
 * The secondary badge style, for less prominent information.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

/**
 * The outline badge style, for a subtle, un-filled look.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

/**
 * The destructive badge style, used for warnings or errors.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

/**
 * Demonstrates the badge rendering with an icon. The CVA
 * automatically handles spacing and icon sizing.
 */
export const WithIcon: Story = {
  // Dùng `render` function khi `children` phức tạp
  render: (args) => (
    <Badge {...args}>
      <Rocket />
      <span>Badge with Icon</span>
    </Badge>
  ),
  args: {
    variant: "default",
    children: undefined,
  },
};

/**
 * Demonstrates the `asChild` prop to render the badge as a
 * different element (e.g., an 'a' tag) while keeping the styles.
 */
export const AsLink: Story = {
  render: (args) => (
    <Badge {...args} asChild>
      <a href="#" onClick={(e) => e.preventDefault()}>
        Clickable Badge Link
      </a>
    </Badge>
  ),
  args: {
    variant: "outline",
    children: undefined,
  },
};
