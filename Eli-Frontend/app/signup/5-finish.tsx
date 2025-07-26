"use client"

import { useEffect } from "react"
import { useRouter } from "expo-router"
import { motion } from "framer-motion"
import { BarChart3, Bell, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useSignupContext } from "@/context/signupContext"
import SignupLayout from "@/components/signup/signupLayout"
import { useAuth } from "@/hooks/useAuth" // 1. Import the useAuth hook

const reportFrequencyOptions = [
  { value: "daily", label: "Daily", description: "Brief daily summaries of interactions and mood" },
  { value: "weekly", label: "Weekly", description: "Comprehensive weekly reports with trends and insights" },
  { value: "monthly", label: "Monthly", description: "Detailed monthly analysis with recommendations" },
]

const notificationOptions = [
  "Mood changes or concerns",
  "Missed interactions",
  "Medication reminders",
  "Activity suggestions",
  "Weekly summaries",
  "Emergency alerts",
]

export default function FinishStep() {
  const router = useRouter()
  const { formData, updateFormData, resetFormData } = useSignupContext()
  const { signup, isLoading, error, success } = useAuth()

  const handleBack = () => {
    router.push("/signup/4-routine")
  }

  const handleNotificationChange = (notification: string, checked: boolean) => {
    const updatedNotifications = checked
        ? [...formData.notificationPreferences, notification]
        : formData.notificationPreferences.filter((n) => n !== notification)
    updateFormData({ notificationPreferences: updatedNotifications })
  }

  const handleFinishSetup = async () => {
    await signup(formData)
  }

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        resetFormData()
        router.push("/dashboard")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [success, resetFormData, router])

  if (success) {
    return (
        <SignupLayout>
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Setup Complete!</h2>
            <p className="text-slate-600 mb-6">
              Welcome to ELI! Your personalized companion is ready to start meaningful conversations.
            </p>
            <div className="animate-pulse text-blue-600">Redirecting to your dashboard...</div>
          </motion.div>
        </SignupLayout>
    )
  }

  return (
      <SignupLayout>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Dashboard & Notifications</h2>
            <p className="text-slate-500">Finally, set up how you'll receive insights and well-being reports.</p>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <Label className="text-base font-semibold">Report Frequency</Label>
              </div>
              <RadioGroup value={formData.reportFrequency} onValueChange={(value) => updateFormData({ reportFrequency: value })}>
                {reportFrequencyOptions.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-slate-50">
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="font-medium cursor-pointer">{option.label}</Label>
                        <p className="text-sm text-slate-500 mt-1">{option.description}</p>
                      </div>
                    </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-blue-600" />
                <Label className="text-base font-semibold">Notification Preferences</Label>
              </div>
              <p className="text-sm text-slate-500 mb-4">Choose what types of notifications you'd like to receive.</p>
              <div className="space-y-3">
                {notificationOptions.map((notification) => (
                    <div key={notification} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50">
                      <Checkbox
                          id={notification}
                          checked={formData.notificationPreferences.includes(notification)}
                          onCheckedChange={(checked) => handleNotificationChange(notification, checked as boolean)}
                      />
                      <Label htmlFor={notification} className="text-sm font-normal cursor-pointer flex-1">{notification}</Label>
                    </div>
                ))}
              </div>
            </div>

            {/* 5. Display an error message if the API call fails */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center gap-3" role="alert">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <strong className="font-semibold">Setup failed: </strong>
                    <span>{error}</span>
                  </div>
                </div>
            )}

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Setup Summary</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Resident:</strong> {formData.preferredName} ({formData.relationship})</p>
                <p><strong>Companion:</strong> {formData.companionName}</p>
                <p><strong>Voice:</strong> {formData.voiceSelection} • <strong>Tone:</strong> {formData.conversationTone}</p>
                <p><strong>Reports:</strong> {formData.reportFrequency}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button onClick={handleBack} variant="outline" disabled={isLoading}>
              Back
            </Button>
            <Button onClick={handleFinishSetup} disabled={isLoading} className="bg-teal-600 hover:bg-teal-700 text-white px-8">
              {/* 6. Use isLoading from the hook for button state */}
              {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Setting up...</>
              ) : (
                  "Finish Setup"
              )}
            </Button>
          </div>
        </motion.div>
      </SignupLayout>
  )
}
