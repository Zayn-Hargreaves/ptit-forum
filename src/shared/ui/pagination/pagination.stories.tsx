import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useState } from 'react';

import { Pagination } from './pagination';

const meta: Meta<typeof Pagination> = {
  title: 'shared/UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    currentPage: {
      control: {
        type: 'number',
      },
      description: 'Current active page',
    },
    totalPages: {
      control: {
        type: 'number',
        min: 1,
      },
      description: 'Total number of pages',
    },
    onPageChange: {
      control: false,
      description: 'Callback triggered when user changes a page',
    },
  },
  args: {
    totalPages: 10,
    currentPage: 1,
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

/**
 * Interactive pagination with internal state handling.
 */
export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);

    return <Pagination {...args} currentPage={page} onPageChange={(p) => setPage(p)} />;
  },
};

/**
 * Small range pagination (no ellipsis).
 */
export const FewPages: Story = {
  args: {
    totalPages: 4,
    currentPage: 2,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);

    return <Pagination {...args} currentPage={page} onPageChange={(p) => setPage(p)} />;
  },
};

/**
 * Large pagination to show ellipsis behavior.
 */
export const ManyPages: Story = {
  args: {
    totalPages: 25,
    currentPage: 12,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);

    return <Pagination {...args} currentPage={page} onPageChange={(p) => setPage(p)} />;
  },
};

/**
 * Pagination starting at the last page.
 */
export const EndPage: Story = {
  args: {
    totalPages: 8,
    currentPage: 8,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);

    return <Pagination {...args} currentPage={page} onPageChange={(p) => setPage(p)} />;
  },
};
