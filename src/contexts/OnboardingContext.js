import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingContext = createContext({});

const ONBOARDING_KEY = '@lms_onboarding_completed';

export const OnboardingProvider = ({ children }) => {
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            const value = await AsyncStorage.getItem(ONBOARDING_KEY);
            setHasCompletedOnboarding(value === 'true');
        } catch (error) {
            console.error('Error checking onboarding status:', error);
            setHasCompletedOnboarding(false);
        } finally {
            setIsLoading(false);
        }
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            setHasCompletedOnboarding(true);
        } catch (error) {
            console.error('Error completing onboarding:', error);
        }
    };

    const resetOnboarding = async () => {
        try {
            await AsyncStorage.removeItem(ONBOARDING_KEY);
            setHasCompletedOnboarding(false);
        } catch (error) {
            console.error('Error resetting onboarding:', error);
        }
    };

    return (
        <OnboardingContext.Provider
            value={{
                hasCompletedOnboarding,
                isLoading,
                completeOnboarding,
                resetOnboarding,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within OnboardingProvider');
    }
    return context;
};
