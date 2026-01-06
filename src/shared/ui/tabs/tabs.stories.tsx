import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

// --- META DEFINITION ---

const meta: Meta<typeof Tabs> = {
  title: 'shared/UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom className applied to the tabs root container.',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial value for uncontrolled tabs. Matches the `value` of a TabsTrigger.',
    },
    value: {
      control: 'text',
      description:
        'Controlled active tab value. When provided, the component behaves as a controlled tabs.',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Controls whether tabs are laid out horizontally or vertically.',
    },
    dir: {
      control: 'inline-radio',
      options: ['ltr', 'rtl'],
      description: 'Direction of layout for the tabs (left-to-right or right-to-left).',
    },
    onValueChange: {
      table: {
        category: 'Events',
      },
      control: false,
      description: 'Callback fired when the tab value changes. Receives the new value as a string.',
    },
  },
  args: {
    defaultValue: 'account',
    orientation: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Basic tab layout with three triggers and matching content panels.
 */
export const Default: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[22rem]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="mt-2">
        <div className="bg-card rounded-md border p-4 text-sm">
          Manage your profile information and basic account settings.
        </div>
      </TabsContent>

      <TabsContent value="password" className="mt-2">
        <div className="bg-card rounded-md border p-4 text-sm">
          Change your password and update security preferences.
        </div>
      </TabsContent>

      <TabsContent value="billing" className="mt-2">
        <div className="bg-card rounded-md border p-4 text-sm">
          View invoices, payment methods, and subscription details.
        </div>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Tabs with icons and a more "app-like" layout.
 */
export const WithIcons: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[24rem]">
      <TabsList>
        <TabsTrigger value="overview">
          <span role="img" aria-hidden="true">
            📊
          </span>
          Overview
        </TabsTrigger>
        <TabsTrigger value="activity">
          <span role="img" aria-hidden="true">
            📜
          </span>
          Activity
        </TabsTrigger>
        <TabsTrigger value="settings">
          <span role="img" aria-hidden="true">
            ⚙️
          </span>
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-2">
        <div className="bg-card rounded-md border p-4 text-sm">
          High-level metrics and quick insights into your account.
        </div>
      </TabsContent>

      <TabsContent value="activity" className="mt-2">
        <div className="bg-card rounded-md border p-4 text-sm">
          Timeline of recent actions, login history, and changes.
        </div>
      </TabsContent>

      <TabsContent value="settings" className="mt-2">
        <div className="bg-card rounded-md border p-4 text-sm">
          Fine-grained configuration for notifications and integrations.
        </div>
      </TabsContent>
    </Tabs>
  ),
  args: {
    defaultValue: 'overview',
  },
};

/**
 * Vertical tabs layout, commonly used in settings or side navigation.
 */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    defaultValue: 'general',
  },
  render: (args) => (
    <Tabs {...args} className="flex w-[32rem] gap-4">
      <TabsList className="flex h-fit flex-col">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <div className="flex-1">
        <TabsContent value="general">
          <div className="bg-card rounded-md border p-4 text-sm">
            Configure language, theme, and basic preferences.
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="bg-card rounded-md border p-4 text-sm">
            Decide how and when you receive email or push notifications.
          </div>
        </TabsContent>
        <TabsContent value="security">
          <div className="bg-card rounded-md border p-4 text-sm">
            Two-factor authentication, sessions, and login alerts.
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

/**
 * Controlled tabs example showing how to sync the value with local state
 * and interact with the tabs from outside controls.
 */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string>('profile');

    return (
      <div className="w-[26rem] space-y-4">
        <Tabs {...args} value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-2">
            <div className="bg-card rounded-md border p-4 text-sm">
              Edit your personal information and avatar.
            </div>
          </TabsContent>
          <TabsContent value="team" className="mt-2">
            <div className="bg-card rounded-md border p-4 text-sm">
              Manage teammates, roles, and invitations.
            </div>
          </TabsContent>
          <TabsContent value="plan" className="mt-2">
            <div className="bg-card rounded-md border p-4 text-sm">
              Upgrade, downgrade, or cancel your current subscription.
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>Current value:</span>
          <code className="bg-muted rounded px-2 py-0.5 text-[11px]">{value}</code>
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-md border px-2 py-1 text-xs"
            onClick={() => setValue('profile')}
          >
            Go to Profile
          </button>
          <button className="rounded-md border px-2 py-1 text-xs" onClick={() => setValue('team')}>
            Go to Team
          </button>
          <button className="rounded-md border px-2 py-1 text-xs" onClick={() => setValue('plan')}>
            Go to Plan
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    controls: {
      // Avoid conflicting with internal controlled state
      exclude: ['value', 'defaultValue', 'onValueChange'],
    },
  },
};
