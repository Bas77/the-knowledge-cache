import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
  
const tabScreens = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'learn', title: 'Learn', icon: 'book' },
  { name: 'flashcard', title: 'Flashcards', icon: 'folder-open' },
  { name: 'profile', title: 'Profile', icon: 'person' },
];

export default function TabLayout() {
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
