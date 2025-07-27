"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  MessageCircle,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Heart,
} from "lucide-react"

interface DailySummary {
  date: string
  overallMood: string
  moodScore: number
  totalInteractions: number
  totalTalkTime: string
  keyHighlights: string[]
  concerns: string[]
  topTopics: string[]
  emotionalPattern: string
  recommendations: string[]
}

interface DailySummariesProps {
  summaries: DailySummary[]
}

export function DailySummaries({ summaries }: DailySummariesProps) {
  const getMoodColor = (score: number) => {
    if (score >= 7.5) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getMoodBadgeColor = (score: number) => {
    if (score >= 7.5) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getMoodEmoji = (score: number) => {
    if (score >= 8) return "😊"
    if (score >= 7) return "🙂"
    if (score >= 6) return "😐"
    if (score >= 5) return "😕"
    return "😔"
  }

  return (
    <div className="space-y-6">
      {summaries.map((summary, index) => (
        <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <CardTitle className="text-xl">{summary.date}</CardTitle>
                  <CardDescription>Daily well-being summary</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl">{getMoodEmoji(summary.moodScore)}</span>
                  <div>
                    <div className={`text-2xl font-bold ${getMoodColor(summary.moodScore)}`}>
                      {summary.moodScore}/10
                    </div>
                    <Badge className={getMoodBadgeColor(summary.moodScore)}>{summary.overallMood}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Activity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Interactions</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{summary.totalInteractions}</div>
                <div className="text-xs text-blue-700">conversations</div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Talk Time</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{summary.totalTalkTime}</div>
                <div className="text-xs text-green-700">total duration</div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Mood Score</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{summary.moodScore}/10</div>
                <Progress value={summary.moodScore * 10} className="h-2 mt-1" />
              </div>
            </div>

            {/* Emotional Pattern */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                Emotional Pattern
              </h4>
              <p className="text-sm text-gray-700">{summary.emotionalPattern}</p>
            </div>

            {/* Top Topics */}
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Most Discussed Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {summary.topTopics.map((topic, topicIndex) => (
                  <Badge key={topicIndex} variant="outline" className="bg-blue-50">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Highlights */}
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Key Highlights
                </h4>
                <ul className="space-y-2">
                  {summary.keyHighlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1 text-xs">✓</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concerns */}
              {summary.concerns.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Areas of Attention
                  </h4>
                  <ul className="space-y-2">
                    {summary.concerns.map((concern, concernIndex) => (
                      <li key={concernIndex} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-yellow-500 mt-1 text-xs">⚠</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                Care Recommendations
              </h4>
              <ul className="space-y-2">
                {summary.recommendations.map((recommendation, recIndex) => (
                  <li key={recIndex} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-amber-500 mt-1 text-xs">💡</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
