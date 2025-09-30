"use client"

import React from "react"
import Link from "next/link"
import {
  Vote,
  Calendar,
  TrendingUp,
  Clock,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Bell,
  BarChart3
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ElectionCard } from "@/components/voter/ElectionCard"
import { useElections } from "@/lib/hooks/useElections"
import { useAuth } from "@/lib/hooks/useAuth"
import { useVoting } from "@/lib/hooks/useVoting"
import { Election } from "@/lib/types"
import { ElectionStatus } from "@/lib/enums"
import { cn } from "@/lib/utils/cn"
import { format } from "date-fns"

export default function VoterDashboard() {
  const { user } = useAuth()
  const { elections, isLoading: electionsLoading, fetchElections, fetchActiveElections } = useElections()

  // Auto-fetch elections on mount
  React.useEffect(() => {
    if (user && !electionsLoading) {
      fetchElections().catch(console.error)
      fetchActiveElections().catch(console.error)
    }
  }, [user, electionsLoading, fetchElections, fetchActiveElections])
  const { votingHistory, isLoading: historyLoading, fetchVotingHistory } = useVoting()

  const activeElections = elections?.filter(election =>
    election.status === ElectionStatus.ACTIVE
  ) || []

  const upcomingElections = elections?.filter(election =>
    election.status === ElectionStatus.SCHEDULED
  ) || []

  const recentVotes = votingHistory?.slice(0, 3) || []

  // Auto-fetch voting history on mount
  React.useEffect(() => {
    if (user && !historyLoading) {
      fetchVotingHistory().catch(console.error)
    }
  }, [user, historyLoading, fetchVotingHistory])

  const dashboardStats = {
    totalElections: elections?.length || 0,
    activeElections: activeElections.length,
    completedVotes: votingHistory?.length || 0,
    upcomingElections: upcomingElections.length
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U"
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const getFullName = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "Unknown User"
    return `${firstName} ${lastName}`.trim()
  }

  if (electionsLoading || historyLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {getFullName(user?.firstName, user?.lastName)}!
            </h1>
            <p className="text-blue-100">
              Your student ID: {user?.studentId} " Stay informed and make your voice heard
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{dashboardStats.completedVotes}</div>
              <div className="text-sm text-blue-200">Votes Cast</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{dashboardStats.activeElections}</div>
              <div className="text-sm text-blue-200">Active Elections</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Vote className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Elections</p>
                <p className="text-xl font-bold">{dashboardStats.totalElections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Votes Cast</p>
                <p className="text-xl font-bold">{dashboardStats.completedVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-xl font-bold">{dashboardStats.activeElections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-xl font-bold">{dashboardStats.upcomingElections}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Elections Alert */}
      {activeElections.length > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <Bell className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Action Required:</strong> You have {activeElections.length} active election(s) waiting for your vote.{" "}
            <Link href="/elections" className="underline font-medium">
              Vote now �
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Elections */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Vote className="h-5 w-5 mr-2 text-blue-600" />
                  Active Elections
                </CardTitle>
                <Link href="/elections">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Elections you can vote in right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeElections.length === 0 ? (
                <div className="text-center py-8">
                  <Vote className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Elections</h3>
                  <p className="text-gray-500 mb-4">Check back later for new elections to participate in.</p>
                  <Link href="/elections">
                    <Button variant="outline">
                      Browse All Elections
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeElections.slice(0, 2).map((election) => (
                    <ElectionCard
                      key={election.id}
                      election={election}
                      variant="compact"
                    />
                  ))}
                  {activeElections.length > 2 && (
                    <div className="text-center pt-4">
                      <Link href="/elections">
                        <Button variant="outline">
                          View {activeElections.length - 2} More Elections
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Elections */}
          {upcomingElections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Upcoming Elections
                </CardTitle>
                <CardDescription>
                  Elections scheduled to start soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingElections.slice(0, 2).map((election) => (
                    <ElectionCard
                      key={election.id}
                      election={election}
                      variant="compact"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest voting activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentVotes.length === 0 ? (
                <div className="text-center py-4">
                  <Award className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No voting history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentVotes.map((vote, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Voted in Election {vote.electionId}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(vote.timestamp), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/history">
                    <Button variant="ghost" size="sm" className="w-full">
                      View Full History
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/elections" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Vote className="h-4 w-4 mr-2" />
                    Browse Elections
                  </Button>
                </Link>
                <Link href="/results" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                </Link>
                <Link href="/history" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Voting History
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Contact the Student Council for any voting-related questions.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}