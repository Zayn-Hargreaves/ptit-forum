import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "./field";
import { useState } from "react";

// --- META DEFINITION ---

const meta: Meta<typeof FieldSet> = {
  title: "shared/Form/Field",
  component: FieldSet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    className: "max-w-xl",
  },
  argTypes: {
    className: {
      control: "text",
      description: "Custom className to style the FieldSet container.",
      table: {
        defaultValue: { summary: "max-w-xl" },
      },
    },
    children: {
      control: false,
      description:
        "Field structure inside the FieldSet (Field, FieldLegend, FieldGroup, etc.).",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FieldSet>;

// --- STORIES ---

/**
 * Basic vertical layout.
 * Shows a typical form section with a few simple fields.
 */
export const Vertical: Story = {
  render: (args) => (
    <FieldSet {...args}>
      <FieldLegend>Profile information</FieldLegend>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <FieldContent>
            <input
              id="name"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="John Doe"
            />
            <FieldDescription>
              This will be displayed on your public profile.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <input
              id="email"
              type="email"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="you@example.com"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <FieldContent>
            <textarea
              id="bio"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Tell us a little bit about yourself…"
            />
            <FieldDescription>
              Brief description for your profile. You can use up to 160
              characters.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

/**
 * Horizontal layout.
 * Labels on the left, controls on the right (good for desktop settings pages).
 */
export const Horizontal: Story = {
  render: (args) => (
    <FieldSet {...args}>
      <FieldLegend variant="label">Account settings</FieldLegend>

      <FieldGroup>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <FieldContent>
            <input
              id="username"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="@username"
            />
            <FieldDescription>
              This is your unique username. You can change it later.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field orientation="horizontal">
          <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
          <FieldContent>
            <select
              id="timezone"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select timezone</option>
              <option value="asia-bangkok">Asia/Bangkok</option>
              <option value="europe-london">Europe/London</option>
              <option value="america-new-york">America/New_York</option>
            </select>
            <FieldDescription>
              Used for scheduling, notifications, and reports.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field orientation="horizontal">
          <FieldLabel htmlFor="language">Language</FieldLabel>
          <FieldContent>
            <select
              id="language"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

/**
 * Responsive layout.
 * Stacks on small screens and switches to horizontal layout on larger screens.
 */
export const Responsive: Story = {
  render: (args) => (
    <FieldSet {...args}>
      <FieldLegend>Notification preferences</FieldLegend>

      <FieldGroup>
        <Field orientation="responsive">
          <FieldLabel htmlFor="notif-email">Email notifications</FieldLabel>
          <FieldContent>
            <select
              id="notif-email"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All activity</option>
              <option value="important">Only important</option>
              <option value="none">None</option>
            </select>
            <FieldDescription>
              Choose how often we should send you email updates.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field orientation="responsive">
          <FieldLabel htmlFor="notif-push">Push notifications</FieldLabel>
          <FieldContent>
            <select
              id="notif-push"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All activity</option>
              <option value="mentions">Mentions only</option>
              <option value="none">None</option>
            </select>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

/**
 * FieldSet with separator and legend.
 * Good for splitting a large form into smaller logical sections.
 */
export const WithSeparator: Story = {
  render: (args) => (
    <FieldSet {...args}>
      <FieldLegend>Account</FieldLegend>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email-2">Email address</FieldLabel>
          <FieldContent>
            <input
              id="email-2"
              type="email"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="you@example.com"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldContent>
            <input
              id="password"
              type="password"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="••••••••"
            />
            <FieldDescription>
              Use at least 8 characters, including one number.
            </FieldDescription>
          </FieldContent>
        </Field>

        <FieldSeparator>Security</FieldSeparator>

        <Field>
          <FieldLabel>Two-factor authentication</FieldLabel>
          <FieldContent>
            <p className="text-sm">
              Add an extra layer of security to your account.
            </p>
            <button className="mt-2 inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
              Set up 2FA
            </button>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

/**
 * Field with error messages.
 * Demonstrates both single and multiple error messages from validation.
 */
export const WithErrors: Story = {
  render: (args) => {
    const [submitted, setSubmitted] = useState(false);

    const errors = submitted
      ? [
          { message: "Name is required." },
          { message: "Email must be a valid address." },
        ]
      : [];

    return (
      <FieldSet {...args}>
        <FieldLegend>Validation example</FieldLegend>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="error-name">Name</FieldLabel>
            <FieldContent>
              <input
                id="error-name"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-invalid={submitted}
              />
              <FieldDescription>
                This field will show errors when you click &quot;Validate&quot;.
              </FieldDescription>
              <FieldError errors={errors} />
            </FieldContent>
          </Field>
        </FieldGroup>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Validate
          </button>
        </div>
      </FieldSet>
    );
  },
};

/**
 * Field group with checkboxes and radios.
 * Uses data-slot attributes to trigger the field-group specific styles.
 */
export const CheckboxRadioGroup: Story = {
  render: (args) => (
    <FieldSet {...args}>
      <FieldLegend>Preferences</FieldLegend>

      <FieldGroup>
        {/* Simulated checkbox group using data-slot */}
        <div data-slot="checkbox-group" className="flex flex-col gap-3">
          <FieldTitle>Notifications</FieldTitle>
          <FieldDescription>
            Choose which updates you want to receive.
          </FieldDescription>

          <div className="flex flex-col gap-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border" />
              Email updates
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border" />
              Product announcements
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border" />
              Security alerts
            </label>
          </div>
        </div>

        <FieldSeparator />

        {/* Simulated radio group using data-slot */}
        <div data-slot="radio-group" className="flex flex-col gap-3">
          <FieldTitle>Theme</FieldTitle>
          <FieldDescription>
            You can change this later in your profile settings.
          </FieldDescription>

          <div className="flex flex-col gap-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="theme" className="h-4 w-4" />
              System default
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="theme" className="h-4 w-4" />
              Light
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="theme" className="h-4 w-4" />
              Dark
            </label>
          </div>
        </div>
      </FieldGroup>
    </FieldSet>
  ),
};
