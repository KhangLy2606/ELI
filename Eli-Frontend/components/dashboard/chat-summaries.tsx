"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface ChatSummary {
  id: number
  timestamp: string
  duration: string
  mood: string
  moodScore: number
  keyTopics: string[]
  summary: string
  emotionalHighlights: string[]
  concerns: string[]
}

interface ChatSummariesProps {
  summaries: ChatSummary[]
}

export function ChatSummaries({ summaries }: ChatSummariesProps) {
  const [expandedSummary, setExpandedSummary] = useState<number | null>(null)

  const getMoodColor = (score: number) => {
    if (score >= 7.5) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getMoodIcon = (score: number) => {
    if (score >= 7.5) return "😊"
    if (score >= 6) return "😐"
    return "😔"
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Conversation Summaries
        </CardTitle>
        <CardDescription>Detailed analysis of recent interactions with Eli</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summaries.map((summary) => (
            <div
              key={summary.id}
              className="border rounded-lg p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getMoodIcon(summary.moodScore)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{summary.timestamp}</span>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {summary.duration}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getMoodColor(summary.moodScore)}>
                        {summary.mood} ({summary.moodScore}/10)
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedSummary(expandedSummary === summary.id ? null : summary.id)}
                >
                  {expandedSummary === summary.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Key Topics */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {summary.keyTopics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Summary Preview */}
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{summary.summary}</p>

              {/* Expanded Content */}
              {expandedSummary === summary.id && (
                <div className="space-y-4 pt-3 border-t border-gray-200">
                  {/* Emotional Highlights */}
                  {summary.emotionalHighlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Emotional Highlights
                      </h4>
                      <ul className="space-y-1">
                        {summary.emotionalHighlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Concerns */}
                  {summary.concerns.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        Areas of Attention
                      </h4>
                      <ul className="space-y-1">
                        {summary.concerns.map((concern, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
