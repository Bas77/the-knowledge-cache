import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/theme"
import { useRouter } from "expo-router"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { useIsFocused } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const HomePage = () => {
  const { user } = useAuth()
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sets, setSets] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const isFocused = useIsFocused()
  const insets = useSafeAreaInsets()

  // Calculate bottom padding to ensure content is visible above tab bar
  const bottomPadding = Platform.OS === "android" ? 80 : insets.bottom + 60

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isFocused) {
      fetchName()
      fetchSets()
    }
  }, [isFocused])

  const fetchName = async () => {
    try {
      setIsLoading(true)
      const { data: repos, error } = await supabase.from("users").select("name").eq("id", user?.id)
      if (repos) {
        setUsername(repos[0].name)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSets = async () => {
    try {
      const { data: userRepos, error: repoError } = await supabase
        .from("user_repository")
        .select("set_id, last_accessed, sets (title)")
        .eq("user_id", user?.id)
        .order("last_accessed", { ascending: false })
        .limit(2)
      if (repoError) throw repoError
      if (!userRepos?.length) {
        setSets([])
        return
      }
      setSets(userRepos)
    } catch (error) {
      throw error
    }
  }

  const getDayName = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[new Date().getDay()]
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const seconds = Math.floor((currentTime.getTime() - date.getTime()) / 1000)

    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"} ago`

    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"} ago`

    interval = Math.floor(seconds / 86400)
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`

    interval = Math.floor(seconds / 3600)
    if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"} ago`

    interval = Math.floor(seconds / 60)
    if (interval >= 1) return `${interval} minute${interval === 1 ? "" : "s"} ago`

    return `${Math.floor(seconds)} second${seconds === 1 ? "" : "s"} ago`
  }

  const router = useRouter()
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, {username}!</Text>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={24} color={COLORS.primary} />
            <Text style={styles.streakText}>0 day streak</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(flashcard)/createSet")}>
            <Ionicons name="add-circle" size={32} color={COLORS.primary} />
            <Text style={styles.actionText}>New Set</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push("/(tabs)/learn")}>
            <Ionicons name="book" size={32} color={COLORS.primary} />
            <Text style={styles.actionText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Sets */}
        <Text style={styles.sectionTitle}>Recent Sets</Text>
        {sets.length > 0 ? (
          sets.map((set) => (
            <TouchableOpacity key={set.set_id} style={styles.setCard} onPress={() => router.push("/(tabs)/flashcard")}>
              <View style={styles.setInfo}>
                <Text style={styles.setTitle}>{set.sets.title}</Text>
                <Text style={styles.lastAccessed}>Last accessed: {formatTimeAgo(set.last_accessed)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#FFF" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="albums-outline" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Recent Sets</Text>
            <Text style={styles.emptyDescription}>
              You haven't studied any flashcard sets recently. Create a new set or explore existing ones to get started.
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/(flashcard)/createSet")}>
              <Text style={styles.emptyButtonText}>Create Your First Set</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.emptyButton, styles.secondaryButton]}
                onPress={() => router.push("/(flashcard)/search")}
              >
                <Text style={styles.secondaryButtonText}>Search Public Sets</Text>
              </TouchableOpacity>
          </View>
        )}

        {/* Study Recommendations */}
        <Text style={styles.sectionTitle}>Study Recommendations</Text>
        <View style={styles.recommendationsContainer}>
          <TouchableOpacity style={styles.recommendationCard} onPress={() => router.push("/(tabs)/flashcard")}>
            <View style={styles.recommendationIconContainer}>
              <Ionicons name="time-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Due for Review</Text>
              <Text style={styles.recommendationDescription}>5 cards need your attention today</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAA" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.recommendationCard} onPress={() => router.push("/(tabs)/flashcard")}>
            <View style={styles.recommendationIconContainer}>
              <Ionicons name="alert-circle-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Difficult Cards</Text>
              <Text style={styles.recommendationDescription}>Practice cards you've struggled with</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAA" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.recommendationCard} onPress={() => router.push("/(tabs)/flashcard")}>
            <View style={styles.recommendationIconContainer}>
              <Ionicons name="bulb-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Suggested Set</Text>
              <Text style={styles.recommendationDescription}>"Data Analytics" - New content available</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#AAA" />
          </TouchableOpacity>
        </View>

        {/* Study Modes */}
        <Text style={styles.sectionTitle}>Study Modes</Text>
        <View style={styles.studyModesContainer}>
          <TouchableOpacity style={styles.studyModeCard} onPress={() => router.push("/(tabs)/flashcard")}>
            <View style={[styles.studyModeIcon, { backgroundColor: "rgba(255, 193, 7, 0.15)" }]}>
              <Ionicons name="card-outline" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.studyModeTitle}>Flashcards</Text>
            <Text style={styles.studyModeDescription}>Classic card-based review</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.studyModeCard} onPress={() => router.push("/(flashcard)/underProgress")}>
            <View style={[styles.studyModeIcon, { backgroundColor: "rgba(76, 175, 80, 0.15)" }]}>
              <Ionicons name="help-circle-outline" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.studyModeTitle}>Quiz Mode</Text>
            <Text style={styles.studyModeDescription}>Test your knowledge</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.studyModeCard} onPress={() => router.push("/(flashcard)/underProgress")}>
            <View style={[styles.studyModeIcon, { backgroundColor: "rgba(33, 150, 243, 0.15)" }]}>
              <Ionicons name="grid-outline" size={24} color="#2196F3" />
            </View>
            <Text style={styles.studyModeTitle}>Match Game</Text>
            <Text style={styles.studyModeDescription}>Pair questions with answers</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Tip */}
        <Text style={styles.sectionTitle}>Daily Learning Tip</Text>
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={24} color={COLORS.primary} />
            <Text style={styles.tipDay}>{getDayName()} Tip</Text>
          </View>
          <Text style={styles.tipContent}>
            Use the "spaced repetition" technique: review cards at increasing intervals to improve long-term retention.
            Start with daily reviews, then gradually extend to weekly and monthly.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakText: {
    color: COLORS.primary,
    fontSize: 16,
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 15,
    width: "48%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "#FFF",
    marginTop: 10,
    fontSize: 16,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  setCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  setInfo: {
    flex: 1,
  },
  setTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  lastAccessed: {
    color: "#AAA",
    fontSize: 14,
  },
  emptyContainer: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 24,
    marginBottom: 30,
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 193, 7, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyDescription: {
    color: "#AAA",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
  recommendationsContainer: {
    marginBottom: 30,
  },
  recommendationCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  recommendationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 193, 7, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  recommendationDescription: {
    color: "#AAA",
    fontSize: 14,
  },
  studyModesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 30,
  },
  studyModeCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    width: "31%",
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  studyModeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  studyModeTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    textAlign: "center",
  },
  studyModeDescription: {
    color: "#AAA",
    fontSize: 12,
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 16,
    marginBottom: 30,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipDay: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  tipContent: {
    color: "#FFF",
    fontSize: 14,
    lineHeight: 22,
  },
  primaryButton:
  {
    backgroundColor: COLORS.primary, marginRight: 8,
  },
  secondaryButton:
  {
    backgroundColor: "transparent", borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 15,
    marginLeft: 8,
  },
  secondaryButtonText:
  {
    color: COLORS.primary, fontWeight: "600",
    fontSize: 14,
  }
  
})

export default HomePage
