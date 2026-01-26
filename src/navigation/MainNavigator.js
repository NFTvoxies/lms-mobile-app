import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import HomeScreen from '../screens/home/HomeScreen';
import CoursesScreen from '../screens/courses/CoursesScreen';
import CourseDetailsScreen from '../screens/courses/CourseDetailsScreen';
import CourseContentScreen from '../screens/courses/CourseContentScreen';
import LearningPlansScreen from '../screens/learningPlans/LearningPlansScreen';
import LearningPlanDetailsScreen from '../screens/learningPlans/LearningPlanDetailsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigators for each tab
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const CoursesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CoursesScreen"
      component={CoursesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CourseDetails"
      component={CourseDetailsScreen}
      options={{
        headerShown: true,
        title: 'Course Details',
        headerBackTitle: 'Back',
      }}
    />
    <Stack.Screen
      name="CourseContent"
      component={CourseContentScreen}
      options={{
        headerShown: true,
        title: 'Course Content',
        headerBackTitle: 'Back',
      }}
    />
  </Stack.Navigator>
);

const LearningPlansStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="LearningPlansScreen"
      component={LearningPlansScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="LearningPlanDetails"
      component={LearningPlanDetailsScreen}
      options={{
        headerShown: true,
        title: 'Learning Plan',
        headerBackTitle: 'Back',
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Courses') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Learning Plans') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Courses" component={CoursesStack} />
      <Tab.Screen name="Learning Plans" component={LearningPlansStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainNavigator;