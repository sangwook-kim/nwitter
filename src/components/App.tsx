import React, { useEffect, useState } from 'react';
import AppRouter from '@/components/Router';
import { authService } from '@/fbase';

const App: React.FC = () => {
  const [fbaseInit, setFbaseInit] = useState(false);
  const [userObj, setUserObj] = useState<UserObj | null>(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      setUserObj(
        user
          ? {
              displayName: user.displayName,
              uid: user.uid,
              updateDisplayName: (displayName: string) => user.updateProfile({ displayName }),
            }
          : null
      );
      setFbaseInit(true);
    });
  }, []);

  const refreshUser = () => {
    const newUserObj = authService.currentUser;

    if (!newUserObj) return;

    setUserObj({
      displayName: newUserObj.displayName || null,
      uid: newUserObj.uid,
      updateDisplayName: (displayName: string) => newUserObj.updateProfile({ displayName }),
    });
  };

  return (
    <>
      {fbaseInit ? <AppRouter refreshUser={refreshUser} userObj={userObj} /> : '...'}
      {/*
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
      */}
    </>
  );
};

export default App;
