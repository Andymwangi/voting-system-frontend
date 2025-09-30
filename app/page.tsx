"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Vote, Users, BarChart3, CheckCircle, Clock, Lock, Award, Zap, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils/cn"

export default function WelcomePage() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "End-to-end encryption ensuring the integrity and confidentiality of every vote cast in student leader elections.",
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: Vote,
      title: "Easy Voting Process",
      description: "Intuitive interface that makes electing your student leaders simple and accessible for all university students.",
      color: "text-green-600 bg-green-100"
    },
    {
      icon: BarChart3,
      title: "Real-time Results",
      description: "Live election tracking with instant result updates and comprehensive analytics for student government elections.",
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: Users,
      title: "Role-based Access",
      description: "Comprehensive admin controls for election officials with multi-level permissions and oversight capabilities.",
      color: "text-orange-600 bg-orange-100"
    }
  ]

  const stats = [
    { label: "Active Students", value: "5,000+", icon: Users },
    { label: "Elections Held", value: "25+", icon: Vote },
    { label: "Votes Cast", value: "50K+", icon: CheckCircle },
    { label: "Uptime", value: "99.8%", icon: Clock }
  ]

  const benefits = [
    {
      icon: Lock,
      title: "Uncompromised Security",
      description: "Military-grade encryption protects every student vote with multi-factor authentication and complete audit trails."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Cast your vote for student leaders in under 30 seconds with our optimized, high-performance platform."
    },
    {
      icon: Globe,
      title: "Accessible Anywhere",
      description: "Vote for your student representatives from anywhere on campus or remotely with full mobile responsiveness."
    },
    {
      icon: Award,
      title: "University Certified",
      description: "Officially endorsed by universities with full compliance to student governance and election standards."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/images/unielect-logo.jpg"
                alt="UniElect Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">UniElect</h1>
                <p className="text-xs text-gray-500">Secure Digital Voting</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6">
                UniElect
              </Badge>

              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                University Student Leaders
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Election Platform
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                A secure, transparent, and efficient platform for electing student leaders in your university.
                Empower your campus democracy with a system that ensures every student voice counts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
                <Link href="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                    Start Voting Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="px-8 py-3">
                    Sign In to Continue
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/vote-illustration1.jpg"
                  alt="Students participating in democratic voting"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose UniElect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for university student leader elections with enterprise-grade security and student-friendly design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4", feature.color)}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Experience the Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every aspect designed to make your voting experience seamless, secure, and meaningful.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/vote-illustration2.jpg"
                  alt="Online voting platform for student elections"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Elect Your Student Leaders?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of students who trust our platform for secure, transparent student government elections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
                Sign In Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/unielect-logo.jpg"
                  alt="UniElect Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <div className="ml-3">
                  <h3 className="text-lg font-bold">UniElect</h3>
                  <p className="text-sm text-gray-400">Secure Digital Voting</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Empowering student leader elections with cutting-edge security and transparency
                for universities.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/login" className="hover:text-white">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/about" className="hover:text-white">About UniElect</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/support" className="hover:text-white">Contact Support</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 UniElect Voting Management System. All rights reserved.</p>
            <div className="flex items-center justify-center mt-2 space-x-2">
              <Shield className="h-3 w-3" />
              <span className="text-xs">Secured by end-to-end encryption</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}