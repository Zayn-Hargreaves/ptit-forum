import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

// --- META DEFINITION ---

const meta: Meta<typeof HoverCard> = {
  title: 'shared/UI/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    openDelay: 200,
    closeDelay: 150,
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state of the hover card.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when the component is first mounted.',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback fired when the open state changes.',
    },
    openDelay: {
      control: 'number',
      description: 'Delay in milliseconds before the hover card opens after pointer enters.',
      table: {
        defaultValue: { summary: '200' },
      },
    },
    closeDelay: {
      control: 'number',
      description: 'Delay in milliseconds before the hover card closes after pointer leaves.',
      table: {
        defaultValue: { summary: '150' },
      },
    },
    children: {
      control: false,
      description: 'Content inside the HoverCard (Trigger + HoverCardContent).',
    },
  },
};

export default meta;

type Story = StoryObj<typeof HoverCard>;

// --- STORIES ---

/**
 * Default hover card.
 * Simple profile-style preview when hovering a trigger.
 */
export const Default: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm">
        Hover me
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-4">
          <div className="bg-muted size-10 rounded-full" />
          <div className="space-y-1 text-sm">
            <p className="leading-tight font-semibold">Jane Doe</p>
            <p className="text-muted-foreground text-xs">
              Frontend engineer · Loves design systems, clean UI, and good coffee.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/**
 * Hover card used as a "preview tooltip".
 * Useful for showing preview details for links or entities.
 */
export const LinkPreview: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger className="text-primary hover:text-primary/80 text-sm underline underline-offset-4">
        Hover to preview article
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Designing better empty states for your product</p>
          <p className="text-muted-foreground text-xs">
            Learn how to guide users when there&apos;s no data yet, and turn empty screens into
            opportunities.
          </p>
          <div className="text-muted-foreground flex items-center justify-between pt-1 text-[11px]">
            <span>6 min read</span>
            <span>UI/UX · Best practices</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/**
 * Placement variations.
 * Shows how the hover card behaves on different sides of the trigger.
 */
export const PlacementGallery: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      {/* Top */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Top</span>
        <HoverCard {...args}>
          <HoverCardTrigger className="bg-muted/10 hover:bg-muted/30 rounded-md border border-dashed px-3 py-1.5 text-xs">
            Hover (top)
          </HoverCardTrigger>
          <HoverCardContent side="top">
            <p className="text-xs">This hover card appears above the trigger.</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Bottom</span>
        <HoverCard {...args}>
          <HoverCardTrigger className="bg-muted/10 hover:bg-muted/30 rounded-md border border-dashed px-3 py-1.5 text-xs">
            Hover (bottom)
          </HoverCardTrigger>
          <HoverCardContent side="bottom">
            <p className="text-xs">This hover card appears below the trigger.</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Left */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Left</span>
        <HoverCard {...args}>
          <HoverCardTrigger className="bg-muted/10 hover:bg-muted/30 rounded-md border border-dashed px-3 py-1.5 text-xs">
            Hover (left)
          </HoverCardTrigger>
          <HoverCardContent side="left">
            <p className="text-xs">This hover card appears on the left side.</p>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Right */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs">Right</span>
        <HoverCard {...args}>
          <HoverCardTrigger className="bg-muted/10 hover:bg-muted/30 rounded-md border border-dashed px-3 py-1.5 text-xs">
            Hover (right)
          </HoverCardTrigger>
          <HoverCardContent side="right">
            <p className="text-xs">This hover card appears on the right side.</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  ),
};

/**
 * Hover card with custom delay.
 * Useful when you want a more "relaxed" hover interaction.
 */
export const WithCustomDelay: Story = {
  args: {
    openDelay: 500,
    closeDelay: 300,
  },
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium">
        Slow hover
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm font-medium">Delayed hover card</p>
        <p className="text-muted-foreground mt-1 text-xs">
          This card waits a bit longer before opening and closing. Helpful when users move the
          cursor quickly across the screen.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};

/**
 * Hover card inside text.
 * Demonstrates usage inline with a paragraph of text.
 */
export const InlineTextUsage: Story = {
  render: (args) => (
    <p className="text-muted-foreground max-w-xl text-sm">
      You can use a{' '}
      <HoverCard {...args}>
        <HoverCardTrigger className="text-primary cursor-pointer underline underline-offset-4">
          hover card
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="text-sm font-medium">Inline hover card</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Great for explaining terms, showing definitions, or giving extra context without
            navigating away.
          </p>
        </HoverCardContent>
      </HoverCard>{' '}
      inline with text to provide extra details without cluttering the interface or sending the user
      to a new page.
    </p>
  ),
};
