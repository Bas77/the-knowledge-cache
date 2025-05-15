import { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../../constants/theme"
import { useRouter } from "expo-router"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { decode } from "base64-arraybuffer"
import * as ImagePicker from "expo-image-picker"

const ProfilePage = () => {
  const router = useRouter()
  const { user, setGlobalUser } = useAuth()
  const [isModalVisible, setModalVisible] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState("")
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [base64, setBase64] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  // Get screen dimensions for better layout calculations
  const screenHeight = Dimensions.get("window").height

  // Calculate bottom padding based on screen size and platform
  const bottomPadding = Platform.OS === "ios" ? 120 : 100

  // Track if we're on web platform
  const isWeb = Platform.OS === "web"

  type Profile = {
    name: string
    profile_picture: string | null
    created_at: string
    formatted_date?: string
  }

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached, forcing state update")
        setIsLoading(false)
        setLoadingError("Loading timed out. Please try refreshing the page.")
      }
    }, 10000) // 10 second timeout

    getProfile()

    return () => clearTimeout(loadingTimeout)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
  }

  // Helper function to extract just the filename from a URL or path
  const extractFilename = (path: string): string => {
    // Check if it's a full URL
    if (path.startsWith("http")) {
      // Extract just the filename part before any query parameters
      const urlParts = path.split("/")
      const filenameWithParams = urlParts[urlParts.length - 1]
      // Remove query parameters if present
      return filenameWithParams.split("?")[0]
    }

    // If it's already just a filename or path without http
    if (path.includes("?")) {
      // Remove query parameters if present
      return path.split("?")[0]
    }

    return path
  }

  const getProfile = async () => {
    console.log("Fetching profile data...")
    setIsLoading(true)
    setLoadingError(null)

    try {
      // Check if user is available
      if (!user?.id) {
        console.log("No user ID available")
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("users")
        .select("name, profile_picture, created_at")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      if (!data) {
        console.log("No profile data found")
        setIsLoading(false)
        return
      }

      console.log("Profile data received:", data.name)

      // Set initial profile data without waiting for image
      const profileData: Profile = {
        name: data.name || "User",
        profile_picture: null,
        created_at: data.created_at,
        formatted_date: formatDate(data.created_at),
      }

      setProfile(profileData)

      // Process profile picture if available
      if (data.profile_picture) {
        console.log("Profile picture path:", data.profile_picture)

        // If the profile_picture is already a full URL, use it directly
        if (data.profile_picture.startsWith("http")) {
          setProfile((prev) => (prev ? { ...prev, profile_picture: data.profile_picture } : null))
          setImageLoading(false)
        } else {
          // Otherwise, get the URL from Supabase storage
          try {
            setImageLoading(true)
            // Extract just the filename without any tokens or query parameters
            const cleanFilename = extractFilename(data.profile_picture)
            console.log("Clean filename:", cleanFilename)

            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from("profile-pictures")
              .createSignedUrl(cleanFilename, 3600)

            if (signedUrlError) {
              console.error("Error creating signed URL:", signedUrlError)
              setImageLoading(false)
              return
            }

            if (signedUrlData?.signedUrl) {
              console.log("Profile picture URL obtained")
              setProfile((prev) => (prev ? { ...prev, profile_picture: signedUrlData.signedUrl } : null))
            }
          } catch (imgError) {
            console.error("Error loading profile picture:", imgError)
          } finally {
            setImageLoading(false)
          }
        }
      } else {
        setImageLoading(false)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setLoadingError("Failed to load profile data. Please try again.")
    } finally {
      console.log("Setting loading state to false")
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // 1. Sign out from Supabase
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      // 2. Clear local user state
      setGlobalUser(null)

      // 3. Navigate to login screen
      router.replace("/(auth)/login")
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Logout Failed", error.message)
        console.error("Logout error:", error.message)
        router.replace('/(auth)/login')
      } else {
        Alert.alert("Logout Failed", "An unknown error occurred")
        console.error("Unknown logout error:", error)
      }
    }
  }

  const pickImage = async () => {
    if (profile) setUsername(profile?.name || "")

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7, // Reduced quality for faster upload
        aspect: [1, 1],
        allowsEditing: true,
        base64: true,
      })

      if (!result.canceled && result.assets[0].base64) {
        setProfilePicture(result.assets[0].uri)
        setBase64(result.assets[0].base64)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image")
    }
  }

  const handleProfileEdit = async () => {
    try {
      setIsLoading(true)
      const userid = user?.id

      if (!userid) {
        Alert.alert("Error", "User ID not found")
        setIsLoading(false)
        return
      }

      // Validate inputs
      if (!username) {
        Alert.alert("Please provide a username")
        setIsLoading(false)
        return
      }

      let profilePictureUrl = profile?.profile_picture

      // Only upload new image if one was selected
      if (base64) {
        // Create a clean filename without any tokens or query parameters
        const filename = `profile-${userid}.jpg`

        const imageResponse = await supabase.storage.from("profile-pictures").upload(filename, decode(base64), {
          contentType: "image/jpg",
          upsert: true,
        })

        if (imageResponse.error) {
          throw imageResponse.error
        }

        // Store just the filename in the database
        profilePictureUrl = filename
      }

      // Update user profile
      const { error } = await supabase.from("users").upsert({
        id: userid,
        profile_picture: profilePictureUrl,
        name: username,
      })

      if (error) throw error

      // Refresh profile data
      await getProfile()
      setModalVisible(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      Alert.alert("Error", "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  // Manual refresh function
  const handleRefresh = () => {
    getProfile()
  }

  // Skeleton loading component for profile header
  const ProfileHeaderSkeleton = () => (
    <View style={styles.profileHeader}>
      <View style={[styles.avatarSkeleton, styles.skeletonAnimation]} />
      <View style={[styles.nameSkeleton, styles.skeletonAnimation]} />
      <View style={[styles.emailSkeleton, styles.skeletonAnimation]} />
      <View style={[styles.joinedSkeleton, styles.skeletonAnimation]} />
    </View>
  )

  // Skeleton loading component for action cards
  const ActionCardsSkeleton = () => (
    <View style={styles.actionsContainer}>
      <View style={[styles.actionCardSkeleton, styles.skeletonAnimation]} />
      <View style={[styles.actionCardSkeleton, styles.skeletonAnimation]} />
    </View>
  )

  // Error component
  const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={50} color="#FF5C5C" />
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        <View style={styles.container}>
          <ProfileHeaderSkeleton />
          <ActionCardsSkeleton />
        </View>
      ) : loadingError ? (
        <View style={styles.container}>
          <ErrorDisplay message={loadingError} onRetry={handleRefresh} />
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          showsVerticalScrollIndicator={true}
          alwaysBounceVertical={true}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {imageLoading ? (
                <View style={styles.avatarSkeleton}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              ) : profile?.profile_picture ? (
                <Image
                  source={{ uri: profile.profile_picture }}
                  style={styles.avatar}
                  defaultSource={require("@/assets/images/icon.png")}
                />
              ) : (
                <Image source={require("@/assets/images/icon.png")} style={styles.avatar} />
              )}
            </View>
            <Text style={styles.name}>{profile?.name || "User"}</Text>
            <Text style={styles.email}>{user?.email || "No email available"}</Text>
            <Text style={styles.joined}>Joined {profile?.formatted_date || "Recently"}</Text>
          </View>

          {/* Profile Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                setModalVisible(true)
                if (profile?.name) setUsername(profile.name)
              }}
            >
              <Ionicons name="create-outline" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleRefresh}>
              <Ionicons name="refresh-outline" size={24} color={COLORS.primary} />
              <Text style={styles.actionText}>Refresh Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { borderColor: "#FF5C5C" }]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FF5C5C" />
              <Text style={[styles.actionText, { color: "#FF5C5C" }]}>Log Out</Text>
            </TouchableOpacity>
          </View>

          {/* App Info / Placeholder */}
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>The Knowledge Cache</Text>
            <Text style={styles.infoText}>Version 1.0.0</Text>
            <Text style={styles.infoText}>Developed by Group 1</Text>
            <Text style={styles.infoText}>Archi Setio - Scrum Master</Text>
            <Text style={styles.infoText}>Dominikus Sebastian Ramli - Lead Developer</Text>
            <Text style={styles.infoText}>I Made Ananda Ryan Viryavan - Product Owner</Text>
            <Text style={styles.infoText}>Vincent Virgo - Design Team</Text>
            <Text style={styles.infoText}>Vincent Tanaka - Design Team</Text>
          </View>

          {/* Extra padding view to ensure scrollability */}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Edit Profile Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.loginLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder={profile?.name || "Enter username"}
              placeholderTextColor="#777"
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.loginLabel}>Profile Picture</Text>
            <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.EditprofileImage} />
              ) : profile?.profile_picture ? (
                <Image source={{ uri: profile.profile_picture }} style={styles.EditprofileImage} />
              ) : (
                <View style={styles.pickImagePlaceholder}>
                  <Ionicons name="camera" size={30} color="#FFF" />
                  <Text style={styles.pickImageText}>Select Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleProfileEdit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Save Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  name: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "600",
  },
  email: {
    color: "#AAA",
    fontSize: 14,
    marginTop: 4,
  },
  joined: {
    color: "#555",
    fontSize: 12,
    marginTop: 4,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 12,
    color: "#FFF",
    fontSize: 16,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    color: "#AAA",
    fontSize: 14,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  closeButton: {
    padding: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#2A2A2A",
    color: "#FFF",
  },
  loginLabel: {
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: 8,
  },
  pickImageButton: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  EditprofileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  pickImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  pickImageText: {
    color: "#FFF",
    marginTop: 5,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  // Skeleton loading styles
  skeletonAnimation: {
    opacity: 0.7,
  },
  avatarSkeleton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#333",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nameSkeleton: {
    width: 150,
    height: 22,
    backgroundColor: "#333",
    borderRadius: 4,
    marginBottom: 8,
  },
  emailSkeleton: {
    width: 200,
    height: 14,
    backgroundColor: "#333",
    borderRadius: 4,
    marginBottom: 8,
  },
  joinedSkeleton: {
    width: 120,
    height: 12,
    backgroundColor: "#333",
    borderRadius: 4,
  },
  actionCardSkeleton: {
    height: 56,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    marginBottom: 12,
  },
  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "600",
  },
})

export default ProfilePage
