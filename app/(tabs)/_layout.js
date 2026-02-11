import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const getTabIcon = (routeName, focused) => {
  if (routeName === 'index') {
    return focused ? 'home' : 'home-outline';
  }
  if (routeName === 'courses') {
    return focused ? 'book' : 'book-outline';
  }
  if (routeName === 'learning-plans') {
    return focused ? 'clipboard' : 'clipboard-outline';
  }
  if (routeName === 'profile') {
    return focused ? 'person' : 'person-outline';
  }
  return 'ellipse';
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={getTabIcon(route.name, focused)}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="courses" options={{ title: 'Courses' }} />
      <Tabs.Screen name="learning-plans" options={{ title: 'Learning Plans' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
