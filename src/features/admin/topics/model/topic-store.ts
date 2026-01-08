import { create } from 'zustand';

import { TopicResponse } from '@/entities/topic/model/types';

interface TopicStore {
  selectedTopic?: TopicResponse;
  isOpenDetail: boolean;

  openDetail: (topic: TopicResponse) => void;
  close: () => void;
}

export const useTopicStore = create<TopicStore>((set) => ({
  selectedTopic: undefined,
  isOpenDetail: false,

  openDetail: (topic) =>
    set({
      selectedTopic: topic,
      isOpenDetail: true,
    }),

  close: () =>
    set({
      selectedTopic: undefined,
      isOpenDetail: false,
    }),
}));
