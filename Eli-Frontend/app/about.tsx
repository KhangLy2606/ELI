"use client"

import { Link } from "expo-router"
import { ArrowLeft, Mail, Twitter, Linkedin } from "lucide-react"
import StarField from "../components/landingPage/starField"
import AuroraBackground from "../components/landingPage/auroraBackground"

export default function About() {
    // Team members list
    const teamMembers = [
        {
            name: "Hailey Doleweerd",
            role: "Project Contributor",
            image: "/placeholder.svg?height=150&width=150",
        },
        {
            name: "Mischa Lamoureux",
            role: "Project Contributor",
            image: "/placeholder.svg?height=150&width=150",
        },
        {
            name: "Benjamin Liu",
            role: "Project Contributor",
            image: "/placeholder.svg?height=150&width=150",
        },
        {
            name: "Khang Ly",
            role: "Project Contributor",
            image: "/placeholder.svg?height=150&width=150",
        },
        {
            name: "Momin Naeem",
            role: "Project Contributor",
            image: "/placeholder.svg?height=150&width=150",
        },
        {
            name: "Olivia Yi",
            role: "Project Contributor",
            image: "/placeholder.svg?height=150&width=150",
        },
    ]

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
                        <Link
                            href="/login"
                            className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white px-4 py-2 rounded-full text-sm"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </nav>

            {/* About Content */}
            <section className="relative z-10 px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    {/* Mission & Objective Section */}
                    <div className="text-center mb-20">
                        <h1 className="text-4xl md:text-6xl font-bold mb-8">
                            Our{" "}
                            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                                Purpose
                            </span>
                        </h1>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-gray-200/50 p-8 shadow-xl text-left">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Motivation</h2>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                As the world's population ages, a significant and growing number of older adults face increasing loneliness and social isolation. This is not just a social issue; it carries severe health risks, including a substantially higher likelihood of mortality and dementia. The urgent need to address these challenges is the driving force behind Eli.
                            </p>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Objective</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                The objective of Eli is to provide a low-cost, tabletop, speech-based companion for long-term care residents that proactively initiates natural conversation to reduce social isolation and support mental engagement, while providing concise well-being reports that caregivers can use to spot shifts in mood or social interaction.
                            </p>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {teamMembers.map((member, index) => (
                                <div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 text-center shadow-xl flex flex-col items-center justify-center"
                                >
                                    <img
                                        src={member.image || "/placeholder.svg"}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white"
                                    />
                                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                                    <p className="text-gray-600 text-sm">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Consultant Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Consultant</h2>
                        <div className="flex justify-center">
                            <div
                                className="w-full max-w-xs bg-white/10 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 text-center shadow-xl flex flex-col items-center justify-center"
                            >
                                <img
                                    src={"/placeholder.svg?height=150&width=150"}
                                    alt={"Lili Liu"}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white"
                                />
                                <h3 className="text-xl font-bold mb-2">Lili Liu</h3>
                                <p className="text-gray-600 text-sm">Project Consultant</p>
                            </div>
                        </div>
                    </div>

                    {/* Credits Section */}
                    <div className="text-center mb-20">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-gray-200/50 p-8 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Prepared By</h2>
                            <div className="border-t border-gray-200/50 my-4"></div>
                            <p className="text-gray-600"><strong>Group:</strong> 2026.064</p>
                        </div>
                    </div>

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