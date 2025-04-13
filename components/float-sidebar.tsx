"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Brain, Clock, Plus, Tag } from "lucide-react"
import type { Tag as TagType } from "@/components/search-dialog"
import { Badge } from "@/components/ui/badge"

interface FloatSidebarProps {
  tags?: TagType[]
  onTagSelect?: (tag: string | null) => void
  selectedTag?: string | null
}

export function FloatSidebar({ tags = [], onTagSelect, selectedTag }: FloatSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <h2 className="text-lg font-semibold">FLOAT</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Thought Spaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Brain />
                  <span>Main Consciousness</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Brain />
                  <span>Creative Ideation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Brain />
                  <span>Critical Analysis</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Time Echoes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Clock />
                  <span>Today</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Clock />
                  <span>Yesterday</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Clock />
                  <span>Last Week</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {tags.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Tags</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="flex flex-wrap gap-1 p-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.name}
                    variant={selectedTag === tag.name ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => onTagSelect?.(selectedTag === tag.name ? null : tag.name)}
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Thought Space
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
