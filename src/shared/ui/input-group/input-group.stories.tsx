import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AtSign, Search, Send, X } from 'lucide-react';
import React, { useState } from 'react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './input-group';

// --- META DEFINITION ---

const meta: Meta<typeof InputGroup> = {
  title: 'shared/Form/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    className: 'max-w-md',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom className for the InputGroup container.',
      table: {
        defaultValue: { summary: 'max-w-md' },
      },
    },
    children: {
      control: false,
      description: 'Inner structure of the input group (addons, input, textarea, buttons…).',
    },
  },
};

export default meta;

type Story = StoryObj<typeof InputGroup>;

// --- STORIES ---

/**
 * Default search-style input group.
 * Classic layout: icon on the left, text input, and a button on the right.
 */
export const Default: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon aria-hidden="true">
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="xs">Search</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/**
 * Input group with inline addons.
 * Shows how prefix/suffix text can be used with the input.
 */
export const WithInlineTextAddons: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon>
        <InputGroupText>
          <AtSign />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="username" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>.example.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/**
 * Block-aligned addons.
 * Places helper content above and below the control, good for complex inputs.
 */
export const BlockAlignedAddons: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon align="block-start">
        <span className="text-muted-foreground text-xs">Project name (public)</span>
      </InputGroupAddon>
      <InputGroupInput placeholder="my-awesome-project" />
      <InputGroupAddon align="block-end">
        <span className="text-muted-foreground text-[11px]">
          This name will be visible to collaborators.
        </span>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/**
 * Input group with a textarea.
 * Automatically grows in height when a textarea is used as control.
 */
export const WithTextarea: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon align="block-start">
        <span className="text-muted-foreground text-xs">Message</span>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Type your message here..." rows={3} />
      <InputGroupAddon align="block-end">
        <div className="text-muted-foreground flex w-full items-center justify-between text-[11px]">
          <span>Markdown supported</span>
          <span>0/500</span>
        </div>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/**
 * Input group with icon-only buttons.
 * Great for compact toolbars or command bars.
 */
export const WithIconButtons: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupAddon>
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search or type a command..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Clear">
          <X className="size-3.5" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/**
 * Input group in an error state.
 * Uses aria-invalid to trigger the red ring and border styles.
 */
export const ErrorState: Story = {
  render: (args) => (
    <div className="space-y-1.5">
      <InputGroup {...args}>
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search..."
          aria-invalid={true}
          defaultValue="@@invalid-query"
        />
      </InputGroup>
      <p className="text-destructive text-xs">This query format is not supported.</p>
    </div>
  ),
};

/**
 * Controlled example with send action.
 * Demonstrates focusing the control when clicking on the addon.
 */
export const ControlledWithSend: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    const handleSend = () => {
      alert(`Sent: ${value || '(empty message)'}`);
    };

    return (
      <div className="space-y-2">
        <InputGroup {...args}>
          <InputGroupAddon>
            <InputGroupText>To:</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            placeholder="someone@example.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="xs" variant="ghost" type="button" onClick={handleSend}>
              <Send className="size-3.5" />
              Send
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <p className="text-muted-foreground text-xs">
          Click anywhere on the addons to focus the input.
        </p>
      </div>
    );
  },
};
