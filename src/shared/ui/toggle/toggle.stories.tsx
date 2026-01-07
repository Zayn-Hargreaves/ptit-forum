import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Toggle } from "./toggle";
import { Bold, Italic, Underline } from "lucide-react";

// --- META DEFINITION ---

const meta: Meta<typeof Toggle> = {
  title: "shared/UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "outline"],
      description:
        "Visual style of the toggle. `outline` adds a border and subtle shadow.",
    },
    size: {
      control: "inline-radio",
      options: ["default", "sm", "lg"],
      description: "Controls the height and horizontal padding of the toggle.",
    },
    pressed: {
      control: "boolean",
      description:
        "Controlled pressed state of the toggle. When set, the component behaves as a controlled toggle.",
    },
    defaultPressed: {
      control: "boolean",
      description:
        "Initial pressed state in uncontrolled mode. Does not update after mount.",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction when true.",
    },
    "aria-invalid": {
      control: "boolean",
      description: "Marks the toggle as invalid, enabling error ring styles.",
    },
    asChild: {
      control: "boolean",
      description:
        "When true, changes the rendered element to the passed child component.",
    },
    className: {
      control: "text",
      description: "Custom className applied to the toggle root element.",
    },
    onPressedChange: {
      table: {
        category: "Events",
      },
      control: false,
      description:
        "Callback fired when the pressed state changes. Receives the next boolean value.",
    },
  },
  args: {
    variant: "default",
    size: "default",
    defaultPressed: false,
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Basic toggle with text label, demonstrating on/off state.
 */
export const Default: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Toggle notifications">
      Toggle
    </Toggle>
  ),
};

/**
 * Outline variant, often used for toolbar-like toggles.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
  render: (args) => (
    <Toggle {...args} aria-label="Toggle notifications">
      Outline
    </Toggle>
  ),
};

/**
 * Size variations to showcase how the toggle scales in different contexts.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Toggle {...args} size="sm" aria-label="Small toggle">
        Small
      </Toggle>
      <Toggle {...args} size="default" aria-label="Default toggle">
        Default
      </Toggle>
      <Toggle {...args} size="lg" aria-label="Large toggle">
        Large
      </Toggle>
    </div>
  ),
};

/**
 * Icon-only toggles that mimic formatting buttons in a text editor toolbar.
 */
export const WithIcons: Story = {
  args: {
    variant: "outline",
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Toggle {...args} aria-label="Toggle bold">
        <Bold />
      </Toggle>
      <Toggle {...args} aria-label="Toggle italic">
        <Italic />
      </Toggle>
      <Toggle {...args} aria-label="Toggle underline">
        <Underline />
      </Toggle>
    </div>
  ),
};

/**
 * Controlled toggle example, where the pressed state is fully driven by React state.
 */
export const Controlled: Story = {
  render: (args) => {
    const [pressed, setPressed] = React.useState(false);

    return (
      <div className="space-y-3">
        <Toggle
          {...args}
          pressed={pressed}
          onPressedChange={setPressed}
          aria-label="Toggle bold text"
          variant="outline"
        >
          <Bold />
          Bold
        </Toggle>

        <p className="text-xs text-muted-foreground">
          Current state:{" "}
          <span className="font-medium">{pressed ? "On" : "Off"}</span>
        </p>
      </div>
    );
  },
  parameters: {
    controls: {
      // Avoid conflicting with internal controlled state
      exclude: ["pressed", "defaultPressed", "onPressedChange"],
    },
  },
};

/**
 * Disabled toggle to demonstrate non-interactive styling.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultPressed: true,
    variant: "outline",
  },
  render: (args) => (
    <Toggle {...args} aria-label="Disabled toggle">
      Disabled
    </Toggle>
  ),
};
