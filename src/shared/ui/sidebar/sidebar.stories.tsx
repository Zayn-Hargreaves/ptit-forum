import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarRail,
  SidebarMenuSkeleton,
} from "./sidebar";
import { Button } from "../button/button";
import { Input } from "../input/input";
import { Skeleton } from "../skeleton/skeleton";
import {
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  FolderIcon,
  BellIcon,
  PlusIcon,
} from "lucide-react";

// --- META DEFINITION ---

const meta: Meta<typeof SidebarProvider> = {
  title: "shared/Layout/Sidebar",
  component: SidebarProvider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    // These are conceptual controls, not wired to the demo props directly
    // (the stories below showcase combinations instead).
    // They are here just to describe the component in Docs.
    className: {
      control: "text",
      description: "Custom className applied to the sidebar wrapper.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state for the desktop sidebar.",
      table: {
        defaultValue: { summary: "true" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SidebarProvider>;

// --- DEMO LAYOUT COMPONENTS ---

const BasicSidebarLayout: React.FC = () => {
  return (
    <SidebarProvider className="bg-muted">
      <Sidebar
        side="left"
        variant="sidebar"
        collapsible="offcanvas"
        className="bg-sidebar text-sidebar-foreground"
      >
        <SidebarRail />
        <SidebarHeader>
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
                SB
              </span>
              <span>Sidebar App</span>
            </div>
          </div>
          <Input
            placeholder="Search..."
            className="h-8 text-xs"
            data-sidebar="input"
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <HomeIcon />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <SearchIcon />
                    <span>Search</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <StarIcon />
                    <span>Favorites</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FolderIcon />
                    <span>Website redesign</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction showOnHover>
                    <PlusIcon className="size-3.5" />
                  </SidebarMenuAction>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FolderIcon />
                    <span>Mobile app</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FolderIcon />
                    <span>Internal tools</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton size="sm" isActive>
                        <span>Admin panel</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton size="sm">
                        <span>Analytics</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarSeparator />
          <div className="flex items-center justify-between px-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                JD
              </span>
              <div className="flex flex-col">
                <span className="font-medium">John Doe</span>
                <span className="text-[10px] text-muted-foreground">
                  john@example.com
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Notifications"
            >
              <BellIcon className="size-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="flex h-12 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="text-sm font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              New project
            </Button>
            <Button size="sm">Deploy</Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Overview</span>
            <span className="text-xs text-muted-foreground">
              This is a basic layout example using the Sidebar component with
              header, content and footer.
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border bg-card p-3 text-sm">
              <p className="font-medium">Traffic</p>
              <Skeleton className="mt-2 h-16 w-full" />
            </div>
            <div className="rounded-md border bg-card p-3 text-sm">
              <p className="font-medium">Conversions</p>
              <Skeleton className="mt-2 h-16 w-full" />
            </div>
            <div className="rounded-md border bg-card p-3 text-sm">
              <p className="font-medium">Errors</p>
              <Skeleton className="mt-2 h-16 w-full" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

const InsetFloatingLayout: React.FC = () => {
  return (
    <SidebarProvider className="bg-muted">
      <Sidebar
        side="left"
        variant="inset"
        collapsible="icon"
        className="bg-sidebar text-sidebar-foreground"
      >
        <SidebarRail />
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 text-sm font-semibold">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
              IN
            </span>
            <span>Inset Layout</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Quick access</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Home" isActive>
                    <HomeIcon />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <SettingsIcon />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div className="flex h-12 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="text-sm font-semibold">Inset variant</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          The content area is inset and has its own rounded card-like container,
          while the sidebar can collapse into an icon rail.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

// --- STORIES ---

/**
 * Full sidebar layout with header, groups, menu items and footer.
 * Demonstrates typical app shell usage.
 */
export const BasicLayout: Story = {
  render: () => <BasicSidebarLayout />,
};

/**
 * Inset + icon-collapsible variant.
 * The main content is inset (card-like) and the sidebar can collapse to icons.
 */
export const InsetVariant: Story = {
  render: () => <InsetFloatingLayout />,
};

/**
 * Loading skeleton in sidebar menu.
 * Example of using SidebarMenuSkeleton while data is being fetched.
 */
export const LoadingSkeleton: Story = {
  render: () => (
    <SidebarProvider className="bg-muted">
      <Sidebar side="left" variant="sidebar" collapsible="none">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-1 text-sm font-semibold">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
              LD
            </span>
            <span>Loading state</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          Simulated loading state. Use <code>SidebarMenuSkeleton</code> while
          fetching sidebar data.
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
