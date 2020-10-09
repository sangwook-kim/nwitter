import React, { FormEvent } from 'react';
import { authService, firebaseInstance } from '@/fbase';
import AuthForm from '@/components/AuthForm';

const Auth: React.FC = () => {
  const onSocialClick = async (e: FormEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = e;
    let provider;
    if (name === 'google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    provider && (await authService.signInWithPopup(provider));
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
