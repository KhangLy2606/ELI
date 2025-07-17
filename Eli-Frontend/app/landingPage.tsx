"use client"

import {
    ArrowRight,
    Play,
    Brain,
    TrendingUp,
    Lightbulb,
    Twitter,
    Linkedin,
    Mail,
    Presentation,
    Sparkles,
    Mic,
} from "lucide-react"
import { Link } from "expo-router"
import StarField from "../components/landingPage/starField"
import AuroraBackground from "../components/landingPage/auroraBackground"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 text-gray-800 overflow-x-hidden">
            {/* Background Effects */}
            <AuroraBackground />
            <StarField />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                            ELI
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="#overview" className="text-gray-600 hover:text-gray-800 transition-colors">
                                Overview
                            </Link>
                            <Link href="#features" className="text-gray-600 hover:text-gray-800 transition-colors">
                                Features
                            </Link>
                            <Link href="/pricing" className="text-gray-600 hover:text-gray-1000 transition-colors">
                                Pricing
                            </Link>
                            <Link href="/about" className="text-gray-600 hover:text-gray-1000 transition-colors">
                                About Us
                            </Link>
                        </div>

                        {/* CTA Button */}
                        <Link
                            href="/login"
                            className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white px-6 py-2 rounded-full flex items-center shadow-lg"
                        >
                            Get Started
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative z-10 px-6">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        A New Horizon for Your{" "}
                        <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Emotional Insights
            </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                        ELI helps you understand your emotional patterns, providing clarity and guidance through intelligent
                        journaling and analysis. Your journey to self-awareness starts here.
                    </p>

                    {/* Interactive Chat Area */}
                    <div className="mb-8 max-w-2xl mx-auto">
                        {/* Chat Input Box */}
                        <div className="relative mb-6">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                <Sparkles className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent" />
                            </div>
                            <input
                                type="text"
                                placeholder="Ask ELI how you're feeling today..."
                                className="w-full bg-white/10 backdrop-blur-md border border-gray-200/50 rounded-full px-12 py-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 shadow-inner"
                            />
                        </div>

                        {/* Microphone & Animation Area */}
                        <div className="relative flex items-center justify-center">
                            {/* Voice Animation Rings */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full border-2 border-yellow-400/30 animate-ping"></div>
                                <div
                                    className="absolute w-16 h-16 rounded-full border-2 border-pink-400/30 animate-ping"
                                    style={{ animationDelay: "0.5s" }}
                                ></div>
                                <div
                                    className="absolute w-12 h-12 rounded-full border-2 border-yellow-400/40 animate-ping"
                                    style={{ animationDelay: "1s" }}
                                ></div>
                                <div
                                    className="absolute w-8 h-8 rounded-full border-2 border-pink-400/40 animate-ping"
                                    style={{ animationDelay: "1.5s" }}
                                ></div>
                            </div>

                            {/* Microphone Button */}
                            <button className="relative z-10 w-16 h-16 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105">
                                <Mic className="w-8 h-8 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/dashboard"
                            className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white px-8 py-4 rounded-full text-lg shadow-md"
                        >
                            Login to Dashboard
                        </Link>

                        <button className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                            <Play className="w-5 h-5 mr-2" />
                            Watch the video
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Powerful Features for{" "}
                            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Self-Discovery
              </span>
                        </h2>
                    </div>

                    <div className="space-y-20">
                        {/* Feature 1 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-bold mb-4 text-gray-800">Proactive Voice Companion</h3>
                                <p className="text-xl text-gray-700 leading-relaxed">
                                    ELI initiates natural, friendly conversations throughout the day—reducing loneliness by keeping
                                    residents engaged and heard.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-gray-200">
                                    <Brain className="w-16 h-16 text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="md:order-2">
                                <h3 className="text-3xl font-bold mb-4 text-gray-800">Mood Analytics</h3>
                                <p className="text-xl text-gray-700 leading-relaxed">
                                    Visualize your emotional trends over time with beautiful, easy-to-understand charts that reveal
                                    insights about your mental well-being.
                                </p>
                            </div>
                            <div className="flex justify-center md:order-1">
                                <div className="w-32 h-32 bg-gradient-to-br from-pink-400/20 to-yellow-400/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-gray-200">
                                    <TrendingUp className="w-16 h-16 text-pink-400" />
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-bold mb-4 text-gray-800">Engaging Cognitive Activities</h3>
                                <p className="text-xl text-gray-700 leading-relaxed">
                                    Interactive prompts and memory-stimulating exercises promote mental engagement, helping maintain
                                    cognitive health in daily life.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-gray-200">
                                    <Lightbulb className="w-16 h-16 text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="md:order-2">
                                <h3 className="text-3xl font-bold mb-4 text-gray-800">Caregiver Dashboard & Reports</h3>
                                <p className="text-xl text-gray-700 leading-relaxed">
                                    Accessible charts and concise analytics on engagement trends empower caregivers with actionable
                                    insights into residents emotional health.
                                </p>
                            </div>
                            <div className="flex justify-center md:order-1">
                                <div className="w-32 h-32 bg-gradient-to-br from-pink-300/20 to-yellow-300/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-gray-200">
                                    <Presentation className="w-16 h-16 text-pink-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="py-20 relative z-10">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">
                        Ready to Begin Your{" "}
                        <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Journey?</span>
                    </h2>

                    <Link
                        href="/login"
                        className="inline-block bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white px-12 py-4 rounded-full text-xl shadow-md"
                    >
                        Sign Up Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-200 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent mb-4 md:mb-0">
                            ELI
                        </div>

                        <div className="flex items-center space-x-8 mb-4 md:mb-0">
                            <a href="#contact" className="text-gray-600 hover:text-gray-800 transition-colors">
                                Contact
                            </a>
                            <a href="#privacy" className="text-gray-600 hover:text-gray-800 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#terms" className="text-gray-600 hover:text-gray-800 transition-colors">
                                Terms of Service
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
