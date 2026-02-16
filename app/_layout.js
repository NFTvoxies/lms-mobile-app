import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { TamaguiProvider } from '@tamagui/core';
import { PortalProvider } from '@tamagui/portal';
import { queryClient } from '../src/api/queryClient';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { OnboardingProvider, useOnboarding } from '../src/contexts/OnboardingContext';
import tamaguiConfig from '../tamagui.config';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

const AuthGate = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || onboardingLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    // If user hasn't completed onboarding and not already on onboarding screen
    if (hasCompletedOnboarding === false && !inOnboarding) {
      router.replace('/onboarding');
      return;
    }

    // Standard auth routing
    if (!isAuthenticated && !inAuthGroup && hasCompletedOnboarding) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, authLoading, hasCompletedOnboarding, onboardingLoading, segments, router]);

  if (authLoading || onboardingLoading) {
    return <LoadingScreen />;
  }

  return children;
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <PortalProvider shouldAddRootHost>
          <OnboardingProvider>
            <AuthProvider>
              <AuthGate>
                <Slot />
                <StatusBar style="auto" />
              </AuthGate>
            </AuthProvider>
          </OnboardingProvider>
        </PortalProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
