import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BarChart, Minus, MoveDown, MoveLeft, MoveRight, MoveUp, Plus } from 'lucide-react';
import { useState } from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

// --- META DEFINITION ---

const meta: Meta<typeof Drawer> = {
  title: 'shared/UI/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    shouldScaleBackground: true,
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Hướng xuất hiện của Drawer.',
      table: {
        defaultValue: { summary: 'bottom' },
      },
    },
    open: {
      control: 'boolean',
      description: 'Trạng thái mở/đóng (Controlled).',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Sự kiện thay đổi trạng thái.',
    },
    shouldScaleBackground: {
      control: 'boolean',
      description: 'Hiệu ứng thu nhỏ background khi mở Drawer.',
    },
    children: {
      control: false,
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Drawer>;

// --- STORIES ---

/**
 * Default Story (Bottom).
 * Standard usage for mobile-first actions.
 */
export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
        Open Drawer
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">350</div>
                <div className="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
              </div>
            </div>
            <div className="text-muted-foreground bg-muted/20 mt-3 flex h-[120px] w-full items-center justify-center rounded-md border border-dashed">
              <BarChart className="h-8 w-8 opacity-50" />
            </div>
          </div>
          <DrawerFooter>
            <button className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90">
              Submit
            </button>
            <DrawerClose className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors">
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Right Side Drawer.
 * Often used for menus or detailed filters on desktop/tablet.
 */
export const DirectionRight: Story = {
  args: {
    direction: 'right',
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors">
        <MoveRight className="mr-2 h-4 w-4" />
        Open Right Side
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Configuration</DrawerTitle>
          <DrawerDescription>Adjust your view settings from the side.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 p-4">
          <div className="bg-muted/40 flex h-24 items-center justify-center rounded-md border border-dashed">
            Setting Item 1
          </div>
          <div className="bg-muted/40 flex h-24 items-center justify-center rounded-md border border-dashed">
            Setting Item 2
          </div>
          <div className="bg-muted/40 flex h-24 items-center justify-center rounded-md border border-dashed">
            Setting Item 3
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm">
            Close Panel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Interactive Goal Setter.
 * Uses React state inside the component to simulate a real use-case.
 */
export const InteractiveGoal: Story = {
  render: (args) => {
    const [goal, setGoal] = useState(350);

    function onClick(adjustment: number) {
      setGoal(Math.max(200, Math.min(400, goal + adjustment)));
    }

    return (
      <Drawer {...args}>
        <DrawerTrigger className="inline-flex h-10 items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-orange-700">
          Set Calorie Goal
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => onClick(-10)}
                  disabled={goal <= 200}
                  className="bg-background hover:bg-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full border p-0 shadow-sm disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </button>
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">{goal}</div>
                  <div className="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
                </div>
                <button
                  onClick={() => onClick(10)}
                  disabled={goal >= 400}
                  className="bg-background hover:bg-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full border p-0 shadow-sm disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </button>
              </div>
              <div className="text-muted-foreground bg-muted/20 mt-3 flex h-[120px] w-full items-center justify-center rounded-md border border-dashed">
                <BarChart className="h-8 w-8" />
              </div>
            </div>
            <DrawerFooter>
              <button className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90">
                Submit
              </button>
              <DrawerClose className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors">
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
};

/**
 * Direction Playground.
 * Shows all 4 directions for testing UI behaviors.
 */
export const DirectionGallery: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-4">
      {/* Top */}
      <Drawer {...args} direction="top">
        <DrawerTrigger className="bg-muted/10 hover:bg-muted/30 flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed">
          <MoveDown className="mb-2 h-4 w-4" />
          Top
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Top Drawer</DrawerTitle>
              <DrawerDescription>Slide from the top.</DrawerDescription>
            </DrawerHeader>
            <div className="h-24 p-4">Content...</div>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Bottom */}
      <Drawer {...args} direction="bottom">
        <DrawerTrigger className="bg-muted/10 hover:bg-muted/30 flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed">
          <MoveUp className="mb-2 h-4 w-4" />
          Bottom
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Bottom Drawer</DrawerTitle>
              <DrawerDescription>Slide from the bottom (Default).</DrawerDescription>
            </DrawerHeader>
            <div className="h-24 p-4">Content...</div>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Left */}
      <Drawer {...args} direction="left">
        <DrawerTrigger className="bg-muted/10 hover:bg-muted/30 flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed">
          <MoveRight className="mb-2 h-4 w-4" />
          Left
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Left Drawer</DrawerTitle>
            <DrawerDescription>Sidebar style navigation.</DrawerDescription>
          </DrawerHeader>
          <div className="h-full p-4">Content...</div>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Right */}
      <Drawer {...args} direction="right">
        <DrawerTrigger className="bg-muted/10 hover:bg-muted/30 flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed">
          <MoveLeft className="mb-2 h-4 w-4" />
          Right
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Right Drawer</DrawerTitle>
            <DrawerDescription>Details panel style.</DrawerDescription>
          </DrawerHeader>
          <div className="h-full p-4">Content...</div>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  ),
};
