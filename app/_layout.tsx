import '../global.css';

import { useFonts } from 'expo-font';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { useAuthStore } from '../store/useAuthStore';
import { useServerSync } from '../lib/useServerSync';

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
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const hasCompletedOnboarding = useOnboardingStore((s) => s.hasCompletedOnboarding);
  const { token: authToken, userId, handleOAuthRedirect } = useAuthStore();

  // Handle OAuth deep-link: exp://localhost?token=...&userId=...
  const params = useLocalSearchParams<{ token?: string; userId?: string }>();
  useEffect(() => {
    if (params.token && params.userId) {
      handleOAuthRedirect(params.token, params.userId);
    }
  }, [params.token, params.userId]);

  // Sync all stores from server once token is available
  useServerSync();

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      router.replace('/onboarding/splash');
    }
  }, [hasCompletedOnboarding]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#12132A' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="peptide/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="protocol/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="account/account" options={{ presentation: 'modal' }} />
        <Stack.Screen name="account/my-protocols" options={{ presentation: 'modal' }} />
        <Stack.Screen name="account/stats" options={{ presentation: 'modal' }} />
        <Stack.Screen name="reconstitute/new-peptide" options={{ presentation: 'modal' }} />
        <Stack.Screen name="reconstitute/pre-mixed" options={{ presentation: 'modal' }} />
        <Stack.Screen name="reconstitute/add-blend" options={{ presentation: 'modal' }} />
        <Stack.Screen name="schedule/add-peptide" options={{ presentation: 'modal' }} />
        <Stack.Screen name="schedule/peptide-added" options={{ presentation: 'modal' }} />
        <Stack.Screen name="schedule/notifications" options={{ presentation: 'modal' }} />
        <Stack.Screen name="tracking/intro" options={{ presentation: 'modal' }} />
        <Stack.Screen name="tracking/select-metrics" options={{ presentation: 'modal' }} />
        <Stack.Screen name="tracking/duration" options={{ presentation: 'modal' }} />
        <Stack.Screen name="tracking/baseline" options={{ presentation: 'modal' }} />
        <Stack.Screen name="peptide/[id]/titration" options={{ presentation: 'modal' }} />
        <Stack.Screen name="account/settings" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
