import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/auth.styles.js';
import { COLORS } from '@/constants/theme';
import { router, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { createClient, User } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import { useAuth } from '@/contexts/AuthContext';

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;
const supabaseProfilePicStorage = Constants.expoConfig?.extra?.SUPABASE_STORAGE_URL;

export default function SignUp({ navigation }: { navigation: any }) {
  const {user, setGlobalUser} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userLocal, setUser] = useState<User | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const createUserProfile = async (userId: any, name: string, profilePictureUrl: string) => {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          name: name,
          profile_picture: profilePictureUrl,
        }
      ]);

    if (error) {
      console.error('Error creating user profile:', error);
    } else {
      console.log('User profile created:', data);
    }
  };

  const getUser = async () => {
    // Check if the user is logged in
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error getting user:", error);
      return;
    }

    if (data?.user) {
      setUser(data.user);
    } else {
      Alert.alert("User not logged in.");
    }
  };

  async function signUpWithEmail() {
      setLoading(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      // await new Promise((resolve) => setTimeout(resolve, 500));
      if (error) Alert.alert(error.message)
      if (session) {
        setGlobalUser(session.user);
        setModalVisible(true);
      } else {
        Alert.alert('Sign up failed')
      }
    
      console.log(user);
      setModalVisible(true);
      setLoading(false)
  }
      
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      aspect:[4,3],
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setProfilePicture(result.assets[0].uri);
        console.log('raw base64: ' + result.assets[0].base64);
        setBase64(result.assets[0].base64);
        console.log('base64: '+base64);
      }
  };
  
  const handleProfileCreation = async () => {
    if (!username || !profilePicture) {
      Alert.alert("Please provide a username and a profile picture.");
      return;
    }

    const userid = user?.id
    // Upload the image to Supabase Storage if you want to store the image URL
    if (!username || !profilePicture || !base64) {
      Alert.alert("Please provide a username, a profile picture, and base64 data.");
      return;
    }
    // console.log('base64 after click: ' + base64);
    const imageResponse = await supabase.storage
      .from('profile-pictures')
      .upload(`profile-${userid}.jpg`, decode(base64), {
        contentType: 'image/jpg',
        upsert: true
      });
    
    const profilePictureUrl = imageResponse?.data?.path
      ? `${imageResponse.data.path}`
      : profilePicture; // use the URL from storage if the image was uploaded successfully
    await createUserProfile(userid, username, profilePictureUrl);
    console.log('test');
    // getUser();
    // setGlobalUser(userLocal);
    router.replace('../(tabs)');
    setModalVisible(false);
  };

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
        />

        <Text style={styles.loginLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.loginLabel}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={signUpWithEmail}>
        {isLoading ? (<ActivityIndicator size='large' color="#000"/>):<Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      {/* Navigate to Login Page */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.signUpText}>
          Already have an account? <Text style={styles.signUpLink}>Login</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By continuing, you agree to our Terms and Privacy Policy
      </Text>

      {/* Profile Setup Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Complete Your Profile</Text>

          <Text style={styles.loginLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.loginLabel}>Profile Picture</Text>
          <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.profileImage} />
            ) : (
              <Text style={styles.pickImageText}>Pick an image</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleProfileCreation}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
