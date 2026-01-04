import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { toast } from "sonner";
import { Toaster } from "./sonner";

// --- META DEFINITION ---

const meta: Meta<typeof Toaster> = {
  title: "shared/UI/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: {
      control: "inline-radio",
      options: ["light", "dark", "system"],
      description:
        "Theme cho toaster. Mặc định sẽ sync với theme hiện tại của app (system / next-themes).",
    },
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      description: "Vị trí hiển thị của toast trên màn hình.",
    },
    richColors: {
      control: "boolean",
      description:
        "Dùng màu sắc nổi bật cho các loại toast (success/error/...)",
    },
    closeButton: {
      control: "boolean",
      description: "Hiển thị nút đóng ở mỗi toast.",
    },
    expand: {
      control: "boolean",
      description: "Cho phép toast có thể expand nhiều dòng nội dung.",
    },
    duration: {
      control: "number",
      description: "Thời gian hiển thị mỗi toast (ms).",
    },
    visibleToasts: {
      control: "number",
      description: "Giới hạn số lượng toast hiển thị cùng lúc.",
    },
  },
  args: {
    position: "top-right",
    richColors: true,
    closeButton: true,
    expand: false,
    duration: 3000,
  },
};

export default meta;

// ✅ DÙNG meta Ở ĐÂY
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Toaster cơ bản với một vài nút để test các loại toast khác nhau.
 */
export const Default: Story = {
  render: (args) => (
    <div className="space-y-4">
      <Toaster {...args} />
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium"
          onClick={() => toast("This is a simple toast")}
        >
          Show toast
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium"
          onClick={() => toast.success("Profile saved successfully")}
        >
          Success toast
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium"
          onClick={() => toast.error("Something went wrong")}
        >
          Error toast
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium"
          onClick={() =>
            toast("Uploading file...", {
              description: "This might take a few seconds.",
            })
          }
        >
          Toast with description
        </button>
      </div>
    </div>
  ),
};

/**
 * Toaster ở vị trí bottom-left, hữu ích cho layout có header cố định phía trên.
 */
export const BottomLeft: Story = {
  args: {
    position: "bottom-left",
  },
  render: Default.render,
};

/**
 * Toaster với màu sắc nhẹ hơn (tắt rich colors).
 */
export const Subtle: Story = {
  args: {
    richColors: false,
  },
  render: Default.render,
};

/**
 * Toaster cho các toast dài nội dung, bật chế độ expand.
 */
export const Expandable: Story = {
  args: {
    expand: true,
  },
  render: (args) => (
    <div className="space-y-4">
      <Toaster {...args} />
      <button
        className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium"
        onClick={() =>
          toast("Terms & Conditions updated", {
            description:
              "We’ve updated our Terms & Conditions. Please review the new changes carefully as they affect your continued use of the service.",
          })
        }
      >
        Show long toast
      </button>
    </div>
  ),
};
