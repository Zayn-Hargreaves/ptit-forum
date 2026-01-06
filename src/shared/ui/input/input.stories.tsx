import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Input } from './input';

// --- META DEFINITION ---

const meta: Meta<typeof Input> = {
  title: 'shared/UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    placeholder: 'Type something...',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'number', 'url', 'tel', 'file'],
      description: 'Native input type.',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input interaction.',
    },
    placeholder: {
      control: 'text',
      description: 'Hint text when empty.',
    },
    value: {
      control: false,
      description: 'Controlled value (use React state).',
    },
    onChange: {
      action: 'changed',
      description: 'Called when the input value changes.',
    },
    className: {
      control: 'text',
      description: 'Custom styles applied to the input element.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

// --- STORIES ---

/**
 * Default text input.
 * Shows basic styling with placeholder.
 */
export const Default: Story = {
  render: (args) => <Input {...args} />,
};

/**
 * Email field.
 * Demonstrates using native validation type.
 */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

/**
 * Password field.
 * Demonstrates masked input behavior.
 */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '••••••••',
  },
};

/**
 * Disabled state.
 * Useful for readonly / unavailable form flows.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled',
  },
};

/**
 * Input with error state.
 * Illustrates how aria-invalid styling looks.
 */
export const ErrorState: Story = {
  args: {
    'aria-invalid': true,
    placeholder: 'Invalid value',
  },
};

/**
 * Controlled input example.
 * Uses React state to reflect user typing.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="flex flex-col items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Controlled..."
        />
        <p className="text-muted-foreground text-sm">
          Value: <span className="font-medium">{value || '(empty)'}</span>
        </p>
      </div>
    );
  },
};

/**
 * Search bar style usage.
 * Good for search UIs and filter forms.
 */
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

/**
 * File upload input.
 * Shows how file inputs look with custom styling.
 */
export const FileUpload: Story = {
  args: {
    type: 'file',
  },
};
