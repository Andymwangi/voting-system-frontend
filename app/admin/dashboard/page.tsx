"use client"

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AuditLog } from '@/components/admin/AuditLog'
import { useAuth } from '@/lib/hooks/useAuth'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { cn } from '@/lib/utils/cn'
import formatters from '@/lib/utils/formatters'
import {
  Users,
  Vote,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw,
  Settings,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Eye,
  FileText,
  Shield,
  Bell,
  Server,
  Database,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  MonitorUp,
  Globe,
  UserCheck,
  UserX,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import {
  AdminDashboardData,
  AdminOverview,
  AdminElectionSummary,
  SystemHealth,
  AdminActivity,
  SystemAlert,
  ApiResponse,
} from '@/lib/types'
import { API_ENDPOINTS } from '@/lib/constants'
import {
  ELECTION_STATUS_LABELS,
  ELECTION_TYPE_LABELS,
  USER_ROLE_LABELS,
} from '@/lib/enums'
import { NotificationType } from '@/lib/enums'

interface DashboardStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
  progress?: number
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  progress,
  variant = 'default'
}) => {
  const cardColors = {
    default: 'border-border',
    success: 'border-green-200 bg-green-50/50',
    warning: 'border-orange-200 bg-orange-50/50',
    destructive: 'border-red-200 bg-red-50/50'
  }

  return (
    <Card className={cn('transition-colors', cardColors[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center text-xs mt-2">
            <span className={cn(
              "flex items-center",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
        {progress !== undefined && (
          <Progress value={progress} className="h-2 mt-2" />
        )}
      </CardContent>
    </Card>
  )
}

interface SystemHealthCardProps {
  health: SystemHealth
}

const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ health }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return 'text-green-600'
      case 'warning':
      case 'slow':
        return 'text-orange-600'
      case 'critical':
      case 'disconnected':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return CheckCircle
      case 'warning':
      case 'slow':
        return AlertTriangle
      case 'critical':
      case 'disconnected':
        return XCircle
      default:
        return AlertCircle
    }
  }

  const OverallStatusIcon = getStatusIcon(health.status)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 h-5" />
          System Health
        </CardTitle>
        <CardDescription>
          Current system status and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-2">
            <OverallStatusIcon className={cn("h-5 w-5", getStatusColor(health.status))} />
            <span className="font-medium">Overall Status</span>
          </div>
          <Badge
            variant={health.status === 'healthy' ? 'success' : health.status === 'warning' ? 'warning' : 'destructive'}
          >
            {health.status.toUpperCase()}
          </Badge>
        </div>

        {/* Service Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span>Database</span>
            </div>
            <Badge
              variant={health.database.status === 'connected' ? 'success' : 'destructive'}
              className="text-xs"
            >
              {health.database.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
              <span>Redis</span>
            </div>
            <Badge
              variant={health.redis.status === 'connected' ? 'success' : 'destructive'}
              className="text-xs"
            >
              {health.redis.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span>Storage</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {health.storage.percentage.toFixed(1)}% used
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <span>WebSocket</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {health.websocket ? `${health.websocket.connections} connections` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>CPU Usage</span>
            <span>{health.cpu}%</span>
          </div>
          <Progress value={health.cpu} className="h-2" />

          <div className="flex justify-between text-sm">
            <span>Memory Usage</span>
            <span>{health.memory}%</span>
          </div>
          <Progress value={health.memory} className="h-2" />

          <div className="flex justify-between text-sm">
            <span>Disk Usage</span>
            <span>{health.disk}%</span>
          </div>
          <Progress value={health.disk} className="h-2" />
        </div>

        <div className="text-xs text-muted-foreground">
          Last checked: {formatters.formatDateTime(health.lastChecked)}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const { user } = useAuth()
  const { addNotification } = useNotifications()

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-dashboard', selectedTimeRange],
    queryFn: async (): Promise<AdminDashboardData> => {
      const params = new URLSearchParams()
      params.append('timeRange', selectedTimeRange)

      const response = await fetch(`${API_ENDPOINTS.ADMIN.DASHBOARD}?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const result: ApiResponse<AdminDashboardData> = await response.json()
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch dashboard data')
      }

      return result.data
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const handleRefresh = () => {
    refetch()
    addNotification({
      type: NotificationType.SUCCESS,
      title: 'Refreshed',
      message: 'Dashboard data updated'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-96 bg-muted animate-pulse rounded" />
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const overview = dashboardData?.overview
  const elections = dashboardData?.elections || []
  const systemHealth = dashboardData?.system
  const alerts = dashboardData?.alerts || []
  const recentActivity = dashboardData?.recentActivity || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.firstName}! Here's what's happening with your elections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {['24h', '7d', '30d', 'all'].map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={alert.type === 'error' ? 'destructive' : alert.type === 'warning' ? 'default' : 'default'}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      {overview && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatsCard
            title="Total Elections"
            value={overview.totalElections}
            subtitle={`${overview.activeElections} active`}
            icon={Calendar}
            variant={overview.activeElections > 0 ? 'success' : 'default'}
          />

          <DashboardStatsCard
            title="Total Users"
            value={overview.totalUsers}
            subtitle={`${overview.activeUsers} active today`}
            icon={Users}
            trend={{
              value: 12,
              isPositive: true,
              label: 'vs last week'
            }}
          />

          <DashboardStatsCard
            title="Votes Cast"
            value={overview.totalVotes}
            subtitle={`${overview.todayVotes} today`}
            icon={Vote}
            trend={{
              value: 8,
              isPositive: true,
              label: 'vs yesterday'
            }}
          />

          <DashboardStatsCard
            title="System Uptime"
            value={`${Math.floor(overview.systemUptime / 24)}d ${overview.systemUptime % 24}h`}
            subtitle="Last restart"
            icon={MonitorUp}
            variant={overview.systemUptime > 48 ? 'success' : 'warning'}
          />
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="elections">Elections</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Elections */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Elections</CardTitle>
                <CardDescription>
                  Latest elections in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {elections.slice(0, 5).map((election) => (
                    <div
                      key={election.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{election.title}</h4>
                          <Badge variant="outline">
                            {ELECTION_TYPE_LABELS[election.type] || election.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge
                            variant={
                              election.status === 'ACTIVE' ? 'success' :
                              election.status === 'SCHEDULED' ? 'default' :
                              election.status === 'COMPLETED' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {ELECTION_STATUS_LABELS[election.status] || election.status}
                          </Badge>
                          <span>
                            {formatters.formatDate(election.startDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-xs">
                          <p className="font-medium">{election.totalVotes} votes</p>
                          <p className="text-muted-foreground">
                            {election.turnoutPercentage.toFixed(1)}% turnout
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/admin/elections">View All Elections</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/elections/create">
                      <Calendar className="mr-2 h-4 w-4" />
                      Create New Election
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/voters">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Voters
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/candidates">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Review Candidates
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/reports">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Reports
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/audit">
                      <Shield className="mr-2 h-4 w-4" />
                      View Audit Logs
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      System Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Elections Tab */}
        <TabsContent value="elections" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Election Summary</CardTitle>
                <CardDescription>
                  Overview of all elections in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {elections.map((election) => (
                    <div
                      key={election.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{election.title}</h4>
                          <Badge variant="outline">
                            {ELECTION_TYPE_LABELS[election.type] || election.type}
                          </Badge>
                          <Badge
                            variant={
                              election.status === 'ACTIVE' ? 'success' :
                              election.status === 'SCHEDULED' ? 'default' :
                              election.status === 'COMPLETED' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {ELECTION_STATUS_LABELS[election.status] || election.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {formatters.formatDate(election.startDate)} - {formatters.formatDate(election.endDate)}
                          </span>
                          <span>•</span>
                          <span>{election.positionsCount} positions</span>
                          <span>•</span>
                          <span>{election.candidatesCount} candidates</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {election.totalVotes} votes
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {election.turnoutPercentage.toFixed(1)}% turnout
                          </p>
                        </div>
                        <Progress value={election.turnoutPercentage} className="w-20 h-2" />
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/elections/${election.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <AuditLog
            showFilters={false}
            compact={true}
            maxHeight="500px"
          />
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="health" className="space-y-6">
          {systemHealth && <SystemHealthCard health={systemHealth} />}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Voter Participation Trends</CardTitle>
                <CardDescription>
                  Voting activity over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart will be implemented with actual data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Election Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown of election types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart will be implemented with actual data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>
                  Real-time system metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {systemHealth && (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{systemHealth.cpu}%</div>
                        <p className="text-sm text-muted-foreground">CPU Usage</p>
                        <Progress value={systemHealth.cpu} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{systemHealth.memory}%</div>
                        <p className="text-sm text-muted-foreground">Memory Usage</p>
                        <Progress value={systemHealth.memory} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{systemHealth.disk}%</div>
                        <p className="text-sm text-muted-foreground">Disk Usage</p>
                        <Progress value={systemHealth.disk} className="mt-2" />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}