import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./checkbox";
import { useState } from "react";

// --- META DEFINITION ---

const meta: Meta<typeof Checkbox> = {
  title: "shared/UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    disabled: false,
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Trạng thái được chọn (Controlled State).",
      table: {
        type: { summary: "boolean | 'indeterminate'" },
      },
    },
    onCheckedChange: {
      action: "changed",
      description: "Sự kiện khi thay đổi trạng thái.",
    },
    disabled: {
      control: "boolean",
      description: "Vô hiệu hóa checkbox.",
    },
    required: {
      control: "boolean",
      description: "Đánh dấu là bắt buộc trong form.",
    },
    name: {
      control: "text",
      description: "Tên định danh khi submit form.",
    },
    id: {
      control: "text",
      description: "ID để liên kết với thẻ Label.",
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Checkbox>;

// --- STORIES ---

/**
 * Default Checkbox.
 * Note: Checkboxes should almost always have a label for accessibility.
 */
export const Default: Story = {
  args: {
    id: "default-checkbox",
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor={args.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Chấp nhận điều khoản
      </label>
    </div>
  ),
};

/**
 * Checkbox with Title and Description.
 * Useful for settings or consent forms.
 */
export const WithDescription: Story = {
  args: {
    id: "terms",
  },
  render: (args) => (
    <div className="items-top flex space-x-2">
      <Checkbox {...args} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={args.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Chấp nhận điều khoản và điều kiện
        </label>
        <p className="text-sm text-muted-foreground">
          Bạn đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư của
          chúng tôi.
        </p>
      </div>
    </div>
  ),
};

/**
 * Disabled State.
 * Shows both checked and unchecked disabled states.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-1" disabled />
        <label
          htmlFor="disabled-1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Vô hiệu hóa (Chưa chọn)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-2" disabled checked />
        <label
          htmlFor="disabled-2"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Vô hiệu hóa (Đã chọn)
        </label>
      </div>
    </div>
  ),
};

/**
 * Controlled Component.
 * Managing state externally via `useState`.
 */
export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<boolean | "indeterminate">(true);

    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          {...args}
          id="controlled"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <label
          htmlFor="controlled"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {checked === true
            ? "Đang chọn (Click để bỏ)"
            : "Chưa chọn (Click để chọn)"}
        </label>
      </div>
    );
  },
};

/**
 * Error State.
 * Shows usage with `aria-invalid` for form validation feedback.
 */
export const ErrorState: Story = {
  args: {
    id: "error-checkbox",
    "aria-invalid": true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor={args.id}
        className="text-sm font-medium leading-none text-destructive"
      >
        Trường này là bắt buộc
      </label>
    </div>
  ),
};
