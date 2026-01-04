import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Textarea } from "./textarea";

// --- META DEFINITION ---

const meta: Meta<typeof Textarea> = {
  title: "shared/UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: {
      control: "text",
      description: "Custom Tailwind utility classes applied to the textarea.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed when the textarea is empty.",
    },
    disabled: {
      control: "boolean",
      description: "Disables user interaction when true.",
    },
    rows: {
      control: "number",
      description: "Specifies the visible number of text lines.",
    },
    value: {
      control: "text",
      description:
        "Controlled value of the textarea. When provided, component behaves as a controlled input.",
    },
    defaultValue: {
      control: "text",
      description:
        "Initial value in uncontrolled mode. Does not update after mount.",
    },
    name: {
      control: "text",
      description: "Name attribute for use in HTML forms.",
    },
    required: {
      control: "boolean",
      description: "Marks the field as required in a form.",
    },
    "aria-invalid": {
      control: "boolean",
      description:
        "Marks the field as invalid for accessibility and visual error state.",
    },
    onChange: {
      table: {
        category: "Events",
      },
      control: false,
      description:
        "Event handler called when the textarea value changes. Receives the change event.",
    },
  },
  args: {
    placeholder: "Type your message here...",
    rows: 4,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Basic textarea with placeholder and default sizing.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-[22rem]">
      <Textarea {...args} />
    </div>
  ),
};

/**
 * Textarea with label and helper text, demonstrating a typical form field layout.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="w-[24rem] space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="feedback" className="text-sm font-medium leading-none">
          Feedback
        </label>
        <span className="text-xs text-muted-foreground">Optional</span>
      </div>
      <Textarea id="feedback" {...args} />
      <p className="text-xs text-muted-foreground">
        Share any thoughts or suggestions to help us improve.
      </p>
    </div>
  ),
};

/**
 * Textarea in an invalid state, useful for showcasing validation styles.
 */
export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "This value failed validation on submit.",
  },
  render: (args) => (
    <div className="w-[24rem] space-y-1.5">
      <label
        htmlFor="comment-error"
        className="text-sm font-medium leading-none"
      >
        Comment
      </label>
      <Textarea id="comment-error" {...args} />
      <p className="text-xs text-destructive">
        Please provide at least 20 characters.
      </p>
    </div>
  ),
};

/**
 * Disabled textarea to demonstrate non-interactive state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "This field is disabled and cannot be edited.",
  },
  render: (args) => (
    <div className="w-[22rem]">
      <Textarea {...args} />
    </div>
  ),
};

/**
 * Controlled textarea with character counter,
 * demonstrating how to manage value in React state.
 */
export const WithCharacterCount: Story = {
  render: (args) => {
    const maxLength = 160;
    const [value, setValue] = React.useState("");

    return (
      <div className="w-[26rem] space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="bio" className="text-sm font-medium leading-none">
            Short bio
          </label>
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength} characters
          </span>
        </div>
        <Textarea
          id="bio"
          {...args}
          value={value}
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Tell us a bit about yourself..."
        />
      </div>
    );
  },
  parameters: {
    controls: {
      // Avoid conflicts with the internal controlled state
      exclude: ["value", "defaultValue", "onChange"],
    },
  },
};
