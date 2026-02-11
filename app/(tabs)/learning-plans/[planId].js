import React from 'react';
import LearningPlanDetailsScreen from '../../../src/screens/learningPlans/LearningPlanDetailsScreen';

export const options = {
  title: 'Learning Plan',
  headerShown: true,
  headerBackTitle: 'Back',
};

export default function LearningPlanDetailsRoute() {
  return <LearningPlanDetailsScreen />;
}
