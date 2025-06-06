import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';
import { AuthProvider } from "@/contexts/AuthContext";
import { ActivityIndicator, Platform, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#000000');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);
  const [fontsLoaded] = useFonts({
      'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
      'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
      'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    });

    if (!fontsLoaded) {
      return (
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      );
    }
  
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </AuthProvider>
      </SafeAreaProvider>
    );
}
