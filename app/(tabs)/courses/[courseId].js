import React from 'react';
import CourseDetailsScreen from '../../../src/screens/courses/CourseDetailsScreen';

export const options = {
  title: 'Course Details',
  headerShown: true,
  headerBackTitle: 'Back',
};

export default function CourseDetailsRoute() {
  return <CourseDetailsScreen />;
}
