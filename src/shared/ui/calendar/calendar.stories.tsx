import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { addDays, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import { Calendar } from './calendar';

// --- META DEFINITION ---

const meta: Meta<typeof Calendar> = {
  title: 'shared/UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    showOutsideDays: true,
    className: 'rounded-md border shadow-sm',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['default', 'single', 'multiple', 'range'],
      description: 'Chế độ chọn ngày (đơn, nhiều ngày, hoặc khoảng thời gian).',
    },
    selected: {
      control: false,
      description: 'Giá trị ngày hiện tại đang được chọn (Controlled State).',
    },
    onSelect: {
      action: 'selected',
      description: 'Sự kiện khi người dùng chọn ngày.',
    },
    numberOfMonths: {
      control: 'number',
      description: 'Số lượng tháng hiển thị cùng lúc.',
    },
    disabled: {
      control: false,
      description: 'Danh sách các ngày bị vô hiệu hóa (không cho chọn).',
    },
    locale: {
      control: false,
      description: 'Cấu hình ngôn ngữ (Localization).',
    },
    captionLayout: {
      control: 'select',
      options: ['label', 'dropdown', 'dropdown-buttons'],
      description: 'Kiểu hiển thị tiêu đề tháng (Label hoặc Dropdown chọn năm).',
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Calendar>;

// --- STORIES ---

/**
 * Default Calendar (Single Select Mode).
 * Shows the basic usage for picking a single date.
 */
export const Default: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return <Calendar mode="single" selected={date} onSelect={setDate} {...(args as any)} />;
  },
};

/**
 * Date Range Picker.
 * Allows selecting a start and end date.
 */
export const DateRangePicker: Story = {
  render: (args) => {
    const [date, setDate] = useState<DateRange | undefined>({
      from: subDays(new Date(), 5),
      to: addDays(new Date(), 5),
    });

    return (
      <Calendar
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        {...(args as any)}
      />
    );
  },
};

/**
 * Calendar with Multiple Months view.
 * Useful for booking systems to see a longer timeline.
 */
export const MultipleMonths: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 3,
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="rounded-md border p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border-0 shadow-none" // Remove default border to use wrapper's
          {...(args as any)}
        />
      </div>
    );
  },
};

/**
 * Vietnamese Localization (Tiếng Việt).
 * Using `date-fns/locale/vi` to translate days and months.
 */
export const VietnameseLocale: Story = {
  args: {
    locale: vi,
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} {...(args as any)} />;
  },
};

/**
 * Calendar with Dropdown Navigation.
 * Allows quick navigation between months and years using dropdowns.
 * Requires `captionLayout="dropdown-buttons"` and a `fromYear`/`toYear` range.
 */
export const WithDropdowns: Story = {
  args: {
    captionLayout: 'dropdown',
    fromYear: 2000,
    toYear: 2030,
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} {...(args as any)} />;
  },
};

/**
 * Calendar with Disabled Dates.
 * Example: Disable weekends and past dates.
 */
export const DisabledDates: Story = {
  render: (args) => {
    return (
      <Calendar
        mode="single"
        disabled={[
          // Disable past dates
          { before: new Date() },
          // Disable weekends (Saturday: 6, Sunday: 0)
          { dayOfWeek: [0, 6] },
        ]}
        {...(args as any)}
      />
    );
  },
};

/**
 * Show week numbers alongside dates.
 */
export const WithWeekNumbers: Story = {
  args: {
    showWeekNumber: true,
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} {...(args as any)} />;
  },
};
