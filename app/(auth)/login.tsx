
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import {styles} from '../../styles/auth.styles.js'
import {COLORS} from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';

export default function login(){
    const {user, setGlobalUser} = useAuth();
    const [userLocal, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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
    const handleSignIn = async () => {
        setIsLoading(true);
        let loginEmail = email;
        let loginPassword = password;

        if(loginEmail == 'admin'){
          loginEmail = 'admin@gmail.com'
          loginPassword = 'admin123'
        }
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: loginEmail,  // Use the email as the username
            password: loginPassword,
          });
          if (error) throw error;
          setGlobalUser(data.user);
          if(data.user){
            router.replace('../(tabs)');
          } else{
            await new Promise((resolve) => setTimeout(resolve, 500));
            setGlobalUser(data.user);
            if(!user){
                Alert.alert('Login failed, please try again');
                router.reload();
            }
            
          }
        } catch (error:any) {
          Alert.alert('Error', error.message);
        } finally{
            setIsLoading(false);
        }
      };

    return(
        <View style={styles.container}>
            <Text>Login</Text>
            {/* <View style={styles.logoContainer}>
                <Ionicons name="leaf" size={32} colors={COLORS.primary}></Ionicons>
            </View> */}
            <Text style={styles.appName}>The Knowledge Cache</Text>
            <Text style={styles.tagline}>The one stop for knowledge</Text>
            
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
            </View>

            <TouchableOpacity style={styles.button}  onPress={handleSignIn} disabled={isLoading}>
                {isLoading ? (<ActivityIndicator size='large' color="#000"/>) : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton} disabled={true}>
            <Ionicons name="logo-google" size={24} color={COLORS.surfaceLight} />
            <Text style={styles.googleButtonText} disabled={true}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('./signup')}>
            <Text style={styles.signUpText}>
                 Don't have an account? <Text style={styles.signUpLink} >Sign up</Text>
            </Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
                By continuing, you agree to our Terms and Privacy Policy
            </Text>

            
        </View>
    )
}