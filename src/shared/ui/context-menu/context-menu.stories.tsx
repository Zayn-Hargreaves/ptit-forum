import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  ArrowLeft,
  ArrowRight,
  FilePlus,
  FolderPlus,
  MoreHorizontal,
  Printer,
  RotateCcw,
  Save,
  Trash,
} from 'lucide-react';
import { useState } from 'react';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';

// --- META DEFINITION ---

const meta: Meta<typeof ContextMenu> = {
  title: 'shared/UI/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {},
  argTypes: {
    children: {
      control: false,
      description: 'Trigger và Content của menu.',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Sự kiện khi menu mở/đóng.',
    },
    modal: {
      control: 'boolean',
      description: 'Chặn tương tác với bên ngoài khi mở menu.',
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof ContextMenu>;

// --- STORIES ---

/**
 * Default Story.
 * Right-click the dashed area to see the menu.
 */
export const Default: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="text-muted-foreground bg-muted/20 hover:bg-muted/40 flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm font-medium transition-colors select-none">
        Click chuột phải vào đây
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          <ArrowRight className="mr-2 h-4 w-4" />
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          <Printer className="mr-2 h-4 w-4" />
          Print...
          <ContextMenuShortcut>⌘P</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          <Save className="mr-2 h-4 w-4" />
          Save As...
          <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * Complex Menu with Submenus.
 * Demonstrates nested navigation (Sub-menus).
 */
export const WithSubmenu: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="text-muted-foreground bg-muted/20 hover:bg-muted/40 flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm font-medium transition-colors select-none">
        Chuột phải (Có Submenu)
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <FilePlus className="mr-2 h-4 w-4" />
          New File
        </ContextMenuItem>
        <ContextMenuItem>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Folder
        </ContextMenuItem>
        <ContextMenuSeparator />

        {/* Submenu Start */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <MoreHorizontal className="mr-2 h-4 w-4" />
            More Tools
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        {/* Submenu End */}

        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/**
 * Checkbox & Radio Items.
 * Managing state within the Context Menu.
 */
export const StatefulItems: Story = {
  render: (args) => {
    const [showBookmarks, setShowBookmarks] = useState(true);
    const [showFullUrls, setShowFullUrls] = useState(false);
    const [person, setPerson] = useState('pedro');

    return (
      <ContextMenu {...args}>
        <ContextMenuTrigger className="text-muted-foreground bg-muted/20 hover:bg-muted/40 flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm font-medium transition-colors select-none">
          Chuột phải (Checkboxes & Radios)
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuLabel inset>View Options</ContextMenuLabel>
          <ContextMenuCheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
            Show Bookmarks Bar
            <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={showFullUrls} onCheckedChange={setShowFullUrls}>
            Show Full URLs
          </ContextMenuCheckboxItem>

          <ContextMenuSeparator />

          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
