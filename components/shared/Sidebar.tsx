"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Vote,
  Users,
  BarChart3,
  Settings,
  FileText,
  Shield,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Calendar,
  Archive,
  Activity,
  Database,
  Download,
  Search,
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { UserRole } from "@/lib/enums"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  className?: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
  badge?: string | number
  children?: NavigationItem[]
}

export function Sidebar({ className, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isCurrentPage = (href: string) => pathname?.startsWith(href)
  const canAccessRoute = (roles: UserRole[]) => user && roles.includes(user.role)

  // Navigation items based on user role
  const navigationItems: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: [UserRole.VOTER, UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
    },
    {
      name: "Elections",
      href: "/elections",
      icon: Vote,
      roles: [UserRole.VOTER, UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
    },
    {
      name: "Results",
      href: "/results",
      icon: BarChart3,
      roles: [UserRole.VOTER, UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
    },
    {
      name: "My Profile",
      href: "/profile",
      icon: User,
      roles: [UserRole.VOTER, UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
    },

    // Admin-specific navigation
    {
      name: "Administration",
      href: "/admin",
      icon: Shield,
      roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
      children: [
        {
          name: "Overview",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
          roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
        },
        {
          name: "Elections",
          href: "/admin/elections",
          icon: Vote,
          roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
        },
        {
          name: "Users",
          href: "/admin/users",
          icon: Users,
          roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
        },
        {
          name: "Candidates",
          href: "/admin/candidates",
          icon: Users,
          roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
        },
        {
          name: "Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
          roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
        },
        {
          name: "Reports",
          href: "/admin/reports",
          icon: FileText,
          roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
        },
        {
          name: "Audit Logs",
          href: "/admin/audit",
          icon: Activity,
          roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
        },
        {
          name: "System Settings",
          href: "/admin/settings",
          icon: Settings,
          roles: [UserRole.SUPER_ADMIN],
        },
      ],
    },

    // Candidate-specific navigation
    ...(user?.role === UserRole.VOTER ? [{
      name: "My Applications",
      href: "/candidate",
      icon: FileText,
      roles: [UserRole.VOTER] as UserRole[],
    }] : []),

    // Common items
    {
      name: "Help & Support",
      href: "/help",
      icon: HelpCircle,
      roles: [UserRole.VOTER, UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN],
    },
  ]

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    if (!canAccessRoute(item.roles)) return null

    const isActive = isCurrentPage(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)

    return (
      <div key={item.name}>
        <div className={cn(
          "group relative",
          depth > 0 && "ml-4"
        )}>
          <Link
            href={hasChildren ? "#" : item.href}
            onClick={hasChildren ? (e) => {
              e.preventDefault()
              toggleExpanded(item.name)
            } : undefined}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn(
              "flex-shrink-0",
              isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3"
            )} />

            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {item.badge}
                  </Badge>
                )}
                {hasChildren && (
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "transform rotate-90"
                  )} />
                )}
              </>
            )}
          </Link>

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
              {item.name}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavigationItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">
              UniElect
            </span>
          </div>
        )}

        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(
              "p-1",
              isCollapsed && "w-full justify-center"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* User info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {navigationItems.map(item => renderNavigationItem(item))}
        </nav>
      </div>

      {/* Footer actions */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Settings className={cn(
              "flex-shrink-0",
              isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3"
            )} />
            {!isCollapsed && <span>Settings</span>}
          </Link>

          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className={cn(
              "flex-shrink-0",
              isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3"
            )} />
            {!isCollapsed && <span>Sign out</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar