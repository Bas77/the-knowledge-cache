import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Alert, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

const tabScreens = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'learn', title: 'Learn', icon: 'book' },
  { name: 'flashcard', title: 'Flashcards', icon: 'albums' },
  { name: 'profile', title: 'Profile', icon: 'person' },
];

export default function TabLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const {user, setGlobalUser} = useAuth();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth change:', event);
      if (!session) {
        // Redirect to login if user signed out or not signed in
        router.replace('/(auth)/login');
      } else {
        setIsLoading(false); // Authenticated
      }
    });

    // Get initial session (just in case user is already logged in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/(auth)/login');
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
