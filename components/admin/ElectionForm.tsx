"use client"

import React, { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Calendar,
  Plus,
  Trash2,
  Save,
  X,
  Clock,
  Users,
  Award,
  AlertCircle,
  Info
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Election, Position } from "@/lib/types"
import { ElectionType, ElectionStatus } from "@/lib/enums"
import { cn } from "@/lib/utils/cn"

const positionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Position name must be at least 2 characters"),
  description: z.string().optional(),
  maxSelections: z.number().min(1, "Must allow at least 1 selection").max(10, "Cannot exceed 10 selections"),
  requirementDescription: z.string().optional(),
  isRequired: z.boolean().default(true)
})

const electionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title cannot exceed 200 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description cannot exceed 2000 characters"),
  type: z.nativeEnum(ElectionType),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  rules: z.string().optional(),
  positions: z.array(positionSchema).min(1, "At least one position is required"),
  eligibilityRequirements: z.string().optional(),
  isPublished: z.boolean().default(false),
  allowAbstention: z.boolean().default(true),
  requireVoterVerification: z.boolean().default(true),
  maxVotersPerPosition: z.number().optional(),
  votingInstructions: z.string().optional()
}).refine((data) => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end > start
}, {
  message: "End date must be after start date",
  path: ["endDate"]
}).refine((data) => {
  const start = new Date(data.startDate)
  const now = new Date()
  return start > now
}, {
  message: "Start date must be in the future",
  path: ["startDate"]
})

interface ElectionFormProps {
  election?: Election
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  className?: string
}

export function ElectionForm({
  election,
  onSubmit,
  onCancel,
  isLoading = false,
  className
}: ElectionFormProps) {
  const [currentTab, setCurrentTab] = useState("basic")

  const form = useForm<z.infer<typeof electionSchema>>({
    resolver: zodResolver(electionSchema),
    defaultValues: {
      title: election?.title || "",
      description: election?.description || "",
      type: election?.type || ElectionType.PRESIDENTIAL,
      startDate: election?.startDate ? new Date(election.startDate).toISOString().slice(0, 16) : "",
      endDate: election?.endDate ? new Date(election.endDate).toISOString().slice(0, 16) : "",
      rules: election?.rules || "",
      positions: election?.positions?.map(pos => ({
        id: pos.id,
        name: pos.name,
        description: pos.description || "",
        maxSelections: pos.maxSelections,
        requirementDescription: pos.requirementDescription || "",
        isRequired: true
      })) || [
        {
          name: "",
          description: "",
          maxSelections: 1,
          requirementDescription: "",
          isRequired: true
        }
      ],
      eligibilityRequirements: "",
      isPublished: election?.isPublished || false,
      allowAbstention: true,
      requireVoterVerification: true,
      maxVotersPerPosition: undefined,
      votingInstructions: ""
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "positions"
  })

  const watchedStartDate = form.watch("startDate")
  const watchedEndDate = form.watch("endDate")

  // Calculate election duration
  const getDuration = () => {
    if (watchedStartDate && watchedEndDate) {
      const start = new Date(watchedStartDate)
      const end = new Date(watchedEndDate)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return 0
  }

  // Validate date constraints
  const validateDates = () => {
    if (watchedStartDate && watchedEndDate) {
      const start = new Date(watchedStartDate)
      const end = new Date(watchedEndDate)
      const now = new Date()

      if (start <= now) {
        return "Start date must be in the future"
      }
      if (end <= start) {
        return "End date must be after start date"
      }
      if (getDuration() > 30) {
        return "Election duration cannot exceed 30 days"
      }
    }
    return null
  }

  const handleSubmit = async (data: z.infer<typeof electionSchema>) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Failed to save election:", error)
    }
  }

  const addPosition = () => {
    append({
      name: "",
      description: "",
      maxSelections: 1,
      requirementDescription: "",
      isRequired: true
    })
  }

  const dateError = validateDates()
  const duration = getDuration()

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {election ? "Edit Election" : "Create New Election"}
          </h2>
          <p className="text-gray-600">
            {election ? "Update election details and settings" : "Set up a new election with positions and rules"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      {dateError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {dateError}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="dates">Schedule</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Election Details</CardTitle>
                  <CardDescription>
                    Basic information about the election
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Election Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., UniElect Student Council Elections 2025"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive title for the election
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Election Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select election type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(ElectionType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type determines eligibility and voting rules
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the purpose and scope of this election..."
                            className="h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description visible to voters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eligibilityRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eligibility Requirements</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Specify who can vote in this election..."
                            className="h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Requirements for voters (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Election Schedule</CardTitle>
                  <CardDescription>
                    Set the voting period for this election
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            When voting begins
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date & Time *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            When voting ends
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {duration > 0 && (
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Election Duration:</strong> {duration} day(s)
                        {duration > 7 && (
                          <span className="text-amber-600 ml-2">
                            " Consider shorter periods for better engagement
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="positions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Election Positions</CardTitle>
                      <CardDescription>
                        Define the positions available for candidates
                      </CardDescription>
                    </div>
                    <Button type="button" onClick={addPosition} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Position
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <div key={field.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Position {index + 1}</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`positions.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Student President"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`positions.${index}.maxSelections`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Max Selections *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Number of candidates voters can select
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`positions.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the responsibilities and requirements..."
                                  className="h-20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`positions.${index}.requirementDescription`}
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Candidate Requirements</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Requirements for candidates applying to this position..."
                                  className="h-16"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Election Settings</CardTitle>
                  <CardDescription>
                    Configure voting rules and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="rules"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Election Rules</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Specify any special rules or regulations for this election..."
                            className="h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Rules and regulations visible to all participants
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="votingInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voting Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide clear instructions for voters..."
                            className="h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Step-by-step voting instructions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Voting Options</h4>

                      <FormField
                        control={form.control}
                        name="allowAbstention"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Allow Abstention</FormLabel>
                              <FormDescription>
                                Let voters abstain from specific positions
                              </FormDescription>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="requireVoterVerification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Require Voter Verification</FormLabel>
                              <FormDescription>
                                Verify voter identity before voting
                              </FormDescription>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Publication</h4>

                      <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Publish Election</FormLabel>
                              <FormDescription>
                                Make election visible to eligible voters
                              </FormDescription>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {!form.watch("isPublished") && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Election will be saved as draft until published
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              {fields.length} position(s) " {duration > 0 ? `${duration} day(s)` : "Duration not set"}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !!dateError}>
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {election ? "Update Election" : "Create Election"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ElectionForm