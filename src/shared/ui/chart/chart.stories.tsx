import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Monitor, Smartphone } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './chart';

// --- MOCK DATA ---

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

// --- CONFIG DEFINITION ---

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb', // Blue-600
    icon: Monitor,
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa', // Blue-400
    icon: Smartphone,
  },
} satisfies ChartConfig;

// --- META DEFINITION ---

const meta: Meta<typeof ChartContainer> = {
  title: 'shared/UI/Chart',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    config: chartConfig,
    className: 'min-h-[200px] w-full',
  },
  argTypes: {
    config: {
      control: 'object',
      description: 'Cấu hình màu sắc, label và icon cho các key dữ liệu.',
    },
    children: {
      control: false,
      description: 'Recharts components (BarChart, LineChart, etc.).',
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl rounded-xl border p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

// Story type definition
type Story = StoryObj<typeof ChartContainer>;

// --- STORIES ---

/**
 * Basic Bar Chart.
 * Standard implementation using Recharts BarChart within ChartContainer.
 */
export const BarChartDemo: Story = {
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

/**
 * Line Chart (Linear).
 * Showing trends over time.
 */
export const LineChartDemo: Story = {
  render: (args) => (
    <ChartContainer {...args}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="desktop"
          type="monotone"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="monotone"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  ),
};

/**
 * Area Chart with Gradient.
 * Example of a more complex visualization styling.
 */
export const AreaChartGradient: Story = {
  render: (args) => (
    <ChartContainer {...args}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

        {/* Gradients definitions would typically go in <defs> */}
        <Area
          dataKey="mobile"
          type="natural"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  ),
};

/**
 * Custom Tooltip Display.
 * Configuring the tooltip to hide labels or use different indicators.
 */
export const TooltipOptions: Story = {
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        {/* Custom props for TooltipContent */}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel indicator="dashed" className="w-[150px]" />}
        />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

/**
 * Pie Chart (Donut).
 * Note: Pie charts structure data differently.
 */
export const PieChartDemo: Story = {
  render: () => {
    // Specific data for Pie Chart
    const pieData = [
      { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
      { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
      { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
      { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
      { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
    ];

    const pieConfig = {
      visitors: {
        label: 'Visitors',
      },
      chrome: {
        label: 'Chrome',
        color: '#2563eb',
      },
      safari: {
        label: 'Safari',
        color: '#60a5fa',
      },
      firefox: {
        label: 'Firefox',
        color: '#f97316',
      },
      edge: {
        label: 'Edge',
        color: '#8b5cf6',
      },
      other: {
        label: 'Other',
        color: '#94a3b8',
      },
    } satisfies ChartConfig;

    return (
      <ChartContainer config={pieConfig} className="mx-auto aspect-square max-h-[250px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={pieData} dataKey="visitors" nameKey="browser" innerRadius={60} />
        </PieChart>
      </ChartContainer>
    );
  },
};
