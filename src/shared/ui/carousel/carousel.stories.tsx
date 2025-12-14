import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Card, CardContent } from "../card/card";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

// --- META DEFINITION ---

const meta: Meta<typeof Carousel> = {
  title: "shared/UI/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Hướng trượt của Carousel (Ngang/Dọc).",
    },
    opts: {
      control: "object",
      description:
        "Các tùy chọn cấu hình của Embla Carousel (loop, align, ...).",
    },
    setApi: {
      action: "api set",
      description: "Callback nhận về instance API để điều khiển Carousel.",
    },
    className: {
      description: "Class tùy chỉnh cho container chính.",
    },
    plugins: {
      control: false,
      description: "Các plugin của Embla (Autoplay, AutoScroll...).",
    },
  },
  // Decorator để tạo khoảng trống cho 2 nút mũi tên 2 bên
  decorators: [
    (Story) => (
      <div className="w-full max-w-xs px-12 py-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Carousel>;

// Helper tạo mảng số
const slideItems = Array.from({ length: 5 }, (_, i) => i + 1);

// --- STORIES ---

/**
 * Default Story.
 * A simple horizontal carousel with navigation buttons.
 */
export const Default: Story = {
  render: (args) => (
    <Carousel className="w-full max-w-xs" {...args}>
      <CarouselContent>
        {slideItems.map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Multiple Items per Slide.
 * Adjusts the `basis` (width) of CarouselItem to show multiple items at once.
 * Example: `basis-1/2` shows 2 items, `basis-1/3` shows 3 items.
 */
export const MultipleItems: Story = {
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg px-12">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-lg"
      {...args}
    >
      <CarouselContent>
        {slideItems.map((_, index) => (
          // basis-1/2 means 50% width -> 2 items visible
          // basis-1/3 means 33.33% width -> 3 items visible
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Vertical Orientation.
 * Note: Provide a fixed height for the CarouselContent when using vertical mode.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
    opts: {
      align: "start",
    },
  },
  render: (args) => (
    <Carousel className="w-full max-w-xs" {...args}>
      <CarouselContent className="-mt-1 h-[200px]">
        {slideItems.map((_, index) => (
          <CarouselItem key={index} className="pt-1 md:basis-1/2">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Infinite Loop.
 * Passes `opts={{ loop: true }}` to enable continuous scrolling.
 */
export const Looping: Story = {
  render: (args) => (
    <Carousel
      opts={{
        loop: true,
      }}
      className="w-full max-w-xs"
      {...args}
    >
      <CarouselContent>
        {slideItems.map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

/**
 * Using API State.
 * Demonstrates how to use `setApi` to get the current slide index and total count.
 */
export const WithAPI: Story = {
  render: (args) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!api) {
        return;
      }

      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);

      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    }, [api]);

    return (
      <div className="mx-auto max-w-xs">
        <Carousel setApi={setApi} className="w-full max-w-xs" {...args}>
          <CarouselContent>
            {slideItems.map((_, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          Slide {current} trên tổng số {count}
        </div>
      </div>
    );
  },
};
