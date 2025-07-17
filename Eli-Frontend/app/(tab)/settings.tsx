"use client"

import { User, Bell, Shield, Moon, Globe, HelpCircle, LogOut } from "lucide-react"
import ProfileHeader from "../../components/settingsPage/profileHeader"
import SettingsLink from "../../components/settingsPage/SettingsLink"
import SettingsToggle from "../../components/settingsPage/SettingsToggle"

export default function Settings() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Profile Header */}
            <ProfileHeader />

            {/* Settings Sections */}
            <div className="px-6 space-y-6">
        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900">Account</h3>
        </div>
        <SettingsLink label="Edit Profile" icon={<User />} onClick={() => console.log("Navigate to Edit Profile")} />
    <div className="border-t border-gray-100">
    <SettingsToggle label="Push Notifications" icon={<Bell />} initialValue={true} />
    </div>
    </div>

    {/* Privacy & Security Section */}
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
        </div>
        <SettingsLink
    label="Privacy Settings"
    icon={<Shield />}
    onClick={() => console.log("Navigate to Privacy Settings")}
    />
    </div>

    {/* Preferences Section */}
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
        </div>
        <SettingsToggle label="Dark Mode" icon={<Moon />} initialValue={false} />
    <div className="border-t border-gray-100">
    <SettingsLink
        label="Language"
    icon={<Globe />}
    onClick={() => console.log("Navigate to Language Settings")}
    />
    </div>
    </div>

    {/* Support Section */}
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900">Support</h3>
        </div>
        <SettingsLink
    label="Help & Support"
    icon={<HelpCircle />}
    onClick={() => console.log("Navigate to Help & Support")}
    />
    </div>

    {/* Sign Out */}
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-20">
    <SettingsLink label="Sign Out" icon={<LogOut />} onClick={() => console.log("Sign Out")} />
    </div>
    </div>
    </div>
)
}
