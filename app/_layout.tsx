import '../global.css';

import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { useServerSync } from '../lib/useServerSync';

// Required for expo-web-browser OAuth on iOS — closes the in-app browser after redirect
WebBrowser.maybeCompleteAuthSession();

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
  const { token, isLoading, handleOAuthRedirect, continueAsGuest } = useAuthStore();
  const fetchProfile = useUserStore((s) => s.fetchProfile);

  // Bootstrap: once auth store has hydrated, ensure we always have a token
  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      continueAsGuest();
    } else {
      fetchProfile();
    }
  }, [isLoading]);

  // Handle OAuth deep-link: peptideapp://?token=...&userId=...
  const url = Linking.useURL();
  useEffect(() => {
    if (!url) return;
    const { queryParams } = Linking.parse(url);
    const t = queryParams?.token as string | undefined;
    const uid = queryParams?.userId as string | undefined;
    if (t && uid) {
      handleOAuthRedirect(t, uid).then(() => fetchProfile());
    }
  }, [url]);

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
