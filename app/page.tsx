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
      color: "text-sage-600 bg-sage-100",
      gradient: "from-sage-500 to-sage-600"
    },
    {
      icon: Vote,
      title: "Easy Voting Process",
      description: "Intuitive interface that makes electing your student leaders simple and accessible for all university students.",
      color: "text-emerald-600 bg-emerald-100",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: BarChart3,
      title: "Real-time Results",
      description: "Live election tracking with instant result updates and comprehensive analytics for student government elections.",
      color: "text-sage-600 bg-sage-100",
      gradient: "from-sage-500 to-emerald-600"
    },
    {
      icon: Users,
      title: "Role-based Access",
      description: "Comprehensive admin controls for election officials with multi-level permissions and oversight capabilities.",
      color: "text-emerald-600 bg-emerald-100",
      gradient: "from-emerald-500 to-sage-600"
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
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-50 to-emerald-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sage-600 to-emerald-600 rounded-md opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
                <Image
                  src="/images/unielect-logo.jpg"
                  alt="UniElect Logo"
                  width={40}
                  height={40}
                  className="rounded-md relative shadow-lg"
                />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-heading font-bold bg-gradient-to-r from-sage-600 to-emerald-600 bg-clip-text text-transparent">UniElect</h1>
                <p className="text-xs text-gray-600 font-medium">Secure Digital Voting</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-sage-600 hover:bg-sage-50">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-sage-600 to-emerald-600 hover:from-sage-700 hover:to-emerald-700 text-white shadow-lg shadow-sage-500/30">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-600/5 via-sage-600/5 to-emerald-600/5"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

        <div className="w-full px-6 sm:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-7xl mx-auto">
            {/* Hero Image Card with Overlay - Takes 7 columns */}
            <div className="relative group order-2 lg:order-1 lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-full min-h-[380px] transform transition-all duration-500 group-hover:scale-[1.01]">
                {/* Background Image */}
                <Image
                  src="/images/vote-illustration1.jpg"
                  alt="Students participating in democratic voting"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sage-900/90 via-sage-900/70 to-emerald-900/50"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="space-y-3">
                    <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 w-fit px-3 py-1 text-xs">
                      Featured Platform
                    </Badge>
                    <h3 className="text-2xl font-heading font-bold leading-tight">Empower Student Democracy</h3>
                    <p className="text-white/90 text-sm leading-relaxed max-w-lg">
                      Join thousands of students making their voices heard through secure, transparent elections.
                    </p>
                    <div className="flex gap-3 pt-1">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-xs font-medium">100% Secure</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-xs font-medium">Real-time Results</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Content - Takes 5 columns */}
            <div className="text-center lg:text-left flex flex-col justify-center order-1 lg:order-2 lg:col-span-5">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-heading font-bold text-gray-900 mb-5 leading-tight">
                University Student Leaders
                <span className="bg-gradient-to-r from-sage-600 via-sage-600 to-emerald-600 bg-clip-text text-transparent block mt-2">
                  Election Platform
                </span>
              </h1>

              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                A secure, transparent, and efficient platform for electing student leaders in your university.
                Empower your campus democracy with a system that ensures every student voice counts.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center mb-4">
                <Link href="/register">
                  <Button size="default" className="bg-gradient-to-r from-sage-600 to-emerald-600 hover:from-sage-700 hover:to-emerald-700 text-white shadow-xl shadow-sage-500/30 transform transition-all hover:scale-105">
                    Start Voting Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="default" className="border-2 border-sage-200 text-sage-700 hover:bg-sage-50 hover:border-sage-300">
                    Sign In to Continue
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-sage-600 to-emerald-600 rounded-xl opacity-10 blur-lg group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all border border-sage-100">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-sage-100 to-emerald-100 rounded-lg mb-3">
                        <stat.icon className="h-5 w-5 text-sage-600" />
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-sage-600 to-emerald-600 bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-xs text-gray-600 font-medium mt-1">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sage-100 to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100 to-transparent rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-gradient-to-r from-sage-100 to-emerald-100 text-sage-700 border-0 text-xs">
              Platform Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-3">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-sage-600 to-emerald-600 bg-clip-text text-transparent">
                UniElect?
              </span>
            </h2>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built specifically for university student leader elections with enterprise-grade security and student-friendly design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="group relative border-0 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                {/* Gradient background */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", feature.gradient)}></div>

                <CardHeader className="text-center pb-3 relative z-10">
                  <div className="relative inline-block mb-3">
                    <div className={cn("absolute inset-0 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity", `bg-gradient-to-r ${feature.gradient}`)}></div>
                    <div className={cn("relative inline-flex items-center justify-center w-12 h-12 rounded-xl group-hover:scale-110 transition-transform", feature.color)}>
                      <feature.icon className="h-5 w-5 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <CardTitle className="text-base font-heading mb-1 group-hover:text-white transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-center text-xs text-gray-600 leading-relaxed group-hover:text-white/90 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-sage-50/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-sage-200/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/40 to-transparent rounded-full blur-3xl"></div>

        <div className="w-full px-6 sm:px-8 lg:px-12 relative">
          <div className="text-center mb-10 max-w-7xl mx-auto">
            <Badge className="mb-3 bg-gradient-to-r from-sage-100 to-emerald-100 text-sage-700 border-0 text-xs">
              Platform Benefits
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-3">
              Experience the{" "}
              <span className="bg-gradient-to-r from-sage-600 to-emerald-600 bg-clip-text text-transparent">
                Difference
              </span>
            </h2>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every aspect designed to make your voting experience seamless, secure, and meaningful.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-7xl mx-auto">
            {/* Benefits List - Takes 5 columns */}
            <div className="space-y-4 order-1 lg:order-1 lg:col-span-5">
              {benefits.map((benefit, index) => (
                <div key={index} className="group flex items-start space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-sage-100/50 hover:-translate-y-1">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-sage-600 to-emerald-600 rounded-lg opacity-20 blur-md group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-sage-600 to-emerald-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                        <benefit.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-heading font-semibold text-gray-900 mb-1 group-hover:text-sage-700 transition-colors">{benefit.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits Image Card with Overlay - Takes 7 columns */}
            <div className="relative group order-2 lg:order-2 lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-full min-h-[380px] transform transition-all duration-500 group-hover:scale-[1.01]">
                {/* Background Image */}
                <Image
                  src="/images/vote-illustration2.jpg"
                  alt="Online voting platform for student elections"
                  fill
                  className="object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-sage-900/70 to-sage-900/50"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit">
                      <Award className="h-4 w-4 text-yellow-300" />
                      <span className="text-xs font-semibold">Certified Platform</span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold leading-tight">Trusted by Universities</h3>
                    <p className="text-white/90 text-sm leading-relaxed max-w-lg">
                      Officially endorsed and certified for student governance with full compliance to election standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-600 via-sage-600 to-emerald-600"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>

        {/* Floating gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sage-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
            Start Your Journey
          </Badge>

          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4 leading-tight">
            Ready to Elect Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-green-200">
              Student Leaders?
            </span>
          </h2>

          <p className="text-sm text-white/90 mb-6 leading-relaxed max-w-2xl mx-auto">
            Join thousands of students who trust our platform for secure, transparent student government elections.
            Your voice matters in shaping the future of your university.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/register">
              <Button size="default" className="bg-white text-sage-700 hover:bg-gray-100 shadow-xl hover:shadow-white/20 transform hover:scale-105 transition-all">
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="default" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm">
                Sign In Now
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 items-center text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Certified Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">5,000+ Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white py-12 overflow-hidden">
        {/* Background gradient decoration */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-sage-600 via-sage-600 to-emerald-600"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-sage-600 to-emerald-600 rounded-md opacity-20 blur-md group-hover:opacity-30 transition-opacity"></div>
                  <Image
                    src="/images/unielect-logo.jpg"
                    alt="UniElect Logo"
                    width={32}
                    height={32}
                    className="rounded-md relative shadow-lg"
                  />
                </div>
                <div className="ml-2.5">
                  <h3 className="text-base font-heading font-bold bg-gradient-to-r from-sage-400 to-emerald-400 bg-clip-text text-transparent">UniElect</h3>
                  <p className="text-xs text-gray-400">Secure Digital Voting</p>
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-4 max-w-md leading-relaxed">
                Empowering student leader elections with cutting-edge security and transparency
                for universities worldwide.
              </p>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-sage-600 to-emerald-600 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-sage-600 to-emerald-600 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <Shield className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-gray-300 text-xs">
                <li>
                  <Link href="/login" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group">
                    <ChevronDown className="h-3 w-3 -rotate-90 text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group">
                    <ChevronDown className="h-3 w-3 -rotate-90 text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group">
                    <ChevronDown className="h-3 w-3 -rotate-90 text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group">
                    <ChevronDown className="h-3 w-3 -rotate-90 text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    About UniElect
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-gray-300 text-xs">
                <li>
                  <Link href="/support" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group">
                    <ChevronDown className="h-3 w-3 -rotate-90 text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group">
                    <ChevronDown className="h-3 w-3 -rotate-90 text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group">
                    <ChevronDown className="h-3 w-3 -rotate-90 text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group">
                    <ChevronDown className="h-3 w-3 -rotate-90 text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800/50 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-gray-400 text-xs">
                &copy; 2025 UniElect Voting Management System. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <Shield className="h-3 w-3 text-sage-400" />
                  <span className="text-gray-400">End-to-end encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-gray-400">Certified platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}