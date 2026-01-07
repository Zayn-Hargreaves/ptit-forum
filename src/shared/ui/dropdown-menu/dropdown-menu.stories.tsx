import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Bold, ChevronRight, Italic, Settings, Trash2, Underline, User } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

// --- META DEFINITION ---

const meta: Meta<typeof DropdownMenu> = {
  title: 'shared/UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    modal: true,
  },
  argTypes: {
    modal: {
      control: 'boolean',
      description: 'Whether the dropdown is modal (focus is trapped) or non-modal.',
      table: {
        defaultValue: { summary: 'true' }, // ✅ must be string
      },
    },
    open: {
      control: 'boolean',
      description: 'Open/close state (controlled).',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback fired when the open state changes.',
    },
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl'],
      description: 'Text direction for the dropdown (useful for i18n).',
    },
    children: {
      control: false,
      description: 'Content inside DropdownMenu (Trigger + Content).',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

// --- STORIES ---

/**
 * Default dropdown.
 * Basic action menu with a few common items.
 */
export const Default: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="size-4" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="size-4" />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 className="size-4" />
          Delete item
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Dropdown with checkbox items.
 * Useful for toggling visibility settings or preferences.
 */
export const WithCheckboxItems: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors">
        View options
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Display</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem defaultChecked>Show line numbers</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Show minimap</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Word wrap</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Dropdown with radio items.
 * Good for “select one of many” scenarios like sorting or layout mode.
 */
export const WithRadioItems: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm">
        Sort by
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup defaultValue="recent">
          <DropdownMenuRadioItem value="recent">Recently updated</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="created">Date created</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Dropdown with a submenu.
 * Mimics editor-style menus like “Format” with nested options.
 */
export const WithSubmenu: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow hover:bg-black/90">
        Format
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Text style</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Bold className="size-4" />
          Bold
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Italic className="size-4" />
          Italic
          <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Underline className="size-4" />
          Underline
          <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>
            More…
            <ChevronRight className="size-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Title case</DropdownMenuItem>
            <DropdownMenuItem>Sentence case</DropdownMenuItem>
            <DropdownMenuItem>UPPERCASE</DropdownMenuItem>
            <DropdownMenuItem>lowercase</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * Playground.
 * Small grid to quickly test several dropdown variants.
 */
export const Playground: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      {/* Basic menu */}
      <DropdownMenu {...args}>
        <DropdownMenuTrigger className="bg-muted/10 hover:bg-muted/30 flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed text-sm">
          Basic menu
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem>New tab</DropdownMenuItem>
          <DropdownMenuItem>New window</DropdownMenuItem>
          <DropdownMenuItem>Open file…</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu with shortcuts & destructive action */}
      <DropdownMenu {...args}>
        <DropdownMenuTrigger className="bg-muted/10 hover:bg-muted/30 flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed text-sm">
          With shortcuts
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            Duplicate
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Archive
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 className="size-4" />
            Delete permanently
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
