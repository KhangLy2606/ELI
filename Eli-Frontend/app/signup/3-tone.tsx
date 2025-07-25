"use client"

import { useRouter } from "expo-router"
import { motion } from "framer-motion"
import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSignupContext } from "@/context/signupContext"
import SignupLayout from "@/components/signup/signupLayout"

const voiceOptions = [
  { value: "warm", label: "Warm & Gentle", description: "Soft, caring tone perfect for comfort" },
  { value: "cheerful", label: "Cheerful & Upbeat", description: "Bright and energetic for motivation" },
  { value: "calm", label: "Calm & Soothing", description: "Peaceful and relaxing for tranquility" },
  { value: "professional", label: "Professional & Clear", description: "Clear and articulate for clarity" },
]

const chattinessOptions = [
  { value: "quiet", label: "Quiet", description: "Brief responses, speaks when spoken to" },
  { value: "moderate", label: "Moderate", description: "Balanced conversation, asks follow-up questions" },
  { value: "chatty", label: "Chatty", description: "Engaging and talkative, loves to converse" },
]

const toneOptions = [
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "formal", label: "Formal", description: "Respectful and polite" },
  { value: "playful", label: "Playful", description: "Light-hearted and fun" },
  { value: "supportive", label: "Supportive", description: "Encouraging and understanding" },
]

export default function ToneStep() {
  const router = useRouter()
  const { formData, updateFormData } = useSignupContext()

  const handleBack = () => {
    router.push("/signup/2-persona")
  }

  const handleNext = () => {
    router.push("/signup/4-routine")
  }

  return (
    <SignupLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 text-base"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Communication Preferences</h2>
          <p className="text-slate-500">
            Customize how ELI interacts to make it a comfortable and pleasant experience.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Companion Name */}
          <div>
            <Label htmlFor="companionName">Companion's Name</Label>
            <Input
              id="companionName"
              placeholder="What would they like to call their companion?"
              value={formData.companionName}
              onChange={(e) => updateFormData({ companionName: e.target.value })}
              className="mt-2"
            />
            <p className="text-slate-500 mt-1">Default is &quot;ELI&quot; but you can personalize it.</p>
          </div>

          {/* Voice Selection */}
          <div>
            <Label className="text-base font-semibold">Voice Selection</Label>
            <RadioGroup
              value={formData.voiceSelection}
              onValueChange={(value) => updateFormData({ voiceSelection: value })}
              className="mt-4"
            >
              {voiceOptions.map((option) => (
                <label
                  key={option.value}
                  htmlFor={option.value}
                  className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-slate-50 cursor-pointer w-full mb-2 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Volume2 className="h-4 w-4" />
                      {option.label}
                    </div>
                    <p className="text-slate-500 mt-1">{option.description}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Chattiness Level */}
          <div>
            <Label className="text-base font-semibold">Chattiness Level</Label>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {chattinessOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData({ chattinessLevel: option.value })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.chattinessLevel === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <p className="text-slate-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Tone */}
          <div>
            <Label className="text-base font-semibold">Conversation Tone</Label>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {toneOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData({ conversationTone: option.value })}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    formData.conversationTone === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <p className="text-slate-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
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
