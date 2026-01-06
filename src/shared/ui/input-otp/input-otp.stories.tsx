import { cn } from '@shared/lib/utils';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp';

// Loosen typing for stories so we can use `render` without fighting the union.
const RawInputOTP = InputOTP as any;

// --- META DEFINITION ---

const meta: Meta<typeof InputOTP> = {
  title: 'shared/Form/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    maxLength: 6,
  },
  argTypes: {
    maxLength: {
      control: 'number',
      description: 'Total number of OTP characters.',
      table: {
        defaultValue: { summary: '6' },
      },
    },
    value: {
      control: false,
      description: 'Controlled OTP value as a string.',
    },
    onChange: {
      action: 'changed',
      description: 'Called whenever the OTP value changes.',
    },
    containerClassName: {
      control: 'text',
      description: 'ClassName applied to the outer OTP container.',
    },
    className: {
      control: 'text',
      description: 'ClassName applied to the underlying input.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all OTP slots.',
    },
    render: {
      control: false,
      description: 'Render prop for custom layout. Used directly in the stories.',
    },
    children: {
      control: false,
      description: 'Alternative API from input-otp. Not used in these stories.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof InputOTP>;
type InputOTPStoryProps = React.ComponentProps<typeof InputOTP>;

// --- DEMO COMPONENTS (for hooks + clean lint) ---

const DefaultDemo: React.FC<InputOTPStoryProps> = (props) => {
  const [value, setValue] = React.useState('');

  const maxLength = props.maxLength ?? 6;

  return (
    <div className="flex flex-col items-center gap-3">
      <RawInputOTP
        {...props}
        value={value}
        onChange={(val: string) => setValue(val)}
        maxLength={maxLength}
        render={({ slots }: { slots: { id: string }[] }) => (
          <InputOTPGroup>
            {slots.map((slot, index) => (
              <InputOTPSlot key={slot.id} index={index} />
            ))}
          </InputOTPGroup>
        )}
      />
      <p className="text-muted-foreground text-xs">
        Current value: <span className="font-mono">{value || '(empty)'}</span>
      </p>
    </div>
  );
};

const WithSeparatorDemo: React.FC<InputOTPStoryProps> = (props) => {
  const [value, setValue] = React.useState('');

  const maxLength = props.maxLength ?? 6;

  return (
    <div className="flex flex-col items-center gap-3">
      <RawInputOTP
        {...props}
        value={value}
        onChange={(val: string) => setValue(val)}
        maxLength={maxLength}
        render={({ slots }: { slots: { id: string }[] }) => (
          <InputOTPGroup>
            {slots.slice(0, 3).map((slot, index) => (
              <InputOTPSlot key={slot.id} index={index} />
            ))}
            <InputOTPSeparator />
            {slots.slice(3).map((slot, index) => (
              <InputOTPSlot key={slot.id} index={index + 3} />
            ))}
          </InputOTPGroup>
        )}
      />
      <p className="text-muted-foreground text-xs">Enter the 6-digit code we sent to your email.</p>
    </div>
  );
};

const FourDigitDemo: React.FC<InputOTPStoryProps> = (props) => {
  const [value, setValue] = React.useState('');

  const maxLength = props.maxLength ?? 4;

  return (
    <RawInputOTP
      {...props}
      value={value}
      onChange={(val: string) => setValue(val)}
      maxLength={maxLength}
      render={({ slots }: { slots: { id: string }[] }) => (
        <InputOTPGroup>
          {slots.map((slot, index) => (
            <InputOTPSlot key={slot.id} index={index} />
          ))}
        </InputOTPGroup>
      )}
    />
  );
};

const ErrorDemo: React.FC<InputOTPStoryProps> = (props) => {
  const [value, setValue] = React.useState('123000');

  const maxLength = props.maxLength ?? 6;

  return (
    <div className="flex flex-col items-center gap-2">
      <RawInputOTP
        {...props}
        aria-invalid={true}
        value={value}
        onChange={(val: string) => setValue(val)}
        maxLength={maxLength}
        render={({ slots }: { slots: { id: string }[] }) => (
          <InputOTPGroup>
            {slots.map((slot, index) => (
              <InputOTPSlot key={slot.id} index={index} />
            ))}
          </InputOTPGroup>
        )}
      />
      <p className="text-destructive text-xs">
        The code you entered is incorrect. Please try again.
      </p>
    </div>
  );
};

const DisabledDemo: React.FC<InputOTPStoryProps> = (props) => {
  const value = '123456';
  const maxLength = props.maxLength ?? value.length;

  return (
    <RawInputOTP
      {...props}
      value={value}
      maxLength={maxLength}
      render={({ slots }: { slots: { id: string }[] }) => (
        <InputOTPGroup>
          {slots.map((slot, index) => (
            <InputOTPSlot key={slot.id} index={index} />
          ))}
        </InputOTPGroup>
      )}
    />
  );
};

const CustomStyledDemo: React.FC<InputOTPStoryProps> = (props) => {
  const [value, setValue] = React.useState('');

  const maxLength = props.maxLength ?? 6;

  return (
    <RawInputOTP
      {...props}
      containerClassName={cn('flex items-center gap-3', props.containerClassName)}
      className={cn('text-primary', props.className)}
      value={value}
      onChange={(val: string) => setValue(val)}
      maxLength={maxLength}
      render={({ slots }: { slots: { id: string }[] }) => (
        <InputOTPGroup className="gap-3">
          {slots.map((slot, index) => (
            <InputOTPSlot
              key={slot.id}
              index={index}
              className="bg-background/40 h-10 w-10 rounded-md"
            />
          ))}
        </InputOTPGroup>
      )}
    />
  );
};

// --- STORIES ---

/**
 * Default 6-digit OTP.
 * Simple, centered OTP entry with a controlled value.
 */
export const Default: Story = {
  render: (args) => <DefaultDemo {...args} />,
};

/**
 * Grouped OTP with separator.
 * Useful for formatting like 3-3 layouts.
 */
export const WithSeparator: Story = {
  args: {
    maxLength: 6,
  },
  render: (args) => <WithSeparatorDemo {...args} />,
};

/**
 * 4-digit code variant.
 * Commonly used for SMS verification flows.
 */
export const FourDigitCode: Story = {
  args: {
    maxLength: 4,
  },
  render: (args) => <FourDigitDemo {...args} />,
};

/**
 * Error state.
 * Demonstrates how invalid OTP styling looks with helper message.
 */
export const ErrorState: Story = {
  args: {
    maxLength: 6,
  },
  render: (args) => <ErrorDemo {...args} />,
};

/**
 * Disabled OTP input.
 * Slots are visible but cannot be edited.
 */
export const Disabled: Story = {
  args: {
    maxLength: 6,
    disabled: true,
  },
  render: (args) => <DisabledDemo {...args} />,
};

/**
 * OTP with custom spacing and styles.
 * Shows how to customize the container and slots while keeping behavior.
 */
export const CustomStyled: Story = {
  args: {
    maxLength: 6,
  },
  render: (args) => <CustomStyledDemo {...args} />,
};
