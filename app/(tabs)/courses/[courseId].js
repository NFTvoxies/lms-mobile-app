import React from 'react';
import CourseDetailScreen from '../../../src/screens/courses/CourseDetailScreen';

export const options = {
  title: 'Course Details',
  headerShown: false,
  headerBackTitle: 'Back',
};

export default function CourseDetailsRoute() {
  return <CourseDetailScreen />;
}
