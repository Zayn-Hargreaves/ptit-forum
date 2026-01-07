import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer";
import {
  BarChart,
  Minus,
  Plus,
  MoveRight,
  MoveLeft,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { useState } from "react";

// --- META DEFINITION ---

const meta: Meta<typeof Drawer> = {
  title: "shared/UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    shouldScaleBackground: true,
  },
  argTypes: {
    direction: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Hướng xuất hiện của Drawer.",
      table: {
        defaultValue: { summary: "bottom" },
      },
    },
    open: {
      control: "boolean",
      description: "Trạng thái mở/đóng (Controlled).",
    },
    onOpenChange: {
      action: "open changed",
      description: "Sự kiện thay đổi trạng thái.",
    },
    shouldScaleBackground: {
      control: "boolean",
      description: "Hiệu ứng thu nhỏ background khi mở Drawer.",
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
      <DrawerTrigger className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white">
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
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Calories/day
                </div>
              </div>
            </div>
            <div className="mt-3 h-[120px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground bg-muted/20">
              <BarChart className="h-8 w-8 opacity-50" />
            </div>
          </div>
          <DrawerFooter>
            <button className="inline-flex h-10 items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-black/90">
              Submit
            </button>
            <DrawerClose className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
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
    direction: "right",
  },
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
        <MoveRight className="mr-2 h-4 w-4" />
        Open Right Side
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Configuration</DrawerTitle>
          <DrawerDescription>
            Adjust your view settings from the side.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="h-24 rounded-md bg-muted/40 border border-dashed flex items-center justify-center">
            Setting Item 1
          </div>
          <div className="h-24 rounded-md bg-muted/40 border border-dashed flex items-center justify-center">
            Setting Item 2
          </div>
          <div className="h-24 rounded-md bg-muted/40 border border-dashed flex items-center justify-center">
            Setting Item 3
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose className="w-full inline-flex h-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-secondary/80">
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
        <DrawerTrigger className="inline-flex h-10 items-center justify-center rounded-md bg-orange-600 text-white px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-orange-700">
          Set Calorie Goal
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => onClick(-10)}
                  disabled={goal <= 200}
                  className="h-8 w-8 shrink-0 rounded-full border bg-background p-0 flex items-center justify-center hover:bg-accent disabled:opacity-50 shadow-sm"
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </button>
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">
                    {goal}
                  </div>
                  <div className="text-[0.70rem] uppercase text-muted-foreground">
                    Calories/day
                  </div>
                </div>
                <button
                  onClick={() => onClick(10)}
                  disabled={goal >= 400}
                  className="h-8 w-8 shrink-0 rounded-full border bg-background p-0 flex items-center justify-center hover:bg-accent disabled:opacity-50 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </button>
              </div>
              <div className="mt-3 h-[120px] w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground bg-muted/20">
                <BarChart className="h-8 w-8" />
              </div>
            </div>
            <DrawerFooter>
              <button className="inline-flex h-10 items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-black/90">
                Submit
              </button>
              <DrawerClose className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
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
        <DrawerTrigger className="flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed bg-muted/10 hover:bg-muted/30">
          <MoveDown className="mb-2 h-4 w-4" />
          Top
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Top Drawer</DrawerTitle>
              <DrawerDescription>Slide from the top.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 h-24">Content...</div>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Bottom */}
      <Drawer {...args} direction="bottom">
        <DrawerTrigger className="flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed bg-muted/10 hover:bg-muted/30">
          <MoveUp className="mb-2 h-4 w-4" />
          Bottom
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Bottom Drawer</DrawerTitle>
              <DrawerDescription>
                Slide from the bottom (Default).
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 h-24">Content...</div>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Left */}
      <Drawer {...args} direction="left">
        <DrawerTrigger className="flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed bg-muted/10 hover:bg-muted/30">
          <MoveRight className="mb-2 h-4 w-4" />
          Left
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Left Drawer</DrawerTitle>
            <DrawerDescription>Sidebar style navigation.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 h-full">Content...</div>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Right */}
      <Drawer {...args} direction="right">
        <DrawerTrigger className="flex h-20 w-full flex-col items-center justify-center rounded-md border border-dashed bg-muted/10 hover:bg-muted/30">
          <MoveLeft className="mb-2 h-4 w-4" />
          Right
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Right Drawer</DrawerTitle>
            <DrawerDescription>Details panel style.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 h-full">Content...</div>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  ),
};
