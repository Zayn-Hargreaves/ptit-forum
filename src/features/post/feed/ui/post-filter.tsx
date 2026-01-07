'use client';

import { SortMode, TimeRange } from '@entities/post/model/use-infinite-posts';
import type { Topic } from '@entities/topic/model/types';
import { cn } from '@shared/lib/utils';
import { Button } from '@shared/ui/button/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@shared/ui/command/command';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select/select';
import { Tabs, TabsList, TabsTrigger } from '@shared/ui/tabs/tabs';
import { Calendar, Check, ChevronsUpDown, Clock, Flame, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface PostFilterProps {
  sortMode: SortMode;
  onSortChange: (val: SortMode) => void;
  timeRange: TimeRange;
  onTimeChange: (val: TimeRange) => void;

  topics: Topic[];
  selectedTopic: string | null;
  onTopicChange: (val: string | null) => void;
}

export function PostFilter({
  sortMode,
  onSortChange,
  timeRange,
  onTimeChange,
  topics,
  selectedTopic,
  onTopicChange,
}: Readonly<PostFilterProps>) {
  const [openTopic, setOpenTopic] = useState(false);

  const selectedTopicName = useMemo(
    () => topics.find((t) => t.id === selectedTopic)?.name ?? 'Chủ đề không tồn tại',
    [topics, selectedTopic],
  );

  const groupedTopics = useMemo(() => {
    const groups: Record<string, Topic[]> = {};
    topics.forEach((t) => {
      const category = t.categoryName || 'Khác';
      if (!groups[category]) groups[category] = [];
      groups[category].push(t);
    });

    Object.keys(groups).forEach((k) => {
      groups[k] = [...groups[k]].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    });

    return groups;
  }, [topics]);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Tabs
          value={sortMode}
          onValueChange={(v) => onSortChange(v as SortMode)}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="latest" className="gap-2">
              <Clock className="h-4 w-4" /> Mới nhất
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2">
              <Flame className="h-4 w-4 text-orange-500" /> Nổi bật
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {sortMode === 'trending' && (
            <div className="animate-in fade-in slide-in-from-left-2 flex items-center gap-2">
              <Select value={timeRange} onValueChange={(v) => onTimeChange(v as TimeRange)}>
                <SelectTrigger className="h-9 w-[130px]">
                  <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="all">Tất cả</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex max-w-full items-center gap-2">
            <Popover open={openTopic} onOpenChange={setOpenTopic}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTopic}
                  className="h-9 w-[200px] justify-between font-normal"
                >
                  <span className="flex-1 truncate text-left">
                    {selectedTopic ? selectedTopicName : 'Tất cả chủ đề'}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-60 p-0" align="end">
                <Command>
                  <CommandInput placeholder="Tìm chủ đề..." />
                  <CommandList className="max-h-[300px] overflow-x-hidden overflow-y-auto">
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>

                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          onTopicChange(null);
                          setOpenTopic(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedTopic ? 'opacity-0' : 'opacity-100',
                          )}
                        />
                        Tất cả chủ đề
                      </CommandItem>
                    </CommandGroup>

                    {Object.entries(groupedTopics).map(([category, list]) => (
                      <CommandGroup key={category} heading={category}>
                        {list.map((t) => (
                          <CommandItem
                            key={t.id}
                            value={t.name}
                            onSelect={() => {
                              onTopicChange(t.id);
                              setOpenTopic(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedTopic === t.id ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            <span className="truncate">{t.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedTopic && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-9 w-9 shrink-0"
                onClick={() => onTopicChange(null)}
                title="Xóa lọc chủ đề"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
