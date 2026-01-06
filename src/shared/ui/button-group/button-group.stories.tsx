import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Italic,
  Plus,
  Underline,
} from 'lucide-react';

import { Button } from '../button/button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './button-group';

type ButtonGroupProps = React.ComponentProps<typeof ButtonGroup>;
type OrientationProps = NonNullable<ButtonGroupProps['orientation']>;

const orientationOptions: OrientationProps[] = ['horizontal', 'vertical'];

// --- META DEFINITION ---

const meta: Meta<typeof ButtonGroup> = {
  title: 'shared/UI/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: orientationOptions,
      description: 'Hướng sắp xếp của nhóm nút (ngang hoặc dọc).',
    },
    className: {
      description: 'Lớp CSS tùy chỉnh cho container.',
    },
    children: {
      control: false,
      description: 'Các thành phần con (Button, Input, ButtonGroupText...).',
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof ButtonGroup>;

// --- STORIES ---

/**
 * Default Story. A simple group of actions.
 */
export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Lưu</Button>
      <Button variant="outline">Hủy bỏ</Button>
    </ButtonGroup>
  ),
};

/**
 * Shows both Horizontal and Vertical orientations.
 */
export const AllOrientations: Story = {
  args: {},
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="flex flex-col items-start gap-8">
      {orientationOptions.map((orientation) => (
        <div key={orientation} className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm capitalize">{orientation}:</p>
          <ButtonGroup orientation={orientation}>
            <Button variant="outline">Một</Button>
            <Button variant="outline">Hai</Button>
            <Button variant="outline">Ba</Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  ),
};

/**
 * Example of an Icon Toolbar (Editor style).
 * Shows how borders interact correctly between buttons.
 */
export const IconToolbar: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Underline className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Using ButtonGroupSeparator to divide groups of actions.
 */
export const WithSeparator: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <AlignRight className="h-4 w-4" />
      </Button>

      <ButtonGroupSeparator />

      <Button variant="outline" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Using ButtonGroupText for labels or static content within the group.
 */
export const WithTextLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {/* Example 1: Label + Action */}
      <ButtonGroup {...args}>
        <ButtonGroupText>Trạng thái:</ButtonGroupText>
        <Button variant="outline" className="gap-2">
          Hoạt động <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </ButtonGroup>

      {/* Example 2: Prefix for value (simulating Input group) */}
      <ButtonGroup {...args}>
        <ButtonGroupText>$</ButtonGroupText>
        <Button variant="outline" className="min-w-[100px] cursor-text justify-start">
          100.00
        </Button>
        <ButtonGroupText>.00</ButtonGroupText>
      </ButtonGroup>
    </div>
  ),
};

/**
 * Example combining various elements in a vertical layout.
 */
export const VerticalToolbar: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline" size="icon">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Italic className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};
