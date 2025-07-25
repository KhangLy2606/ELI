"use client"

import { useState } from "react"
import { useRouter } from "expo-router"
import { motion } from "framer-motion"
import { User, Mail, Lock, Calendar, Globe } from "lucide-react"
import { Link } from "expo-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSignupContext } from "@/context/signupContext"
import SignupLayout from "@/components/signup/signupLayout"

export default function AccountStep() {
  const router = useRouter()
  const { formData, updateFormData } = useSignupContext()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.email.includes("@")) newErrors.email = "Please enter a valid email"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (!formData.preferredName.trim()) newErrors.preferredName = "Preferred name is required"
    if (!formData.relationship.trim()) newErrors.relationship = "Relationship is required"
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      router.push("/signup/2-persona")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value })
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
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
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Let's Get Started</h2>
          <p className="text-slate-500">Create your caregiver account, then add the resident you are caring for.</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Caregiver Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700">Caregiver Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>
          </div>

          {/* Resident Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700">Resident Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredName">Preferred Name</Label>
                <Input
                  id="preferredName"
                  type="text"
                  placeholder="What should ELI call them?"
                  value={formData.preferredName}
                  onChange={(e) => handleInputChange("preferredName", e.target.value)}
                  className={errors.preferredName ? "border-red-500" : ""}
                />
                {errors.preferredName && <p className="text-sm text-red-500 mt-1">{errors.preferredName}</p>}
              </div>

              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  type="text"
                  placeholder="e.g., Mother, Father, Spouse"
                  value={formData.relationship}
                  onChange={(e) => handleInputChange("relationship", e.target.value)}
                  className={errors.relationship ? "border-red-500" : ""}
                />
                {errors.relationship && <p className="text-sm text-red-500 mt-1">{errors.relationship}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={`pl-10 ${errors.dateOfBirth ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <Label htmlFor="primaryLanguage">Primary Language</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Select
                    value={formData.primaryLanguage}
                    onValueChange={(value) => handleInputChange("primaryLanguage", value)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end pt-6">
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
            Next
          </Button>
        </div>
      </motion.div>
    </SignupLayout>
  )
}
