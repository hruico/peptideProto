import { Tabs } from 'expo-router';
import { Home, Compass, Syringe } from 'lucide-react-native';
import { Colors } from '../../constants/theme';
import { View, StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(26,27,58,0.95)',
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
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarActiveTintColor: Colors.accentOrange,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="reconstitute"
        options={{
          title: 'Reconstitute',
          tabBarIcon: ({ color, size }) => <Syringe color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
