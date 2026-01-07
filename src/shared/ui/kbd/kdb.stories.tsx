import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kbd, KbdGroup } from "./kbd";

// --- META DEFINITION ---

const meta: Meta<typeof Kbd> = {
  title: "shared/UI/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "⌘",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Text or symbols displayed inside the keyboard key.",
    },
    className: {
      control: "text",
      description: "Custom className applied to the <kbd> element.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Kbd>;

// --- STORIES ---

/**
 * Single key.
 * Basic keyboard key used to highlight a single shortcut.
 */
export const Default: Story = {
  args: {
    children: "⌘",
  },
};

/**
 * Common keyboard shortcuts as a group.
 * Shows how to combine multiple Kbd elements in a KbdGroup.
 */
export const ShortcutGroup: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
};

/**
 * Inline usage inside text.
 * Demonstrates how Kbd looks when embedded in paragraphs or helper texts.
 */
export const InlineInText: Story = {
  render: () => (
    <p className="max-w-md text-sm text-muted-foreground">
      Press <Kbd>⌘</Kbd> + <Kbd>Enter</Kbd> to submit the form, or{" "}
      <Kbd>Esc</Kbd> to cancel.
    </p>
  ),
};

/**
 * Multiple variants in one place.
 * Useful as a visual reference for how the shortcut chips look together.
 */
export const ExamplesGallery: Story = {
  render: () => (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground w-32">Save</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground w-32">Search</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>F</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground w-32">Command palette</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground w-32">Close</span>
        <Kbd>Esc</Kbd>
      </div>
    </div>
  ),
};
