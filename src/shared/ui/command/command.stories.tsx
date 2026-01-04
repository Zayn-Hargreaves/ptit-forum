import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./command";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  LayoutDashboard,
  LogOut,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";

// --- META DEFINITION ---

const meta: Meta<typeof Command> = {
  title: "shared/UI/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    className: "rounded-lg border shadow-md",
  },
  argTypes: {
    children: {
      control: false,
      description: "Các thành phần con (Input, List, Group, Item...).",
    },
    filter: {
      control: false,
      description: "Hàm custom filter (mặc định Command tự filter theo text).",
    },
    className: {
      description: "Class tùy chỉnh cho container.",
    },
  },
};

export default meta;

// Story type definition
type Story = StoryObj<typeof Command>;

// --- STORIES ---

/**
 * Default Story (Inline).
 * Used as a static menu, sidebar navigation, or inline combo-box.
 * Wrap in a container to control width.
 */
export const Default: Story = {
  render: (args) => (
    <Command {...args} className="w-[450px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem disabled>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator (Disabled)</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/**
 * Command Dialog (Palette Mode).
 * This component mimics the "Cmd+K" or "Ctrl+K" experience.
 * Click the button below or press "Ctrl+J" (or Cmd+J) to open.
 */
export const DialogMode: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((open) => !open);
        }
      };

      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, []);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Nhấn{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>{" "}
          hoặc click nút bên dưới để mở Command Dialog.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Mở Command Palette
        </button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Nhập lệnh để tìm kiếm..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            <CommandGroup heading="Chức năng chính">
              <CommandItem onSelect={() => console.log("Dashboard selected")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
              <CommandItem>
                <Mail className="mr-2 h-4 w-4" />
                <span>Gửi Email</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tài khoản">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
                <CommandShortcut>⇧⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    );
  },
};

/**
 * Example of filtering logic.
 * Try typing "billing" or "profile". The grouping headers will hide if no items match inside them.
 */
export const ComplexList: Story = {
  render: (args) => (
    <Command {...args} className="w-[450px] border rounded-lg">
      <CommandInput placeholder="Search settings..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="General">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="System">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Display Settings</span>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Sound Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem>Go to Home</CommandItem>
          <CommandItem>Go to Profile</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
