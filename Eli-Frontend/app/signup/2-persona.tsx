"use client"

import { useState } from "react"
import { useRouter } from "expo-router"
import { motion } from "framer-motion"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useSignupContext } from "@/context/signupContext"
import SignupLayout from "@/components/signup/signupLayout"

const hobbyOptions = [
  "Reading",
  "Gardening",
  "Cooking",
  "Music",
  "Art",
  "Crafts",
  "Walking",
  "Dancing",
  "Cards",
  "Puzzles",
  "Television",
  "Movies",
  "Sports",
  "Travel",
  "Photography",
  "Writing",
  "Knitting",
  "Fishing",
]

export default function PersonaStep() {
  const router = useRouter()
  const { formData, updateFormData } = useSignupContext()
  const [newPerson, setNewPerson] = useState("")

  const handleBack = () => {
    router.push("/signup/1-account")
  }

  const handleNext = () => {
    router.push("/signup/3-tone")
  }

  const handleHobbyChange = (hobby: string, checked: boolean) => {
    const updatedHobbies = checked ? [...formData.hobbies, hobby] : formData.hobbies.filter((h) => h !== hobby)
    updateFormData({ hobbies: updatedHobbies })
  }

  const addPerson = () => {
    if (newPerson.trim()) {
      updateFormData({ importantPeople: [...formData.importantPeople, newPerson.trim()] })
      setNewPerson("")
    }
  }

  const removePerson = (index: number) => {
    const updatedPeople = formData.importantPeople.filter((_, i) => i !== index)
    updateFormData({ importantPeople: updatedPeople })
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
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Tell Us About Them</h2>
          <p className="text-slate-500">
            Help ELI get to know them. The more details you provide, the more personal the conversations will be.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Life Story */}
          <div>
            <Label htmlFor="lifeStory">Life Story & Key Memories</Label>
            <Textarea
              id="lifeStory"
              placeholder="Share their background, career, family, memorable experiences, or anything that shaped who they are..."
              value={formData.lifeStory}
              onChange={(e) => updateFormData({ lifeStory: e.target.value })}
              className="min-h-32 resize-none"
            />
            <p className="text-sm text-slate-500 mt-1">
              This helps ELI have meaningful conversations about their past and interests.
            </p>
          </div>

          {/* Hobbies & Interests */}
          <div>
            <Label>Hobbies & Interests</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {hobbyOptions.map((hobby) => (
                <div key={hobby} className="flex items-center space-x-2">
                  <Checkbox
                    id={hobby}
                    checked={formData.hobbies.includes(hobby)}
                    onCheckedChange={(checked) => handleHobbyChange(hobby, checked as boolean)}
                  />
                  <Label htmlFor={hobby} className="text-sm font-normal cursor-pointer">
                    {hobby}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Important People */}
          <div>
            <Label>Important People</Label>
            <p className="text-sm text-slate-500 mb-3">
              Family members, friends, or anyone significant in their life that ELI might reference in conversations.
            </p>

            {/* Add Person Input */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter a person's name and relationship (e.g., 'Sarah - Daughter')"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addPerson()}
              />
              <Button onClick={addPerson} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* People List */}
            {formData.importantPeople.length > 0 && (
              <div className="space-y-2">
                {formData.importantPeople.map((person, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <span className="text-sm">{person}</span>
                    <Button
                      onClick={() => removePerson(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
