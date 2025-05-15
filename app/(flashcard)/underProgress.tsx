import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/theme"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

export default function FeatureNotAvailable() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="construct-outline" size={80} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Coming Soon!</Text>
          
          <Text style={styles.message}>
            This feature is currently under development. Please check back later!
          </Text>

          <View style={styles.divider} />

          <Text style={styles.subMessage}>
            We're working hard to bring you the best flashcard experience. Thank you for your patience.
          </Text>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.buttonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  backButton: {
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 193, 7, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 26,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 24,
  },
  subMessage: {
    fontSize: 16,
    color: "#AAA",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
})
