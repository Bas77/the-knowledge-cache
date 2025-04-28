import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';
export default function RootLayout() {

  const [fontsLoaded] = useFonts({
      'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
      'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1, backgroundColor: '#000'}}>
      <Stack screenOptions={{headerShown:false}}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
