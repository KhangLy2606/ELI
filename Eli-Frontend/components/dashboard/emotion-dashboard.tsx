"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Brain,
  MessageCircle,
  TrendingUp,
  Calendar,
  Clock,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react"
import { EmotionChart } from "./emotion-chart"
import { MoodTrendChart } from "./mood-trend-chart"
import { InteractionChart } from "./interaction-chart"
import { ChatSummaries } from "./chat-summaries"
import { DailySummaries } from "./daily-summaries"

// Dummy data
const currentUser = {
  name: "Eleanor Thompson",
  age: 78,
  avatar: "/placeholder.svg?height=40&width=40&text=ET",
  lastInteraction: "2 hours ago",
  overallMood: "Positive",
  moodScore: 7.2,
}

const emotionData = [
  { emotion: "Joy", value: 65, color: "bg-yellow-400", change: "+5%" },
  { emotion: "Calm", value: 78, color: "bg-blue-400", change: "+2%" },
  { emotion: "Sadness", value: 15, color: "bg-gray-400", change: "-8%" },
  { emotion: "Anxiety", value: 22, color: "bg-red-400", change: "-12%" },
  { emotion: "Engagement", value: 82, color: "bg-green-400", change: "+15%" },
  { emotion: "Energy", value: 58, color: "bg-orange-400", change: "+3%" },
]

const recentInteractions = [
  {
    time: "2:30 PM",
    duration: "12 min",
    mood: "Happy",
    topics: ["Family", "Garden", "Music"],
    moodIcon: Smile,
    moodColor: "text-green-500",
  },
  {
    time: "11:45 AM",
    duration: "8 min",
    mood: "Neutral",
    topics: ["Weather", "News"],
    moodIcon: Meh,
    moodColor: "text-yellow-500",
  },
  {
    time: "9:15 AM",
    duration: "15 min",
    mood: "Concerned",
    topics: ["Health", "Medication"],
    moodIcon: Frown,
    moodColor: "text-orange-500",
  },
]

const alerts = [
  {
    type: "positive",
    message: "Eleanor showed increased engagement during today's conversations",
    time: "1 hour ago",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    type: "attention",
    message: "Slight decrease in energy levels compared to last week",
    time: "3 hours ago",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
]

const chatSummaries = [
  {
    id: 1,
    timestamp: "Today, 2:30 PM",
    duration: "12 minutes",
    mood: "Happy",
    moodScore: 8.2,
    keyTopics: ["Family visit", "Garden flowers", "Classical music"],
    summary:
      "Eleanor was particularly animated discussing her daughter's visit yesterday. She mentioned how much she enjoyed the roses her daughter brought and spent time talking about her favorite classical pieces they listened to together.",
    emotionalHighlights: [
      "Expressed joy about family connection",
      "Showed enthusiasm for gardening",
      "Demonstrated good memory recall",
    ],
    concerns: [],
  },
  {
    id: 2,
    timestamp: "Today, 11:45 AM",
    duration: "8 minutes",
    mood: "Neutral",
    moodScore: 6.1,
    keyTopics: ["Weather", "Breakfast", "Daily routine"],
    summary:
      "Brief conversation about the morning routine. Eleanor mentioned feeling a bit tired but was responsive to questions about her breakfast and the weather outside.",
    emotionalHighlights: ["Maintained normal conversation flow"],
    concerns: ["Mentioned feeling tired", "Shorter interaction than usual"],
  },
  {
    id: 3,
    timestamp: "Yesterday, 4:15 PM",
    duration: "18 minutes",
    mood: "Reflective",
    moodScore: 7.5,
    keyTopics: ["Childhood memories", "Hometown", "Old friends"],
    summary:
      "Extended conversation about Eleanor's childhood in rural Ontario. She shared detailed memories about her school friends and the small town where she grew up. Showed excellent long-term memory recall.",
    emotionalHighlights: ["Rich storytelling", "Positive reminiscence", "Strong emotional connection to memories"],
    concerns: [],
  },
]

const dailySummaries = [
  {
    date: "Today, January 27",
    overallMood: "Positive",
    moodScore: 7.4,
    totalInteractions: 3,
    totalTalkTime: "32 minutes",
    keyHighlights: [
      "Showed increased engagement when discussing family",
      "Demonstrated good memory recall for recent events",
      "Expressed interest in garden activities",
    ],
    concerns: ["Mentioned feeling tired in morning conversation", "Slightly shorter interaction duration overall"],
    topTopics: ["Family", "Garden", "Music", "Daily routine"],
    emotionalPattern: "Started neutral, improved throughout the day",
    recommendations: [
      "Continue encouraging family-related conversations",
      "Consider scheduling garden activities",
      "Monitor energy levels in morning interactions",
    ],
  },
  {
    date: "Yesterday, January 26",
    overallMood: "Very Positive",
    moodScore: 8.1,
    totalInteractions: 4,
    totalTalkTime: "45 minutes",
    keyHighlights: [
      "Longest conversation duration this week",
      "Shared detailed childhood memories",
      "Showed enthusiasm for upcoming activities",
    ],
    concerns: [],
    topTopics: ["Childhood memories", "Family", "Activities", "Friends"],
    emotionalPattern: "Consistently positive throughout the day",
    recommendations: ["Encourage more storytelling sessions", "Plan similar memory-sharing activities"],
  },
  {
    date: "January 25",
    overallMood: "Mixed",
    moodScore: 6.2,
    totalInteractions: 2,
    totalTalkTime: "18 minutes",
    keyHighlights: ["Engaged well in afternoon conversation", "Showed interest in current events"],
    concerns: ["Seemed withdrawn in morning", "Shorter total interaction time", "Expressed some anxiety about health"],
    topTopics: ["Health", "News", "Weather"],
    emotionalPattern: "Started low, improved slightly in afternoon",
    recommendations: [
      "Schedule health check-in with care team",
      "Provide reassurance about health concerns",
      "Consider morning mood-boosting activities",
    ],
  },
]

export function EmotionDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today")

  const getMoodIcon = (score: number) => {
    if (score >= 7) return <Smile className="h-5 w-5 text-green-500" />
    if (score >= 4) return <Meh className="h-5 w-5 text-yellow-500" />
    return <Frown className="h-5 w-5 text-red-500" />
  }

  const getMoodColor = (score: number) => {
    if (score >= 7) return "text-green-500"
    if (score >= 4) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Emotion Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Eli Companion System - Well-being Insights</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/50">
              <Activity className="h-3 w-3 mr-1" />
              Live Monitoring
            </Badge>
            <Button variant="outline" className="bg-white/50">
              <Calendar className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* User Overview Card */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{currentUser.name}</h2>
                  <p className="text-gray-600">
                    Age {currentUser.age} • Last interaction: {currentUser.lastInteraction}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  {getMoodIcon(currentUser.moodScore)}
                  <span className="text-lg font-semibold">Overall Mood</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getMoodColor(currentUser.moodScore)}`}>
                    {currentUser.moodScore}/10
                  </span>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">{currentUser.overallMood}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="chat-summaries">Chat Summaries</TabsTrigger>
            <TabsTrigger value="daily-summaries">Daily Summaries</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Emotion Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emotionData.map((emotion) => (
                <Card key={emotion.emotion} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{emotion.emotion}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`${emotion.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                      >
                        {emotion.change}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{emotion.value}%</span>
                        <div className={`w-3 h-3 rounded-full ${emotion.color}`} />
                      </div>
                      <Progress value={emotion.value} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Emotion Distribution
                  </CardTitle>
                  <CardDescription>Current emotional state breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmotionChart />
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Daily Mood Pattern
                  </CardTitle>
                  <CardDescription>Mood variations throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <MoodTrendChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Weekly Emotional Trends
                </CardTitle>
                <CardDescription>Emotional patterns over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <InteractionChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  Recent Interactions
                </CardTitle>
                <CardDescription>Latest conversations with Eli</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInteractions.map((interaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50"
                    >
                      <div className="flex items-center gap-4">
                        <interaction.moodIcon className={`h-6 w-6 ${interaction.moodColor}`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{interaction.time}</span>
                            <Badge variant="outline">{interaction.duration}</Badge>
                          </div>
                          <div className="flex gap-1">
                            {interaction.topics.map((topic) => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={`${interaction.moodColor.replace("text-", "bg-").replace("-500", "-100")} ${interaction.moodColor}`}
                      >
                        {interaction.mood}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat-summaries" className="space-y-6">
            <ChatSummaries summaries={chatSummaries} />
          </TabsContent>

          <TabsContent value="daily-summaries" className="space-y-6">
            <DailySummaries summaries={dailySummaries} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Well-being Alerts
                </CardTitle>
                <CardDescription>Important insights and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50"
                    >
                      <alert.icon className={`h-5 w-5 mt-0.5 ${alert.color}`} />
                      <div className="flex-1">
                        <p className="font-medium">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-500">{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
