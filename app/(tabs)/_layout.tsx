import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
  
const tabScreens = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'learn', title: 'Learn', icon: 'book' },
  { name: 'flashcard', title: 'Flashcards', icon: 'folder-open' },
  { name: 'profile', title: 'Profile', icon: 'person' },
];

export default function TabLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log(session);
      if (error || !session) {
        // If no session, navigate to login page
        router.replace('/(auth)/login');  // Adjust the route as per your folder structure
      } else {
        // If session exists, proceed with the rest of the app
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          position: 'absolute',
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 10,
          fontFamily: 'Poppins-SemiBold',
        },
      }}
    >
      {tabScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Ionicons name={screen.icon as any} size={size + 5} color={color} />
            ),
            title: screen.title,
          }}
        />
      ))}
    </Tabs>
  );
}
