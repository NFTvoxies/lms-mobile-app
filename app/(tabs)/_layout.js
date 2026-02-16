import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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

// Custom Tab Bar Icon with Active Indicator
const TabBarIcon = ({ routeName, focused, color, size }) => {
  const iconName = getTabIcon(routeName, focused);

  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.activeIndicator} />}
      <Ionicons
        name={iconName}
        size={size || 24}
        color={color}
        style={[
          styles.icon,
          focused && styles.iconFocused
        ]}
      />
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon
            routeName={route.name}
            focused={focused}
            color={color}
            size={size}
          />
        ),
        // Modern color scheme with gradient-inspired colors
        tabBarActiveTintColor: '#4F46E5', // Indigo-600
        tabBarInactiveTintColor: '#9CA3AF', // Gray-400

        // Floating tab bar style
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          elevation: 8,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 10,
          borderTopWidth: 0,
          // Shadow for iOS
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },

        // Label styling
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },

        // Individual item styling
        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: 2,
        },

        // Hide tab bar on specific screens if needed
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarLabel: 'Courses',
        }}
      />
      <Tabs.Screen
        name="learning-plans"
        options={{
          title: 'Learning Plans',
          tabBarLabel: 'Plans',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 40,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF', // Indigo-50
    zIndex: -1,
  },
  icon: {
    marginTop: 0,
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
});
