import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Link as LinkIcon, MessageCircle, MoreHorizontal, Star } from 'lucide-react';
import React from 'react';

import { Badge } from '../badge/badge';
import { Button } from '../button/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './item';

// --- META DEFINITION ---

const meta: Meta<typeof Item> = {
  title: 'shared/UI/Item',
  component: Item,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'default',
    size: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'muted'],
      description: 'Visual variant of the item container.',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
      description: 'Padding and spacing size.',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description:
        'Render as a Radix Slot instead of a div (useful for turning the item into a link or button).',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom className applied to the root item element.',
    },
    children: {
      control: false,
      description: 'Composed layout inside the item (media, content, header, footer, actions…).',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Item>;

// --- STORIES ---

/**
 * Basic item.
 * Simple layout with title and description.
 */
export const Default: Story = {
  render: (args) => (
    <Item {...args} className="max-w-md">
      <ItemContent>
        <ItemTitle>Project Alpha</ItemTitle>
        <ItemDescription>
          A modern dashboard template with clean UI and flexible layout options.
        </ItemDescription>
      </ItemContent>
    </Item>
  ),
};

/**
 * Item with icon media on the left.
 * Great for lists of entities like projects, users, or resources.
 */
export const WithIconMedia: Story = {
  render: (args) => (
    <Item {...args} className="max-w-md">
      <ItemMedia variant="icon">
        <Star />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          Starred project
          <Badge variant="outline" className="text-[10px]">
            Priority
          </Badge>
        </ItemTitle>
        <ItemDescription>
          This project is marked as important and will appear at the top of your list.
        </ItemDescription>
      </ItemContent>
    </Item>
  ),
};

/**
 * Item with image media.
 * Useful for content like articles, products, or user avatars.
 */
export const WithImageMedia: Story = {
  render: (args) => (
    <Item {...args} className="max-w-md">
      <ItemMedia variant="image">
        {/* Replace with your own image if needed */}
        <img
          src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300"
          alt="Workspace"
        />
      </ItemMedia>
      <ItemContent>
        <ItemHeader>
          <ItemTitle>Design system refresh</ItemTitle>
          <ItemActions>
            <Badge variant="secondary">Design</Badge>
          </ItemActions>
        </ItemHeader>
        <ItemDescription>
          A quick overview of the latest updates to the component library and design tokens.
        </ItemDescription>
        <ItemFooter>
          <span className="text-muted-foreground text-xs">Updated 2 hours ago</span>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <MessageCircle className="size-3.5" />
            <span>12 comments</span>
          </div>
        </ItemFooter>
      </ItemContent>
    </Item>
  ),
};

/**
 * Item with actions.
 * Shows how to place buttons or icon actions on the right side.
 */
export const WithActions: Story = {
  render: (args) => (
    <Item {...args} className="max-w-md">
      <ItemContent>
        <ItemHeader>
          <ItemTitle>Marketing report Q4</ItemTitle>
          <ItemActions>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </ItemActions>
        </ItemHeader>
        <ItemDescription>
          Performance overview for the last quarter including KPIs and conversion metrics.
        </ItemDescription>
        <ItemFooter>
          <span className="text-muted-foreground text-xs">Last edited by Anna</span>
          <span className="text-muted-foreground text-xs">5 min read</span>
        </ItemFooter>
      </ItemContent>
    </Item>
  ),
};

/**
 * Item rendered as a link (asChild).
 * Useful when the entire row should be clickable.
 */
export const AsLink: Story = {
  args: {
    asChild: true,
    variant: 'outline',
    size: 'sm',
  },
  render: (args) => (
    <Item {...args} className="max-w-md">
      <a href="#demo" className="flex w-full items-stretch no-underline">
        <ItemMedia variant="icon">
          <LinkIcon />
        </ItemMedia>
        <ItemContent>
          <ItemHeader>
            <ItemTitle>Open in docs</ItemTitle>
            <ItemActions>
              <Badge variant="secondary" className="text-[10px]">
                New
              </Badge>
            </ItemActions>
          </ItemHeader>
          <ItemDescription>
            View the full documentation and guidelines for this component.
          </ItemDescription>
        </ItemContent>
      </a>
    </Item>
  ),
};

/**
 * Item group with separators.
 * Demonstrates how to compose a vertical list of items.
 */
export const GroupWithSeparators: Story = {
  render: () => (
    <ItemGroup className="bg-background w-full max-w-lg rounded-md border">
      <li>
        <Item size="sm">
          <ItemContent>
            <ItemHeader>
              <ItemTitle>Notifications</ItemTitle>
              <ItemActions>
                <Badge variant="outline" className="text-[10px]">
                  3 new
                </Badge>
              </ItemActions>
            </ItemHeader>
            <ItemDescription>
              Control how and when you receive updates from your teams.
            </ItemDescription>
          </ItemContent>
        </Item>
      </li>

      <ItemSeparator />

      <li>
        <Item size="sm" variant="muted">
          <ItemContent>
            <ItemHeader>
              <ItemTitle>Security</ItemTitle>
            </ItemHeader>
            <ItemDescription>
              Manage login methods, sessions, and two-factor authentication.
            </ItemDescription>
          </ItemContent>
        </Item>
      </li>

      <ItemSeparator />

      <li>
        <Item size="sm">
          <ItemContent>
            <ItemHeader>
              <ItemTitle>Billing</ItemTitle>
              <ItemActions>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </ItemActions>
            </ItemHeader>
            <ItemDescription>
              Update payment details, invoices, and subscription plans.
            </ItemDescription>
          </ItemContent>
        </Item>
      </li>
    </ItemGroup>
  ),
};
