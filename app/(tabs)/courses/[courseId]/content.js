import React from 'react';
import CourseContentScreen from '../../../../src/screens/courses/CourseContentScreen';

export const options = {
  title: 'Course Content',
  headerShown: true,
  headerBackTitle: 'Back',
};

export default function CourseContentRoute() {
  return <CourseContentScreen />;
}
