import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';
import { AuthProvider } from "@/contexts/AuthContext";
import { ActivityIndicator } from "react-native";
export default function RootLayout() {

  const [fontsLoaded] = useFonts({
      'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
      'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
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
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </AuthProvider>
      </SafeAreaProvider>
    );
}
