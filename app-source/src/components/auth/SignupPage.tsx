import React from 'react';
import { LoginPage, AuthPageProps } from './LoginPage';

export const SignupPage: React.FC<Omit<AuthPageProps, 'mode'>> = (props) => {
  return <LoginPage mode="signup" {...props} />;
};
