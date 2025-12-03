import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "shared/UI/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    type: "single",
    collapsible: true,
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      description: "Loại Accordion: 'single' (chỉ mở 1), 'multiple' (mở nhiều)",
    },
    collapsible: {
      control: "boolean",
      description: "Cho phép đóng item đang mở",
    },
    defaultValue: {
      control: "text",
      description: "Item mặc định được mở (key)",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Accordion>;

// --- STORIES ---

/**
 * Basic Story for Accordion (Type: single, playable)
 */
export const Default: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Đây là Tiêu đề Item 1</AccordionTrigger>
        <AccordionContent>
          Nội dung cho Item 1. Đây là nơi chứa các thông tin chi tiết.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Đây là Tiêu đề Item 2</AccordionTrigger>
        <AccordionContent>
          Nội dung cho Item 2. Bạn có thể đặt bất kỳ nội dung React nào vào đây.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Đây là Tiêu đề Item 3</AccordionTrigger>
        <AccordionContent>
          Nội dung cho Item 3. Ba item là ví dụ cơ bản.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Story Accordion with multiple items that can be opened at the same time (Type: multiple)
 */
export const Multiple: Story = {
  args: {
    type: "multiple",
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Mục 1 (Multiple)</AccordionTrigger>
        <AccordionContent>
          Nội dung có thể mở song song với các mục khác.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Mục 2 (Multiple)</AccordionTrigger>
        <AccordionContent>
          Nội dung Mục 2. Kiểm tra xem bạn có thể mở cả 2 mục cùng lúc không.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Mục 3 (Multiple)</AccordionTrigger>
        <AccordionContent>Nội dung Mục 3.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Story Accordion with a default Item opened
 */
export const DefaultOpen: Story = {
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-2",
  },
  render: Default.render,
};

/**
 * Story Accordion only has long content to test scroll/animation
 */
export const LongContent: Story = {
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-1",
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Nội dung dài</AccordionTrigger>
        <AccordionContent>
          <p>
            Đây là một đoạn nội dung rất dài. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <p>
            Thêm một đoạn nữa để đảm bảo nội dung đủ dài. Curabitur pretium
            tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et
            commodo pharetra, est eros bibendum elit, nec luctus magna felis
            sollicitudin mauris. Integer in sapien. Fusc...
          </p>
          <p>
            Và đoạn thứ ba. Aliquam ac justo vel massa egestas interdum.
            Praesent tristique interdum elit, ac tincidunt odio facilisis ut.
            Sed vitae ante sed nisl varius tristique. Nam ut nulla ac massa
            euismod dignissim. Vivamus a magna eget ex lacinia ullamcorper.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Nội dung ngắn</AccordionTrigger>
        <AccordionContent>Nội dung ngắn.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
