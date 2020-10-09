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
      <form onSubmit={onSubmit} className="container">
        <input
          type="email"
          name={inputNames.email}
          placeholder="Email"
          required
          onChange={onChange}
          value={email}
          className="authInput"
        />
        <input
          type="password"
          name={inputNames.password}
          placeholder="Password"
          required
          onChange={onChange}
          value={password}
          className="authInput"
        />
        <input type="submit" className="authInput authSubmit" value={newAccount ? 'Create Account' : 'Log In'} />
        {error && <span className="authError">{error.message}</span>}
      </form>
      <span className="authSwitch" onClick={toggleAccount}>
        {newAccount ? 'Sign in' : 'Create New Account'}
      </span>
    </>
  );
};

export default AuthForm;
