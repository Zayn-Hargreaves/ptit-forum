import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

// --- META DEFINITION ---
const meta: Meta<typeof AlertDialog> = {
  title: "shared/UI/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Trạng thái mở mặc định của hộp thoại.",
    },
    open: {
      control: "boolean",
      description: "Trạng thái mở/đóng hộp thoại (Controlled state).",
    },
    onOpenChange: {
      action: "openChange",
      description: "Callback khi trạng thái mở/đóng thay đổi.",
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof AlertDialog>;

// --- TEMPLATE COMPONENT ---

/**
 * A complete component template to reuse across stories.
 */
function AlertDialogDemo({
  title = "Xác nhận xóa dữ liệu",
  description = "Thao tác này sẽ xóa vĩnh viễn dữ liệu của bạn khỏi máy chủ. Bạn có chắc chắn muốn tiếp tục không?",
  triggerText = "Mở Hộp Thoại",
  actionText = "Xác nhận xóa",
  cancelText = "Hủy bỏ",
  ...args
}: React.ComponentProps<typeof AlertDialog> & {
  title?: string;
  description?: string;
  triggerText?: string;
  actionText?: string;
  cancelText?: string;
}) {
  return (
    <AlertDialog {...args}>
      <AlertDialogTrigger className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600">
        {triggerText}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction>{actionText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// --- STORIES ---

/**
 * Basic story, simulating a typical delete confirmation dialog.
 */
export const Default: Story = {
  args: {},
  render: (args) => <AlertDialogDemo {...args} />,
};

/**
 * Story shows dialog automatically open on load (using `defaultOpen`).
 */
export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <p className="text-gray-600">Hộp thoại tự động mở khi tải.</p>
      <AlertDialogDemo {...args} triggerText="Mở Hộp Thoại (Bị ẩn)" />
    </div>
  ),
};

/**
 * Story shows another use case (Example: Logout)
 */
export const LogoutConfirmation: Story = {
  args: {},
  render: (args) => (
    <AlertDialogDemo
      {...args}
      triggerText="Đăng xuất"
      title="Bạn muốn Đăng xuất?"
      description="Bạn sẽ cần đăng nhập lại để truy cập các tính năng cá nhân. Bạn có muốn tiếp tục đăng xuất không?"
      actionText="Đăng xuất ngay"
      cancelText="Ở lại"
    />
  ),
};

/**
 * Story displays a dialog box with custom or more complex content.
 */
export const CustomContent: Story = {
  args: {},
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger className="rounded-lg bg-indigo-500 px-4 py-2 font-semibold text-white transition hover:bg-indigo-600">
        Xem Chi Tiết Cảnh Báo
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cảnh báo Hệ thống</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-2">Một thay đổi lớn sắp diễn ra.</p>
            <ul className="list-disc pl-5 text-left space-y-1">
              <li>**Ngày có hiệu lực:** 20/03/2025</li>
              <li>
                **Ảnh hưởng:** Tất cả các dự án cũ sẽ bị chuyển sang chế độ lưu
                trữ.
              </li>
            </ul>
            <p className="mt-4 font-medium text-red-600">
              Vui lòng sao lưu dữ liệu trước thời điểm trên.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Tôi đã hiểu</AlertDialogCancel>
          <AlertDialogAction>Đã sao lưu</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
