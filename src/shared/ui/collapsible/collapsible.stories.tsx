import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronsUpDown, Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../button/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

// --- META DEFINITION ---

const meta: Meta<typeof Collapsible> = {
  title: 'shared/UI/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    defaultOpen: false,
    disabled: false,
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Trạng thái mở (Controlled State).',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Trạng thái mở mặc định (Uncontrolled).',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Sự kiện khi trạng thái mở thay đổi.',
    },
    disabled: {
      control: 'boolean',
      description: 'Vô hiệu hóa tương tác.',
    },
    asChild: {
      table: { disable: true },
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Collapsible>;

// --- STORIES ---

/**
 * Default Story.
 * A simple collapsible section using a Button as a trigger.
 */
export const Default: Story = {
  render: (args) => (
    <Collapsible {...args} className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <div className="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>

      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

/**
 * Open by Default.
 * The content is visible initially.
 */
export const OpenByDefault: Story = {
  args: {
    defaultOpen: true,
  },
  render: (args) => (
    <Collapsible {...args} className="w-[350px] rounded-md border p-4 shadow-sm">
      <CollapsibleTrigger className="flex w-full items-center justify-between font-semibold">
        <span>Chi tiết đơn hàng</span>
        <Plus className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sản phẩm A</span>
          <span>$50.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sản phẩm B</span>
          <span>$25.00</span>
        </div>
        <div className="flex justify-between border-t pt-2 font-medium">
          <span>Tổng cộng</span>
          <span>$75.00</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

/**
 * Animated Icon Rotation.
 * Shows how to style the icon based on `data-state="open"`.
 */
export const IconAnimation: Story = {
  render: (args) => (
    <Collapsible {...args} className="bg-card text-card-foreground w-[300px] rounded-lg border">
      <CollapsibleTrigger className="hover:bg-muted/50 flex w-full items-center justify-between p-4 font-medium transition-colors [&[data-state=open]>svg]:rotate-180">
        Câu hỏi thường gặp?
        <ChevronsUpDown className="h-4 w-4 transition-transform duration-200" />
      </CollapsibleTrigger>

      <CollapsibleContent className="text-muted-foreground animate-in slide-in-from-top-2 px-4 pb-4 text-sm">
        Đây là nội dung trả lời cho câu hỏi. Collapsible rất hữu ích để ẩn các thông tin không quan
        trọng, giúp giao diện gọn gàng hơn.
      </CollapsibleContent>
    </Collapsible>
  ),
};

/**
 * Controlled State.
 * Managing the open state from outside the component.
 */
export const Controlled: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Đóng Panel' : 'Mở Panel'}
          </Button>
          <span className="text-muted-foreground text-sm">
            State hiện tại: {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-[350px] space-y-2"
          {...args}
        >
          {/* Note: You don't strictly need a Trigger inside if you control it externally, 
              but it's good practice to leave one for accessibility/internal toggle */}
          <div className="bg-muted/20 flex items-center justify-between rounded-md border px-4 py-3">
            <span className="text-sm font-medium">Panel điều khiển</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {isOpen ? <X className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border border-dashed p-4 text-center text-sm">
              Nội dung được điều khiển từ bên ngoài.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};
