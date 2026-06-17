import { Tabs } from 'expo-router';
import { Compass, Syringe, FlaskConical, Pill } from 'lucide-react-native';
import { Colors } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8E0DB',
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
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarActiveTintColor: Colors.primaryOrange,
        tabBarInactiveTintColor: 'rgba(0,0,0,0.3)',
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
          title: 'My Peptides',
          tabBarIcon: ({ color }) => <Pill color={color} size={22} />,
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
          tabBarIcon: ({ color }) => <FlaskConical color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
