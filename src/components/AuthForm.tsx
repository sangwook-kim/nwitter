import React, { FormEvent, useState } from 'react';
import { FirebaseError } from 'firebase';
import { authService } from '@/fbase';

enum inputNames {
  'email' = 'email',
  'password' = 'password',
}

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<FirebaseError>();
  const [newAccount, setNewAccount] = useState(true);

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { name, value },
    } = e;

    if (name === inputNames.email) {
      setEmail(value);
    } else if (name === inputNames.password) {
      setPassword(value);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (newAccount) {
        await authService.createUserWithEmailAndPassword(email, password);
      } else {
        await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (e) {
      setError(e);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" name={inputNames.email} placeholder="Email" required onChange={onChange} value={email} />
        <input
          type="password"
          name={inputNames.password}
          placeholder="Password"
          required
          onChange={onChange}
          value={password}
        />
        <input type="submit" value={newAccount ? 'Create Account' : 'Log In'} />
        {error ? `${error.message}` : null}
      </form>
      <span onClick={toggleAccount}>{newAccount ? 'Sign in' : 'Create New Account'}</span>
    </>
  );
};

export default AuthForm;
