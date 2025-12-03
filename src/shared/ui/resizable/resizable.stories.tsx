import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

// --- META ---

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "shared/UI/ResizablePanel",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    direction: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Panel resizing direction.",
      table: {
        defaultValue: { summary: "horizontal" },
      },
    },
    className: {
      control: "text",
      description: "Optional styling wrapper",
    },
  },
  args: {
    direction: "horizontal",
  },
};

export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

// --- DEMO COMPONENTS ---

const HorizontalExample: React.FC = () => {
  return (
    <div className="w-full h-48 border rounded-md overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} className="bg-muted p-4">
          Left Content
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} className="bg-muted/40 p-4">
          Right Content
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

const VerticalExample: React.FC = () => {
  return (
    <div className="w-full h-48 border rounded-md overflow-hidden">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50} className="bg-muted p-4">
          Top panel
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} className="bg-muted/40 p-4">
          Bottom panel
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

// --- STORIES ---

/**
 * Default horizontal resizing demonstration.
 */
export const Horizontal: Story = {
  render: () => <HorizontalExample />,
};

/**
 * Vertical split layout demonstration.
 */
export const Vertical: Story = {
  render: () => <VerticalExample />,
};

/**
 * Minimal version without visible grip icon.
 */
export const WithoutHandleIcon: Story = {
  render: () => (
    <div className="w-full h-48 border rounded-md overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} className="bg-muted p-4">
          Panel A
        </ResizablePanel>

        {/* Notice: withHandle={false} */}
        <ResizableHandle />

        <ResizablePanel defaultSize={60} className="bg-muted/30 p-4">
          Panel B
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
