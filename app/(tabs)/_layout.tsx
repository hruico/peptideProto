import { Tabs } from 'expo-router';
import { Compass, Syringe, Home } from 'lucide-react-native';
import { Colors } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(18,19,42,0.82)',
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 32,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 12,
          // Subtle white border so it reads as glass
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.10)',
        },
        tabBarActiveTintColor: Colors.primaryOrange,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="my-peptides"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Compass color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="reconstitute"
        options={{
          title: 'Reconstitute',
          tabBarIcon: ({ color }) => <Syringe color={color} size={22} />,
        }}
      />
      {/* Hide the redirect index tab from the tab bar */}
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
    </Tabs>
  );
}
