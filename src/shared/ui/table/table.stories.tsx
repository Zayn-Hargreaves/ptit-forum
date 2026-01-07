import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";

// --- META DEFINITION ---

const meta: Meta<typeof Table> = {
  title: "shared/UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: {
      control: "text",
      description: "Custom Tailwind utility classes applied to the table root.",
    },
  },
};

export default meta;

// Correct story typing based on meta
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Minimal table showing basic structure of header and body.
 */
export const Default: Story = {
  render: (args) => (
    <Table {...args} className="w-96 border rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice Johnson</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Smith</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/**
 * Table including footer and caption — useful for summaries or grouped data.
 */
export const WithFooter: Story = {
  render: () => (
    <Table className="w-96 border rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Coffee Beans</TableCell>
          <TableCell>2</TableCell>
          <TableCell>$18.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Milk</TableCell>
          <TableCell>1</TableCell>
          <TableCell>$3.50</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell>$21.50</TableCell>
        </TableRow>
      </TableFooter>
      <TableCaption>Order summary for checkout.</TableCaption>
    </Table>
  ),
};

/**
 * Table showing alternating row interactions and hover styling for focus-based UI.
 */
export const InteractiveRows: Story = {
  render: () => {
    const data = [
      { name: "Jane Cooper", email: "jane@example.com", active: true },
      { name: "Mark Diaz", email: "mark@example.com", active: false },
      { name: "Laura White", email: "laura@example.com", active: true },
    ];

    return (
      <Table className="w-[28rem] border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow
              key={idx}
              data-state={item.active ? "selected" : undefined}
            >
              <TableCell>{item.active ? "Active" : "Inactive"}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

/**
 * Table inside a card-like container with spacing visuals,
 * mimicking dashboard or settings layout usage.
 */
export const InCard: Story = {
  render: () => (
    <div className="w-[32rem] rounded-lg border bg-card p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-medium">Recent Registrations</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#0001</TableCell>
            <TableCell>Emily Rose</TableCell>
            <TableCell>2025-02-11</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#0002</TableCell>
            <TableCell>Michael Hart</TableCell>
            <TableCell>2025-02-12</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
