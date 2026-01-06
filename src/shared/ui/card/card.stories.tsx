import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Bell, Check, MoreHorizontal, X } from 'lucide-react';

import { Button } from '../button/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

// --- META DEFINITION ---

const meta: Meta<typeof Card> = {
  title: 'shared/UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    className: 'w-[350px]',
  },
  argTypes: {
    className: {
      description: 'Class tùy chỉnh cho thẻ Card (thường dùng để chỉnh width).',
    },
    children: {
      control: false,
      description: 'Các thành phần con (Header, Content, Footer).',
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Card>;

// --- STORIES ---

/**
 * Default Story.
 * A standard card with Header, Content, and Footer.
 */
export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Tạo dự án</CardTitle>
        <CardDescription>Triển khai dự án mới chỉ với một cú nhấp chuột.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Chọn template phù hợp để bắt đầu cấu trúc dự án của bạn.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost">Hủy bỏ</Button>
        <Button>Triển khai</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with Action in Header.
 * Demonstrates the usage of `CardAction` component which sits to the right of Title/Description.
 */
export const WithHeaderAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Cài đặt thông báo</CardTitle>
        <CardDescription>Quản lý cách bạn nhận thông báo.</CardDescription>

        {/* CardAction component sits here */}
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <Bell className="h-5 w-5" />
          <div className="flex-1 space-y-1">
            <p className="text-sm leading-none font-medium">Push Notifications</p>
            <p className="text-muted-foreground text-sm">Gửi thông báo đến thiết bị.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Lưu thay đổi</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Example: Login Form.
 * Using Card to wrap a form structure.
 */
export const LoginForm: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email của bạn vào bên dưới để đăng nhập vào tài khoản.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Đăng nhập</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Example: Interactive List inside Card.
 */
export const NotificationsList: Story = {
  args: {
    className: 'w-[380px]',
  },
  render: (args) => {
    const notifications = [
      {
        title: 'Cuộc họp lúc 9:00 AM',
        description: 'Team Standup hàng ngày',
      },
      {
        title: 'Bạn có tin nhắn mới',
        description: 'Từ bộ phận nhân sự',
      },
      {
        title: 'Thanh toán thành công',
        description: 'Gói Premium đã được kích hoạt',
      },
    ];

    return (
      <Card {...args}>
        <CardHeader>
          <CardTitle>Thông báo</CardTitle>
          <CardDescription>Bạn có 3 thông báo chưa đọc.</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Check className="h-4 w-4" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm leading-none font-medium">{notification.title}</p>
                  <p className="text-muted-foreground text-sm">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            Đánh dấu tất cả là đã đọc
          </Button>
        </CardFooter>
      </Card>
    );
  },
};

/**
 * Simple Card (Content Only).
 * Minimal usage without Header or Footer.
 */
export const SimpleContent: Story = {
  render: (args) => (
    <Card {...args}>
      <CardContent className="pt-6">
        {' '}
        {/* Add padding top because there is no header */}
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-full p-2">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">Thông báo đơn giản</p>
            <p className="text-muted-foreground text-sm">Chỉ có nội dung, không tiêu đề.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
