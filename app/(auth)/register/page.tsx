"use client"

import React from "react"
import Image from "next/image"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { ConditionalAuth } from "@/components/auth/AuthGuard"
import { redirect } from "next/navigation"

export default function RegisterPage() {
  return (
    <ConditionalAuth
      when="unauthenticated"
      fallback={<>{redirect("/dashboard")}</>}
    >
      <div className="min-h-screen flex">
        {/* Left Side - Banner Image */}
        <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-2xl">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Join UniElect Today
                </h2>
                <p className="text-xl text-purple-100">
                  Be part of the democratic process. Register now to participate in electing
                  your student leaders and making your voice heard.
                </p>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/vote-illustration2.jpg"
                  alt="Online voting platform"
                  width={600}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <RegisterForm redirectTo="/verify-email" />
        </div>
      </div>
    </ConditionalAuth>
  )
}