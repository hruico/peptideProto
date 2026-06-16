import '../global.css';

import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A0F' } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="peptide/[id]"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="protocol/[id]"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="account/index"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="account/my-protocols"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="account/stats"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="reconstitute/new-peptide"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="reconstitute/pre-mixed"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="reconstitute/add-blend"
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack>
  );
}
