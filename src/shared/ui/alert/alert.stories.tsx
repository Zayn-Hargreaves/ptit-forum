import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertCircle, TriangleAlert } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
// --- META DEFINITION ---

const meta: Meta<typeof Alert> = {
  title: "shared/UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "destructive"],
      description: "The variant style of the alert.",
    },
    children: {
      table: { disable: true },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 550, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Alert>;

// --- STORIES ---

/**
 * Default alert variant. This example shows the alert without an icon,
 * utilizing only the Title and Description components.
 */
export const Default: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Tiêu đề Thông báo</AlertTitle>
      <AlertDescription>
        Đây là nội dung mô tả cho thông báo mặc định.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Default alert variant shown with an icon.
 * The component styling automatically adjusts for the icon (SVG).
 */
export const DefaultWithIcon: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <AlertCircle />
      <AlertTitle>Thông báo có Icon</AlertTitle>
      <AlertDescription>
        Nội dung thông báo đi kèm với một icon ở bên trái.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive alert variant.
 * This variant is typically used for errors or critical warnings and usually includes an icon.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
  render: (args) => (
    <Alert {...args}>
      <TriangleAlert />
      <AlertTitle>Cảnh báo Nguy hiểm</AlertTitle>
      <AlertDescription>
        Đã xảy ra lỗi nghiêm trọng. Vui lòng thử lại sau.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive alert variant shown *without* an icon.
 * This checks the styling when no SVG is present in the destructive variant.
 */
export const DestructiveNoIcon: Story = {
  args: {
    variant: "destructive",
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Lỗi (Không có Icon)</AlertTitle>
      <AlertDescription>
        Đây là mô tả lỗi nhưng không có icon đi kèm.
      </AlertDescription>
    </Alert>
  ),
};
