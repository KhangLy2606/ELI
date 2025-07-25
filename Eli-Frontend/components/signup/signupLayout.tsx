"use client"

import type { ReactNode } from "react"
import React from "react"
import { usePathname } from "expo-router"
import { Check } from "lucide-react"
import AuroraBackground from "../landingPage/auroraBackground"
import StarField from "../landingPage/starField"

interface SignupLayoutProps {
    children: ReactNode
}

const steps = [
    { number: 1, label: "Account", path: "/signup/1-account" },
    { number: 2, label: "Persona", path: "/signup/2-persona" },
    { number: 3, label: "Tone", path: "/signup/3-tone" },
    { number: 4, label: "Routine", path: "/signup/4-routine" },
    { number: 5, label: "Finish", path: "/signup/5-finish" },
]

export default function SignupLayout({ children }: SignupLayoutProps) {
    const pathname = usePathname()
    const currentStep = steps.find((step) => step.path === pathname)?.number || 1

    return (
        // This is now the main scrollable container for the entire page.
        // It has a fixed height of the screen and will show a scrollbar if content overflows.
        <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-y-auto">
            {/* Background Effects Container - Fixed to stay in the background */}
            <div className="fixed inset-0 z-0">
                <AuroraBackground />
                <StarField />
            </div>

            {/* Main Content - This container holds the centered card */}
            <div className="relative z-10 p-4 py-12 md:py-20">
                <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 mx-auto">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl mb-4">
                            <span className="text-3xl font-bold text-white">E</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                            ELI
                        </h1>
                    </div>

                    {/* Progress Stepper */}
                    <div className="mb-12">
                        <div className="flex items-center">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                                                step.number < currentStep
                                                    ? "bg-teal-500 text-white"
                                                    : step.number === currentStep
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-200 text-gray-500"
                                            }`}
                                        >
                                            {step.number < currentStep ? <Check className="w-5 h-5" /> : <span>{step.number}</span>}
                                        </div>
                                        <span
                                            className={`mt-2 text-xs text-center font-medium w-16 ${
                                                step.number <= currentStep ? "text-gray-900" : "text-gray-500"
                                            }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                                                step.number < currentStep ? "bg-teal-500" : "bg-gray-200"
                                            }`}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="space-y-8">{children}</div>
                </div>
            </div>
        </div>
    )
}
