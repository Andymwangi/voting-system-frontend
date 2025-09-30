"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Mail, Lock, Shield, Loader2, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { loginSchema, type LoginFormData } from "@/lib/utils/validators"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { cn } from "@/lib/utils/cn"

interface LoginFormProps {
  className?: string
  redirectTo?: string
  onSuccess?: () => void
}

export function LoginForm({ className, redirectTo = "/dashboard", onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [requires2FA, setRequires2FA] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      twoFactorCode: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setLoginError("")

    try {
      await login({
        identifier: data.identifier,
        password: data.password,
        twoFactorCode: data.twoFactorCode
      })

      // If login succeeds without error, redirect
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectTo)
      }
    } catch (error: any) {
      // Handle 2FA requirement
      if (error.message?.includes('2FA') || error.code === 'REQUIRES_2FA') {
        setRequires2FA(true)
        setIsLoading(false)
        return
      }

      // Handle other errors
      setLoginError(error.message || "Login failed. Please try again.")
      setRequires2FA(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setRequires2FA(false)
    form.setValue("twoFactorCode", "")
    setLoginError("")
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="text-center mb-8">
        <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {requires2FA ? "Two-Factor Authentication" : "Welcome back"}
        </h1>
        <p className="text-gray-600 mt-2">
          {requires2FA
            ? "Enter the verification code from your authenticator app"
            : "Sign in to your UniElect voting account"
          }
        </p>
      </div>

      {loginError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {!requires2FA ? (
            <>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Student ID</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your email or student ID"
                          className="pl-10"
                          autoComplete="email"
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          autoComplete="current-password"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm font-medium">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </>
          ) : (
            <FormField
              control={form.control}
              name="twoFactorCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter 6-digit code"
                        className="pl-10 text-center text-lg tracking-widest"
                        maxLength={6}
                        autoComplete="one-time-code"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : requires2FA ? (
                <>
                  Verify Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {requires2FA && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBackToLogin}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            )}
          </div>
        </form>
      </Form>

      {!requires2FA && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Create one here
            </Link>
          </p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield className="h-3 w-3" />
            <span>Secured by UniElect Authentication System</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface QuickLoginProps {
  className?: string
}

export function QuickLogin({ className }: QuickLoginProps) {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <div className={cn("rounded-lg border p-4", className)}>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
          <Link href="/dashboard">
            <Button size="sm">Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Quick Access
        </h3>
        <div className="space-y-2">
          <Link href="/login" className="block">
            <Button variant="outline" size="sm" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link href="/register" className="block">
            <Button size="sm" className="w-full">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginForm