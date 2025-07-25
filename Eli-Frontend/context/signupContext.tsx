"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SignupFormData {
  fullName: string
  email: string
  password: string
  preferredName: string
  relationship: string
  dateOfBirth: string
  primaryLanguage: string

  lifeStory: string
  hobbies: string[]
  importantPeople: string[]

  companionName: string
  voiceSelection: string
  chattinessLevel: string
  conversationTone: string

  
  wakeUpTime: string
  bedtime: string
  cognitiveActivities: string[]
  reminders: string

  reportFrequency: string
  notificationPreferences: string[]
}

interface SignupContextType {
  formData: SignupFormData
  updateFormData: (data: Partial<SignupFormData>) => void
  resetFormData: () => void
}

const initialFormData: SignupFormData = {
  fullName: "",
  email: "",
  password: "",
  preferredName: "",
  relationship: "",
  dateOfBirth: "",
  primaryLanguage: "English",
  lifeStory: "",
  hobbies: [],
  importantPeople: [],
  companionName: "ELI",
  voiceSelection: "warm",
  chattinessLevel: "moderate",
  conversationTone: "friendly",
  wakeUpTime: "07:00",
  bedtime: "22:00",
  cognitiveActivities: [],
  reminders: "",
  reportFrequency: "weekly",
  notificationPreferences: [],
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

export function SignupContextProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<SignupFormData>(initialFormData)

  const updateFormData = (data: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const resetFormData = () => {
    setFormData(initialFormData)
  }

  return <SignupContext.Provider value={{ formData, updateFormData, resetFormData }}>{children}</SignupContext.Provider>
}

export function useSignupContext() {
  const context = useContext(SignupContext)
  if (context === undefined) {
    throw new Error("useSignupContext must be used within a SignupContextProvider")
  }
  return context
}
