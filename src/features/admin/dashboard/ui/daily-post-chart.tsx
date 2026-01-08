'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@shared/ui';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { PostStatDTO } from '@/entities/post/model/types';

const chartConfig = {
  posts: {
    label: 'Posts',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function DailyPostChart({ data }: { data: PostStatDTO[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Posts (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)} // Show MM-DD
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="count"
              type="natural"
              stroke="var(--color-posts)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
