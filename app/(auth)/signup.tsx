"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from "../../styles/auth.styles.js"
import { COLORS } from "@/constants/theme"
import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import Constants from "expo-constants"
import type { User } from "@supabase/supabase-js"
import { decode } from "base64-arraybuffer"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY
const supabaseProfilePicStorage = Constants.expoConfig?.extra?.SUPABASE_STORAGE_URL

const MIN_PASSWORD_LENGTH = 6

export default function SignUp({ navigation }: { navigation: any }) {
  const { user, setGlobalUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [username, setUsername] = useState("")
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [userLocal, setUser] = useState<User | null>(null)
  const [base64, setBase64] = useState<string | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  // Error states
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)

  // Validate password when it changes
  useEffect(() => {
    if (password && password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    } else {
      setPasswordError(null)
    }
  }, [password])

  // Validate confirm password when either password changes
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
    } else {
      setConfirmPasswordError(null)
    }
  }, [password, confirmPassword])

  const createUserProfile = async (userId: any, name: string, profilePictureUrl: string) => {
    const { data, error } = await supabase.from("users").insert([
      {
        id: userId,
        name: name,
        profile_picture: profilePictureUrl,
      },
    ])

    if (error) {
      console.error("Error creating user profile:", error)
    } else {
      console.log("User profile created:", data)
    }
  }

  const getUser = async () => {
    // Check if the user is logged in
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting user:", error)
      return
    }

    if (data?.user) {
      setUser(data.user)
    } else {
      Alert.alert("User not logged in.")
    }
  }

  const validateForm = (): boolean => {
    let isValid = true

    if (!email) {
      Alert.alert("Error", "Please enter your email")
      return false
    }

    if (!password) {
      Alert.alert("Error", "Please enter a password")
      return false
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
      isValid = false
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      isValid = false
    }

    return isValid
  }

  async function signUpWithEmail() {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) throw error

      if (session) {
        setGlobalUser(session.user)
        setModalVisible(true)
      } else {
        Alert.alert("Please check your email to verify your account")
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message)
      } else {
        Alert.alert("Error", "An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
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

  const handleProfileCreation = async () => {
    if (!username) {
      Alert.alert("Please provide a username")
      return
    }

    setModalLoading(true)
    try {
      const userid = user?.id

      if (!userid) {
        Alert.alert("Error", "User ID not found")
        return
      }

      let profilePictureUrl = null

      // Only upload image if one was selected
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

      await createUserProfile(userid, username, profilePictureUrl || "")
      router.replace("../(tabs)")
    } catch (error) {
      console.error("Error creating profile:", error)
      Alert.alert("Error", "Failed to create profile")
    } finally {
      setModalLoading(false)
      setModalVisible(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={32} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={styles.signUpTitle}>Sign Up</Text>

      <View style={styles.loginItems}>
        <Text style={styles.loginLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.loginLabel}>Password</Text>
        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        <Text style={styles.loginLabel}>Confirm Password</Text>
        <TextInput
          style={[styles.input, confirmPasswordError ? styles.inputError : null]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={signUpWithEmail}
        disabled={isLoading || !!passwordError || !!confirmPasswordError}
      >
        {isLoading ? <ActivityIndicator size="large" color="#000" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      {/* Navigate to Login Page */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.signUpText}>
          Already have an account? <Text style={styles.signUpLink}>Login</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>By continuing, you agree to our Terms and Privacy Policy</Text>

      {/* Profile Setup Modal - Updated to match profile edit modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Your Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLoginLabel}>Username</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter username"
              placeholderTextColor="#777"
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.modalLoginLabel}>Profile Picture</Text>
            <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.profileImage} />
              ) : (
                <View style={styles.pickImagePlaceholder}>
                  <Ionicons name="camera" size={30} color="#FFF" />
                  <Text style={styles.pickImageText}>Select Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={handleProfileCreation} disabled={modalLoading}>
              {modalLoading ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <Text style={styles.modalButtonText}>Save Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
