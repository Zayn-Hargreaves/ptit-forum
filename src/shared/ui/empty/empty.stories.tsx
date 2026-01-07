import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "./empty";
import {
  Inbox,
  Package,
  Search,
  AlertTriangle,
  Plus,
  RefreshCw,
} from "lucide-react";

// --- META DEFINITION ---

const meta: Meta<typeof Empty> = {
  title: "shared/UI/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {},
  argTypes: {
    className: {
      control: "text",
      description: "Custom className to extend the base Empty styles.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    children: {
      control: false,
      description:
        "Custom content to render inside the Empty container (usually composed from EmptyHeader, EmptyContent, etc.).",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Empty>;

// --- STORIES ---

/**
 * Default.
 * Simple empty state for when there is no data in a list or page.
 */
export const Default: Story = {
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No items yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added anything here. Start by creating a new item and
          it will show up in this space.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="mr-2 size-4" />
          Add item
        </button>
      </EmptyContent>
    </Empty>
  ),
};

/**
 * Empty state for a search page.
 * Great for "no search results" scenarios.
 */
export const SearchEmpty: Story = {
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          Try adjusting your filters or search query. Make sure all words are
          spelled correctly.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
          Clear filters
        </button>
      </EmptyContent>
    </Empty>
  ),
};

/**
 * Empty state for an "empty inbox" or notifications screen.
 * More minimal layout with a lighter description.
 */
export const InboxEmpty: Story = {
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package />
        </EmptyMedia>
        <EmptyTitle>All caught up</EmptyTitle>
        <EmptyDescription>
          There are no new notifications at the moment. We&apos;ll let you know
          when something changes.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
          <RefreshCw className="mr-2 size-4" />
          Refresh
        </button>
      </EmptyContent>
    </Empty>
  ),
};

/**
 * Empty state with a link inside description.
 * Demonstrates how clickable links look inside the component.
 */
export const WithLinkInDescription: Story = {
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangle />
        </EmptyMedia>
        <EmptyTitle>Something went wrong</EmptyTitle>
        <EmptyDescription>
          We couldn&apos;t load your data. Please{" "}
          <a href="#">try again later</a> or <a href="#">contact support</a> if
          the problem persists.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground shadow hover:bg-destructive/90">
          Retry
        </button>
      </EmptyContent>
    </Empty>
  ),
};

/**
 * Playground.
 * Small grid that showcases different empty use cases side-by-side.
 */
export const Playground: Story = {
  render: (args) => (
    <div className="grid gap-6 md:grid-cols-2">
      {/* List empty */}
      <Empty {...args} className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>Empty list</EmptyTitle>
          <EmptyDescription>
            Create your first record to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90">
            New record
          </button>
        </EmptyContent>
      </Empty>

      {/* Search empty */}
      <Empty {...args} className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search />
          </EmptyMedia>
          <EmptyTitle>No matches</EmptyTitle>
          <EmptyDescription>
            Try a different keyword or remove some filters.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
            Reset filters
          </button>
        </EmptyContent>
      </Empty>
    </div>
  ),
};
