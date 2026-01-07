import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

import { Slider } from './slider';

// --- META DEFINITION ---

const meta: Meta<typeof Slider> = {
  title: 'shared/UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom className applied to the slider root.',
    },
    value: {
      control: 'object',
      description:
        'Controlled value of the slider. When provided, the slider behaves as a controlled component.',
    },
    defaultValue: {
      control: 'object',
      description:
        'Initial value of the slider in uncontrolled mode. Can be a single-value or range (array of numbers).',
    },
    min: {
      control: 'number',
      description: 'Minimum value of the slider.',
    },
    max: {
      control: 'number',
      description: 'Maximum value of the slider.',
    },
    step: {
      control: 'number',
      description: 'Step between values when moving the thumb.',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Slider orientation.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction when true.',
    },
  },
  args: {
    min: 0,
    max: 100,
    defaultValue: [40],
    orientation: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<typeof Slider>;

// --- STORIES ---

/**
 * Basic single-value horizontal slider.
 */
export const Default: Story = {
  render: (args) => <Slider {...args} />,
};

/**
 * Slider configured as a range (two thumbs).
 */
export const Range: Story = {
  args: {
    defaultValue: [20, 80],
  },
  render: (args) => <Slider {...args} />,
};

/**
 * Vertical slider, useful for audio or volume controls.
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    defaultValue: [60],
    className: 'h-48 max-w-10',
  },
  render: (args) => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Volume</span>
        <div className="flex h-48 items-center">
          <Slider {...args} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Disabled slider to showcase non-interactive state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: [50],
  },
  render: (args) => <Slider {...args} />,
};

/**
 * Slider inside a small form-like layout with a live value label.
 */
export const WithLabel: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<number[]>([50]);

    return (
      <div className="w-80 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Opacity</span>
          <span className="text-muted-foreground tabular-nums">{value[0]}%</span>
        </div>
        <Slider {...args} value={value} onValueChange={(val) => setValue(val)} />
      </div>
    );
  },
  parameters: {
    controls: {
      exclude: ['value', 'defaultValue', 'onValueChange'],
    },
  },
};

/**
 * Slider with simple tick labels rendered below to mimic marks.
 * (The slider itself stays generic; labels are purely visual.)
 */
export const WithTicks: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: [25],
  },
  render: (args) => {
    const ticks = [0, 25, 50, 75, 100];

    return (
      <div className="w-80 space-y-3">
        <Slider {...args} />
        <div className="text-muted-foreground relative flex justify-between text-[11px]">
          {ticks.map((tick) => (
            <span key={tick} className="flex flex-col items-center">
              <span className="bg-border h-2 w-px" />
              <span className="mt-1 tabular-nums">{tick}</span>
            </span>
          ))}
        </div>
      </div>
    );
  },
};
