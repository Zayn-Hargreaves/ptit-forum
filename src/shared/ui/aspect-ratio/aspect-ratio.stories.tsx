import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AspectRatio } from "./aspect-ratio";

// --- META DEFINITION ---

const meta: Meta<typeof AspectRatio> = {
  title: "shared/UI/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    ratio: 16 / 9,
  },
  argTypes: {
    ratio: {
      description: "The desired aspect ratio (width / height).",
      control: {
        type: "select",
        labels: {
          [16 / 9]: "16:9 (Landscape)",
          [1 / 1]: "1:1 (Square)",
          [4 / 3]: "4:3 (Traditional)",
          [3 / 2]: "3:2 (Photography)",
          [4 / 5]: "4:5 (Portrait)",
        },
      },
    },
    children: {
      table: { disable: true },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

// Story type definition
type Story = StoryObj<typeof AspectRatio>;

// --- STORIES ---

/**
 * The default 16:9 aspect ratio, typically used for videos or widescreen images.
 */
export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <AspectRatio {...args} className="bg-muted rounded-md">
      <img
        src="https://images.unsplash.com/photo-1536782376847-5c9d14d97c0b"
        alt="Ảnh phong cảnh"
        className="object-cover w-full h-full rounded-md"
      />
    </AspectRatio>
  ),
};

/**
 * A 1:1 aspect ratio, perfect for square images like profile pictures or album art.
 */
export const Square: Story = {
  args: {
    ratio: 1 / 1,
  },
  render: (args) => (
    <AspectRatio {...args} className="bg-muted rounded-md">
      <img
        src="https://images.unsplash.com/photo-1588392382834-a89115b1ca9f"
        alt="Ảnh vuông"
        className="object-cover w-full h-full rounded-md"
      />
    </AspectRatio>
  ),
};

/**
 * A 4:5 aspect ratio, often used for portrait photos on social media.
 */
export const Portrait: Story = {
  args: {
    ratio: 4 / 5,
  },
  render: (args) => (
    <AspectRatio {...args} className="bg-muted rounded-md">
      <img
        src="https://images.unsplash.com/photo-1502602898657-3e91760c0341"
        alt="Ảnh chân dung (Tháp Eiffel)"
        className="object-cover w-full h-full rounded-md"
      />
    </AspectRatio>
  ),
};

/**
 * Demonstrates using non-image content, like text, within the AspectRatio.
 */
export const WithText: Story = {
  args: {
    ratio: 3 / 2,
  },
  render: (args) => (
    <AspectRatio
      {...args}
      className="bg-primary text-primary-foreground rounded-md"
    >
      <div className="flex items-center justify-center h-full">
        <h2 className="text-xl font-bold">Đây là tỷ lệ 3:2</h2>
      </div>
    </AspectRatio>
  ),
};
