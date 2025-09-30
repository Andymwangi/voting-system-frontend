"use client"

import React from "react"
import Image from "next/image"
import { LoginForm } from "@/components/auth/LoginForm"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { ConditionalAuth } from "@/components/auth/AuthGuard"
import { redirect } from "next/navigation"

export default function LoginPage() {
  return (
    <ConditionalAuth
      when="unauthenticated"
      fallback={<>{redirect("/dashboard")}</>}
    >
      <div className="min-h-screen flex">
        {/* Left Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <LoginForm redirectTo="/dashboard" />
        </div>

        {/* Right Side - Banner Image */}
        <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-2xl">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Welcome to UniElect
                </h2>
                <p className="text-xl text-blue-100">
                  Secure and transparent platform for university student leader elections.
                  Your voice matters in shaping campus democracy.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/vote-illustration3.jpg"
                  alt="Student leaders campaigning"
                  width={600}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConditionalAuth>
  )
}