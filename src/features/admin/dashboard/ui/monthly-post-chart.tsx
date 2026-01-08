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
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { PostStatDTO } from '@/entities/post/model/types';

const chartConfig = {
  posts: {
    label: 'Posts',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function MonthlyPostChart({ data }: { data: PostStatDTO[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Posts (Last 12 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-posts)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
