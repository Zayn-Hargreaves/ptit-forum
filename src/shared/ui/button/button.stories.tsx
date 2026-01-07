import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronRight, Loader2, Mail } from 'lucide-react';

import { Button } from './button';

type ButtonVariantProps = NonNullable<React.ComponentProps<typeof Button>['variant']>;
type ButtonSizeProps = NonNullable<React.ComponentProps<typeof Button>['size']>;

const variantOptions: ButtonVariantProps[] = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
];
const sizeOptions: ButtonSizeProps[] = ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'];

// --- META DEFINITION ---

const meta: Meta<typeof Button> = {
  title: 'shared/UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Button Text',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variantOptions,
      description: 'Kiểu dáng của nút (màu sắc, nền).',
    },
    size: {
      control: 'select',
      options: sizeOptions,
      description: 'Kích thước của nút.',
    },
    disabled: {
      control: 'boolean',
      description: 'Vô hiệu hóa nút.',
    },
    asChild: {
      control: 'boolean',
      description: 'Sử dụng Radix Slot làm con để truyền props xuống.',
      table: {
        disable: true,
      },
    },
    children: {
      control: 'text',
      description: 'Nội dung hiển thị bên trong nút.',
    },
    onClick: {
      action: 'clicked',
      description: 'Sự kiện khi nút được nhấn.',
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Button>;

// --- STORIES ---

/**
 * Default Story, showing Primary button (Default variant, Default size).
 */
export const Default: Story = {
  args: {
    children: 'Nút Mặc Định',
  },
};

/**
 * Shows all basic Variants.
 */
export const AllVariants: Story = {
  args: {},
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {variantOptions.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

/**
 * Show all Sizes.
 */
export const AllSizes: Story = {
  args: {
    variant: 'secondary',
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <div className="flex items-end gap-4">
      {sizeOptions
        .filter((size) => !size.startsWith('icon'))
        .map((size) => (
          <Button key={size} size={size} variant={args.variant}>
            {`Size: ${size.toUpperCase()}`}
          </Button>
        ))}
    </div>
  ),
};

/**
 * Button with Icon and Text.
 */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Mail />
        Gửi Email
      </>
    ),
    variant: 'default',
    size: 'default',
  },
};

/**
 * The button contains only Icon.
 */
export const IconButton: Story = {
  args: {
    children: <ChevronRight />,
    variant: 'outline',
    size: 'icon',
  },
  argTypes: {
    children: {
      table: { disable: true },
    },
  },
};

/**
 * The button is in the Disabled state.
 */
export const Disabled: Story = {
  args: {
    children: 'Nút Bị Khóa',
    disabled: true,
  },
};

/**
 * Loading Button (Example using rotating Icon).
 */
export const Loading: Story = {
  args: {
    children: (
      <>
        <Loader2 className="animate-spin" />
        Đang tải...
      </>
    ),
    disabled: true,
    variant: 'secondary',
  },
};
