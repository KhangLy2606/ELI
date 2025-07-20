"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { Menu, PanelLeft, Search, Bell, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Import your actual screen components
import DashboardScreen from "./dashboard"
import SettingsScreen from "./settings"

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeView, setActiveView] = useState("dashboard")

    const sidebarItems = [
        {
            title: "Dashboard",
            icon: <Home className="h-5 w-5" />,
            key: "dashboard",
            isActive: activeView === "dashboard",
        },
        {
            title: "Settings",
            icon: <Settings className="h-5 w-5" />,
            key: "settings",
            isActive: activeView === "settings",
        },
    ]

    const getPageTitle = () => {
        switch (activeView) {
            case "dashboard":
                return "Dashboard"
            case "settings":
                return "Settings"
            default:
                return "ELI"
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Sidebar - Mobile */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200/50 bg-white/90 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Sidebar Content */}
                <div className="flex h-full flex-col">
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-pink-400 text-white">
                                <span className="font-bold text-lg">E</span>
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">ELI</h2>
                                <p className="text-xs text-gray-600">Emotional Insights</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-3 py-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full rounded-2xl border-0 bg-gray-100/50 py-2 pl-9 pr-4"
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-1 px-3 py-2">
                        <div className="space-y-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.key}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                                        item.isActive
                                            ? "border border-yellow-400/20 bg-gradient-to-r from-yellow-400/10 to-pink-400/10 text-gray-900"
                                            : "text-gray-600 hover:bg-gray-100/50",
                                    )}
                                    onClick={() => {
                                        setActiveView(item.key)
                                        setMobileMenuOpen(false)
                                    }}
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="border-t border-gray-200/50 p-3">
                        <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-gray-100/50">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                    <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-pink-400 text-xs text-white">
                                        AD
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-gray-900">Alex Doe</span>
                            </div>
                            <Badge variant="outline" className="rounded-full text-xs">
                                Pro
                            </Badge>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar - Desktop */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r border-gray-200/50 bg-white/90 backdrop-blur-md transition-transform duration-300 ease-in-out md:block",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Sidebar Content */}
                <div className="flex h-full flex-col">
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-pink-400 text-white">
                                <span className="font-bold text-lg">E</span>
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">ELI</h2>
                                <p className="text-xs text-gray-600">Emotional Insights</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-3 py-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full rounded-2xl border-0 bg-gray-100/50 py-2 pl-9 pr-4"
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-1 px-3 py-2">
                        <div className="space-y-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.key}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                                        item.isActive
                                            ? "border border-yellow-400/20 bg-gradient-to-r from-yellow-400/10 to-pink-400/10 text-gray-900"
                                            : "text-gray-600 hover:bg-gray-100/50",
                                    )}
                                    onClick={() => setActiveView(item.key)}
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="border-t border-gray-200/50 p-3">
                        <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-gray-100/50">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                    <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-pink-400 text-xs text-white">
                                        AD
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-gray-900">Alex Doe</span>
                            </div>
                            <Badge variant="outline" className="rounded-full text-xs">
                                Pro
                            </Badge>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div
                className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}
            >
                <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-gray-200/50 bg-white/90 px-4 backdrop-blur-md">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <PanelLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="rounded-2xl">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Avatar className="h-8 w-8 border-2 border-yellow-400/20">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-pink-400 text-sm text-white">
                                    AD
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6">
                    <Suspense fallback={<div>Loading...</div>}>
                        {activeView === 'dashboard' && <DashboardScreen />}
                        {activeView === 'settings' && <SettingsScreen />}
                    </Suspense>
                </main>
            </div>
        </div>
    )
}
