import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/auth.styles.js';
import { COLORS } from '@/constants/theme';
import { router, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function SignUp({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setLoading] = useState(false)

  
  async function signUpWithEmail() {
      setLoading(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (error) Alert.alert(error.message)
      const user = supabase.auth.getUser()
      const userID = user
      setLoading(false)
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
    </View>
  );
}
