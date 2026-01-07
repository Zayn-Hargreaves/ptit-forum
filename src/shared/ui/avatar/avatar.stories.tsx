import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

// --- META DEFINITION ---

const meta: Meta<typeof Avatar> = {
  title: "shared/UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    children: {
      table: { disable: true },
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

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const BrokenImage: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage
        src="https://example.com/this-image-does-not-exist.jpg"
        alt="Ảnh lỗi"
      />
      <AvatarFallback>BI</AvatarFallback>
    </Avatar>
  ),
};

export const CustomSize: Story = {
  args: {
    className: "size-16",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
      <AvatarFallback>VC</AvatarFallback>
    </Avatar>
  ),
};

export const SquareShape: Story = {
  args: {
    className: "rounded-md",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage
        src="https://github.com/react.png"
        alt="@react"
        className="rounded-md"
      />
      <AvatarFallback className="rounded-md">R</AvatarFallback>
    </Avatar>
  ),
};
