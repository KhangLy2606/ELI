"use client"

import { Link } from "expo-router"
import { ArrowLeft, Mail, Lock } from "lucide-react"
import StarField from "../components/landingPage/starField"
import AuroraBackground from "../components/landingPage/auroraBackground"

export default function Login() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 text-gray-800 overflow-x-hidden">
            {/* Background Effects */}
            <AuroraBackground />
            <StarField />

            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/landingPage" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>
                        <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                            ELI
                        </div>
                        <div></div>
                    </div>
                </div>
            </nav>

            {/* Login Form */}
            <section className="min-h-screen flex items-center justify-center relative z-10 px-6 pt-20">
                <div className="w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-gray-200/50 p-8 shadow-xl">
                        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                            Welcome Back
                        </h2>

                        <form className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg px-10 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        id="password"
                                        className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg px-10 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            <Link
                                href="/dashboard"
                                className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white py-3 rounded-lg font-medium text-center block transition-all duration-300 shadow-lg"
                            >
                                Sign In
                            </Link>
                        </form>

                        <p className="text-center text-gray-600 mt-6">
                            Dont have an account?{" "}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
