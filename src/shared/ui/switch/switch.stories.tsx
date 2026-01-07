import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

import { Switch } from './switch';

// --- META DEFINITION ---

const meta: Meta<typeof Switch> = {
  title: 'shared/UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom className applied to the switch root element.',
    },
    checked: {
      control: 'boolean',
      description:
        'Controlled checked state of the switch. When provided, the switch behaves as a controlled component.',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state of the switch in uncontrolled mode.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction when true.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required in a form context.',
    },
    name: {
      control: 'text',
      description: 'Name attribute passed to the underlying input.',
    },
    value: {
      control: 'text',
      description: 'Value attribute passed to the underlying input.',
    },
    onCheckedChange: {
      table: {
        category: 'Events',
      },
      control: false,
      description:
        'Event handler called when the checked state changes. Receives the next boolean value.',
    },
    asChild: {
      control: 'boolean',
      description: 'When true, changes the rendered element to the passed child component.',
    },
  },
  args: {
    defaultChecked: true,
    disabled: false,
  },
};

export default meta;

// Use meta to correctly infer the args / props type
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Basic switch with default styling and defaultChecked set to true.
 */
export const Default: Story = {
  render: (args) => <Switch {...args} />,
};

/**
 * Disabled switch to demonstrate non-interactive state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => <Switch {...args} />,
};

/**
 * Switch with label and description, using controlled state
 * to demonstrate how to wire it in real UI.
 */
export const WithLabel: Story = {
  render: (args) => {
    const [enabled, setEnabled] = React.useState<boolean>(true);

    return (
      <div className="flex items-center gap-3">
        <div className="space-y-0.5">
          <p className="text-sm leading-none font-medium">Airplane mode</p>
          <p className="text-muted-foreground text-xs">
            Disable all wireless connections on this device.
          </p>
        </div>
        <Switch
          {...args}
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label="Toggle airplane mode"
        />
      </div>
    );
  },
  parameters: {
    controls: {
      // Avoid conflicting with internal controlled state
      exclude: ['checked', 'defaultChecked', 'onCheckedChange'],
    },
  },
};

/**
 * Switch aligned to the right inside a settings row,
 * simulating a common preferences layout.
 */
export const SettingsRow: Story = {
  render: (args) => (
    <div className="bg-card w-80 rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-sm leading-none font-medium">Enable notifications</p>
          <p className="text-muted-foreground text-xs">
            Receive push notifications about important activity.
          </p>
        </div>
        <Switch {...args} aria-label="Toggle notifications" />
      </div>
    </div>
  ),
};
