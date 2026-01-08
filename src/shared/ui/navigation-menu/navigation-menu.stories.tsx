import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';

// --- META DEFINITION ---

const meta: Meta<typeof NavigationMenu> = {
  title: 'shared/UI/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    viewport: true,
  },
  argTypes: {
    viewport: {
      control: 'boolean',
      description: 'Whether to render the shared viewport (Radix navigation menu pattern).',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    children: {
      control: false,
      description: 'NavigationMenuList + NavigationMenuItem tree rendered inside the root.',
    },
    className: {
      control: 'text',
      description: 'Optional custom className for the navigation root.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof NavigationMenu>;

// --- STORIES ---

/**
 * Default navigation menu.
 * A typical “product / resources / pricing” top navigation.
 */
export const Default: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-3 md:w-[360px]">
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Dashboard</span>
                <span className="text-muted-foreground text-xs">
                  Get an overview of your activity, metrics, and status.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Automations</span>
                <span className="text-muted-foreground text-xs">
                  Create flows to automate your repetitive tasks.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Reports</span>
                <span className="text-muted-foreground text-xs">
                  Generate detailed insights and export data.
                </span>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-2 p-3 md:w-[280px]">
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Documentation</span>
                <span className="text-muted-foreground text-xs">
                  Learn how to integrate and customize the platform.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Tutorials</span>
                <span className="text-muted-foreground text-xs">
                  Step-by-step guides for common use cases.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Changelog</span>
                <span className="text-muted-foreground text-xs">
                  See what’s new in the latest releases.
                </span>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
    </NavigationMenu>
  ),
};

/**
 * Navigation menu without viewport.
 * Each menu uses its own popover-style content instead of the shared viewport.
 */
export const WithoutViewport: Story = {
  args: {
    viewport: false,
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Overview</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[260px] gap-2 p-3">
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Getting started</span>
                <span className="text-muted-foreground text-xs">
                  Learn the basics of using this UI kit.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Layouts</span>
                <span className="text-muted-foreground text-xs">
                  Explore different responsive layout patterns.
                </span>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
    </NavigationMenu>
  ),
};

/**
 * Simple link-only navigation.
 * Uses NavigationMenuLink directly without dropdown content.
 */
export const LinkOnlyMenu: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Features
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

/**
 * Navigation with multi-column mega menu.
 * Good for more complex information architectures.
 */
export const MegaMenu: Story = {
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-4 p-4 md:w-[520px] md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-semibold uppercase">For teams</p>
                <NavigationMenuLink href="#">
                  <span className="leading-snug font-medium">Product teams</span>
                  <span className="text-muted-foreground text-xs">
                    Collaborate across design, engineering, and product.
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <span className="leading-snug font-medium">Marketing teams</span>
                  <span className="text-muted-foreground text-xs">
                    Plan, launch, and measure campaigns in one place.
                  </span>
                </NavigationMenuLink>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-semibold uppercase">
                  For individuals
                </p>
                <NavigationMenuLink href="#">
                  <span className="leading-snug font-medium">Freelancers</span>
                  <span className="text-muted-foreground text-xs">
                    Manage clients, billing, and projects efficiently.
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <span className="leading-snug font-medium">Creators</span>
                  <span className="text-muted-foreground text-xs">
                    Build and share content with your community.
                  </span>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Company</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-2 p-3 md:w-[260px]">
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">About</span>
                <span className="text-muted-foreground text-xs">
                  Learn more about our mission and team.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Careers</span>
                <span className="text-muted-foreground text-xs">
                  Join us and help shape the future.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="leading-snug font-medium">Press</span>
                <span className="text-muted-foreground text-xs">
                  Press kit, brand assets, and contact info.
                </span>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
    </NavigationMenu>
  ),
};
