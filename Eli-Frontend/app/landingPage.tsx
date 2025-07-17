"use client"

import { ArrowRight, Play, Brain, TrendingUp, Lightbulb, Twitter, Linkedin, Mail } from "lucide-react"
import StarField from "../components/landingPage/starField"
import AuroraBackground from "../components/landingPage/auroraBackground"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0C0C1E] text-white overflow-x-hidden">
            {/* Background Effects */}
            <AuroraBackground />
            <StarField />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#0C0C1E]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            ELI
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#overview" className="text-gray-300 hover:text-white transition-colors">
                                Overview
                            </a>
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                                Features
                            </a>
                            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                                Pricing
                            </a>
                            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                                About Us
                            </a>
                        </div>

                        {/* CTA Button */}
                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-full flex items-center">
                            Get Started
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative z-10 px-6">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        A New Horizon for Your{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Emotional Insights
            </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        ELI helps you understand your emotional patterns, providing clarity and guidance through intelligent
                        journaling and analysis. Your journey to self-awareness starts here.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-full text-lg"
                        >
                            Login to Dashboard
                        </button>

                        <button className="flex items-center text-gray-300 hover:text-white transition-colors">
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
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Self-Discovery
              </span>
                        </h2>
                    </div>

                    <div className="space-y-20">
                        {/* Feature 1 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-bold mb-4 text-white">Intelligent Journaling</h3>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    Log your thoughts and feelings with our smart editor that helps you identify key themes and patterns
                                    in your emotional journey.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <Brain className="w-16 h-16 text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="md:order-2">
                                <h3 className="text-3xl font-bold mb-4 text-white">Mood Analytics</h3>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    Visualize your emotional trends over time with beautiful, easy-to-understand charts that reveal
                                    insights about your mental well-being.
                                </p>
                            </div>
                            <div className="flex justify-center md:order-1">
                                <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <TrendingUp className="w-16 h-16 text-purple-400" />
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-bold mb-4 text-white">Personalized Insights</h3>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    Receive AI-powered feedback and suggestions based on your entries, helping you understand yourself
                                    better and grow emotionally.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <Lightbulb className="w-16 h-16 text-blue-400" />
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
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Journey?</span>
                    </h2>

                    <button
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-4 rounded-full text-xl"
                    >
                        Sign Up Now
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 md:mb-0">
                            ELI
                        </div>

                        <div className="flex items-center space-x-8 mb-4 md:mb-0">
                            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                                Contact
                            </a>
                            <a href="#privacy" className="text-gray-300 hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#terms" className="text-gray-300 hover:text-white transition-colors">
                                Terms of Service
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
