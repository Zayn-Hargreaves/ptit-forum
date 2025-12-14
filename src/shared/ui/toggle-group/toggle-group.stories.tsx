import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

// --- META DEFINITION ---

const meta = {
  title: "shared/UI/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["single", "multiple"],
      description:
        "Defines whether the group behaves like a single-choice or multi-select toggle set.",
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the toggle group.",
    },
    variant: {
      control: "inline-radio",
      options: ["default", "outline"],
      description:
        "Visual style of the toggle items. Propagated to children via context.",
    },
    size: {
      control: "inline-radio",
      options: ["default", "sm", "lg"],
      description:
        "Size of the toggle items. Propagated to children via context.",
    },
    disabled: {
      control: "boolean",
      description:
        "Disables interaction when true. Typically applied per item rather than on the group.",
    },
    value: {
      control: "object",
      description:
        "Controlled value of the toggle group. For `single` it is a string, for `multiple` it is an array of strings.",
    },
    defaultValue: {
      control: "object",
      description:
        "Initial value in uncontrolled mode. Does not update after mount.",
    },
    rovingFocus: {
      control: "boolean",
      description:
        "Whether arrow key navigation should move focus through the items.",
    },
    loop: {
      control: "boolean",
      description:
        "When roving focus is enabled, controls if focus loops around at the ends.",
    },
    onValueChange: {
      table: {
        category: "Events",
      },
      control: false,
      description:
        "Callback fired when the group value changes. Receives the next value.",
    },
    className: {
      control: "text",
      description: "Custom className applied to the toggle group root.",
    },
  },
  args: {
    type: "single",
    orientation: "horizontal",
    variant: "outline",
    size: "default",
    rovingFocus: true,
    loop: true,
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Basic single-select toggle group, similar to a text formatting toolbar.
 */
export const SingleSelect: Story = {
  render: (args) => (
    <ToggleGroup {...args} aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * Multi-select group where multiple formatting options can be enabled at once.
 */
export const MultipleSelect: Story = {
  args: {
    type: "multiple",
  },
  render: (args) => (
    <ToggleGroup {...args} aria-label="Text formatting multi-select">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * Size variations to showcase how the toggle group scales.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Small</span>
        <ToggleGroup {...args} size="sm" aria-label="Text alignment small">
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Default</span>
        <ToggleGroup
          {...args}
          size="default"
          aria-label="Text alignment default"
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Large</span>
        <ToggleGroup {...args} size="lg" aria-label="Text alignment large">
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};

/**
 * Vertical orientation, often used for side toolbars or stacked controls.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
    type: "single",
  },
  render: (args) => (
    <ToggleGroup {...args} aria-label="Vertical toggle group">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * Small helper component to demonstrate a controlled ToggleGroup with React state.
 */
function ControlledExample(props: React.ComponentProps<typeof ToggleGroup>) {
  const [value, setValue] = React.useState<string[]>(["bold"]);

  // Remove `defaultValue` and `type` from props to avoid conflicting types
  const { defaultValue: _defaultValue, type: _type, ...rest } = props;

  return (
    <div className="space-y-3">
      <ToggleGroup
        {...rest}
        type="multiple"
        value={value}
        onValueChange={(next) => setValue(next as string[])}
        aria-label="Formatting controls"
      >
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline />
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="text-xs text-muted-foreground">
        Active values:{" "}
        <code className="rounded bg-muted px-2 py-0.5 text-[11px]">
          {value.length ? value.join(", ") : "none"}
        </code>
      </div>
    </div>
  );
}

/**
 * Controlled example where the selected value(s) are synced with React state.
 */
export const Controlled: Story = {
  args: {
    type: "multiple",
  },
  render: (args) => <ControlledExample {...args} />,
  parameters: {
    controls: {
      // Avoid conflicts with internal state
      exclude: ["value", "defaultValue", "onValueChange"],
    },
  },
};

/**
 * Example demonstrating disabled items inside the group.
 */
export const WithDisabledItems: Story = {
  args: {
    type: "single",
  },
  render: (args) => (
    <ToggleGroup {...args} aria-label="Formatting with disabled options">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic" disabled>
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
