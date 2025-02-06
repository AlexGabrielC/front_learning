"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Store
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"


// This is sample data.
const data = {
  teams: [
    {
      name: "Front Store Inc",
      logo: Store,
      plan: "Corporation",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BookOpen,
    },
    {
      title: "Products",
      url: "/products",
      icon: SquareTerminal,
      isCollapsible: true,
      items: [
        {
          title: "All Products",
          url: "/products",
        },
        {
          title: "Create it",
          url: "/products/add",
        },
      ],
    },
    {
      title: "Catalog",
      url: "/catalog",
      icon: SquareTerminal,
      isCollapsible: true,
      items: [
        {
          title: "History",
          url: "/history",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Users",
      url: "#",
      icon: Bot,
      isCollapsible: true,
      items: [
        {
          title: "You",
          url: "/users/me",
        },
        {
          title: "All",
          url: "/users",
          auth: true
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isCollapsible: true,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
