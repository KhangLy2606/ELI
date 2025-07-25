"use client"

import { useRouter } from "expo-router"
import { motion } from "framer-motion"
import { Clock, Brain, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useSignupContext } from "@/context/signupContext"
import SignupLayout from "@/components/signup/signupLayout"

const cognitiveActivities = [
  "Memory games",
  "Word puzzles",
  "Storytelling prompts",
  "Photo discussions",
  "Music reminiscence",
  "Current events chat",
  "Trivia questions",
  "Creative writing",
  "Math exercises",
  "Geography games",
]

export default function RoutineStep() {
  const router = useRouter()
  const { formData, updateFormData } = useSignupContext()

  const handleBack = () => {
    router.push("/signup/3-tone")
  }

  const handleNext = () => {
    router.push("/signup/5-finish")
  }

  const handleActivityChange = (activity: string, checked: boolean) => {
    const updatedActivities = checked
      ? [...formData.cognitiveActivities, activity]
      : formData.cognitiveActivities.filter((a) => a !== activity)
    updateFormData({ cognitiveActivities: updatedActivities })
  }

  return (
    <SignupLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Daily Routine</h2>
          <p className="text-slate-500">
            Align ELI's interactions with their daily schedule to be helpful, not disruptive.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Sleep Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="wakeUpTime">Typical Wake-up Time</Label>
              <div className="relative mt-2">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="wakeUpTime"
                  type="time"
                  value={formData.wakeUpTime}
                  onChange={(e) => updateFormData({ wakeUpTime: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bedtime">Typical Bedtime</Label>
              <div className="relative mt-2">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="bedtime"
                  type="time"
                  value={formData.bedtime}
                  onChange={(e) => updateFormData({ bedtime: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Cognitive Activities */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-semibold">Preferred Cognitive Activities</Label>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Select activities that they enjoy and that help keep their mind engaged.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cognitiveActivities.map((activity) => (
                <div key={activity} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50">
                  <Checkbox
                    id={activity}
                    checked={formData.cognitiveActivities.includes(activity)}
                    onCheckedChange={(checked) => handleActivityChange(activity, checked as boolean)}
                  />
                  <Label htmlFor={activity} className="text-sm font-normal cursor-pointer flex-1">
                    {activity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <Label htmlFor="reminders" className="text-base font-semibold">
                Daily Reminders & Notes
              </Label>
            </div>
            <Textarea
              id="reminders"
              placeholder="Any specific reminders, medications, appointments, or routine notes that ELI should be aware of..."
              value={formData.reminders}
              onChange={(e) => updateFormData({ reminders: e.target.value })}
              className="min-h-24 resize-none"
            />
            <p className="text-sm text-slate-500 mt-1">
              This helps ELI provide timely reminders and stay aware of important daily needs.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button onClick={handleBack} variant="outline">
            Back
          </Button>
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
            Next
          </Button>
        </div>
      </motion.div>
    </SignupLayout>
  )
}
