import { Tabs } from 'expo-router';
import { Home, Compass, FlaskConical } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#13131A',
          borderTopColor: '#2A2A3A',
        },
        tabBarActiveTintColor: '#FF6B2B',
        tabBarInactiveTintColor: '#60607A',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reconstitute"
        options={{
          title: 'Reconstitute',
          tabBarIcon: ({ color, size }) => <FlaskConical color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
