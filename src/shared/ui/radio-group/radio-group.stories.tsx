import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

import { Label } from '../label/label';
import { RadioGroup, RadioGroupItem } from './radio-group';

// --- META DEFINITION ---

const meta: Meta<typeof RadioGroup> = {
  title: 'shared/Form/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    defaultValue: 'option-1',
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Controlled value of the radio group.',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial value when used in uncontrolled mode.',
      table: {
        defaultValue: { summary: 'option-1' },
      },
    },
    disabled: {
      control: 'boolean',
      description:
        'When true, all radio items should be rendered in a disabled state (you must wire this yourself to each item).',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout direction for the radio group.',
    },
    className: {
      control: 'text',
      description: 'Custom className applied to the radio group root.',
    },
    children: {
      control: false,
      description: 'RadioGroupItem elements that belong to this group.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

// --- SMALL DEMO COMPONENTS FOR HOOKS ---

const BasicDemo: React.FC<React.ComponentProps<typeof RadioGroup>> = (props) => {
  return (
    <RadioGroup {...props} className="grid gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="r1" />
        <Label htmlFor="r1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="r2" />
        <Label htmlFor="r2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="r3" />
        <Label htmlFor="r3">Option 3</Label>
      </div>
    </RadioGroup>
  );
};

const ControlledDemo: React.FC = () => {
  const [value, setValue] = React.useState('monthly');

  return (
    <div className="flex flex-col gap-3">
      <RadioGroup value={value} onValueChange={setValue} className="grid gap-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="monthly" id="billing-monthly" />
          <Label htmlFor="billing-monthly">Monthly billing</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yearly" id="billing-yearly" />
          <Label htmlFor="billing-yearly">Yearly billing</Label>
        </div>
      </RadioGroup>
      <p className="text-muted-foreground text-xs">
        Selected: <span className="font-medium">{value}</span>
      </p>
    </div>
  );
};

const HorizontalDemo: React.FC<React.ComponentProps<typeof RadioGroup>> = (props) => {
  return (
    <RadioGroup
      {...props}
      className="flex flex-row items-center gap-4"
      aria-label="Horizontal example"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="left" id="align-left" />
        <Label htmlFor="align-left">Left</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="center" id="align-center" />
        <Label htmlFor="align-center">Center</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="right" id="align-right" />
        <Label htmlFor="align-right">Right</Label>
      </div>
    </RadioGroup>
  );
};

const ErrorStateDemo: React.FC = () => {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const showError = value == null;

  return (
    <div className="flex flex-col gap-2">
      <RadioGroup
        value={value}
        onValueChange={setValue}
        aria-invalid={showError}
        className="grid gap-2"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="basic" id="plan-basic" aria-invalid={showError} />
          <Label htmlFor="plan-basic">Basic</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="pro" id="plan-pro" aria-invalid={showError} />
          <Label htmlFor="plan-pro">Pro</Label>
        </div>
      </RadioGroup>
      {showError && <p className="text-destructive text-xs">Please select a plan to continue.</p>}
    </div>
  );
};

// --- STORIES ---

/**
 * Basic vertical RadioGroup.
 * Simple three-option example.
 */
export const Default: Story = {
  render: (args) => <BasicDemo {...args} />,
};

/**
 * Controlled RadioGroup.
 * Uses React state to reflect the selected value.
 */
export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

/**
 * Horizontal layout.
 * Useful for small sets like alignment options.
 */
export const Horizontal: Story = {
  args: {
    defaultValue: 'center',
  },
  render: (args) => <HorizontalDemo {...args} />,
};

/**
 * Error state demonstration.
 * Shows how to mark radios as invalid and display a message.
 */
export const ErrorState: Story = {
  render: () => <ErrorStateDemo />,
};
