import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
} from "./navigation-menu";

// --- META DEFINITION ---

const meta: Meta<typeof NavigationMenu> = {
  title: "shared/UI/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    viewport: true,
  },
  argTypes: {
    viewport: {
      control: "boolean",
      description:
        "Whether to render the shared viewport (Radix navigation menu pattern).",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    children: {
      control: false,
      description:
        "NavigationMenuList + NavigationMenuItem tree rendered inside the root.",
    },
    className: {
      control: "text",
      description: "Optional custom className for the navigation root.",
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
                <span className="font-medium leading-snug">Dashboard</span>
                <span className="text-xs text-muted-foreground">
                  Get an overview of your activity, metrics, and status.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="font-medium leading-snug">Automations</span>
                <span className="text-xs text-muted-foreground">
                  Create flows to automate your repetitive tasks.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="font-medium leading-snug">Reports</span>
                <span className="text-xs text-muted-foreground">
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
                <span className="font-medium leading-snug">Documentation</span>
                <span className="text-xs text-muted-foreground">
                  Learn how to integrate and customize the platform.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="font-medium leading-snug">Tutorials</span>
                <span className="text-xs text-muted-foreground">
                  Step-by-step guides for common use cases.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="font-medium leading-snug">Changelog</span>
                <span className="text-xs text-muted-foreground">
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
            <div className="grid gap-2 p-3 w-[260px]">
              <NavigationMenuLink href="#">
                <span className="font-medium leading-snug">
                  Getting started
                </span>
                <span className="text-xs text-muted-foreground">
                  Learn the basics of using this UI kit.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="font-medium leading-snug">Layouts</span>
                <span className="text-xs text-muted-foreground">
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
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  For teams
                </p>
                <NavigationMenuLink href="#">
                  <span className="font-medium leading-snug">
                    Product teams
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Collaborate across design, engineering, and product.
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <span className="font-medium leading-snug">
                    Marketing teams
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Plan, launch, and measure campaigns in one place.
                  </span>
                </NavigationMenuLink>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  For individuals
                </p>
                <NavigationMenuLink href="#">
                  <span className="font-medium leading-snug">Freelancers</span>
                  <span className="text-xs text-muted-foreground">
                    Manage clients, billing, and projects efficiently.
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <span className="font-medium leading-snug">Creators</span>
                  <span className="text-xs text-muted-foreground">
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
                <span className="font-medium leading-snug">About</span>
                <span className="text-xs text-muted-foreground">
                  Learn more about our mission and team.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="font-medium leading-snug">Careers</span>
                <span className="text-xs text-muted-foreground">
                  Join us and help shape the future.
                </span>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <span className="font-medium leading-snug">Press</span>
                <span className="text-xs text-muted-foreground">
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
